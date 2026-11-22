// Cross-project interface checks (Phase E E:D0.4, E:D0.6, E:D0.7).
//   - identity: every client in the Configuration realm is mapped to its owning project, every mapped client exists in
//     the realm with the right type, and each consumer declares the same client id in its example configuration
//   - data domains: each shared data domain names its system of record with evidence on origin/new; owner,
//     classification, retention and correction/deletion workflow that are still undecided are reported
// Files are read from origin/new (the integrated branch), not from the working tree.

import { createHash } from 'node:crypto';
import { finding, git, projectPath } from './core.mjs';

export const INTEGRATED_REF = 'origin/new';

function readAt(reg, projectId, path, { root, ref = INTEGRATED_REF } = {}) {
  const project = reg.projects.find((p) => p.id === projectId);
  if (!project) return null;
  return git(projectPath(project, root), ['show', `${ref}:${path}`]);
}

// Reads KEY=value from an env example; commented assignments (# KEY=value) count as the documented value.
export function envValue(text, key) {
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*#?\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (m && m[1] === key) return { value: m[2].trim().replace(/^["']|["']$/g, ''), commented: /^\s*#/.test(line) };
  }
  return null;
}

const EXPECTED_TYPE = {
  'user-login': (c) => !c.serviceAccountsEnabled,
  'service-account': (c) => c.serviceAccountsEnabled === true && c.publicClient !== true,
  'api-audience': (c) => c.publicClient !== true && !c.serviceAccountsEnabled,
};

export function identityReport(reg, options = {}) {
  const findings = [];
  const identity = reg.identity;
  if (!identity) return { clients: [], findings };
  const realmText = readAt(reg, identity.realm.project, identity.realm.path, options);
  if (realmText === null) {
    findings.push(finding({ code: 'IDENTITY-REALM-UNAVAILABLE', category: 'identity', severity: 'warning', subject: identity.realm.path, message: `identity realm ${identity.realm.project}:${identity.realm.path} is not readable on ${INTEGRATED_REF}` }));
    return { clients: [], findings };
  }
  const realm = JSON.parse(realmText);
  const realmClients = new Map((realm.clients ?? []).map((c) => [c.clientId, c]));
  const mapped = new Map(identity.clients.map((c) => [c.clientId, c]));

  for (const id of realmClients.keys()) {
    if (!mapped.has(id)) findings.push(finding({ code: 'IDENTITY-CLIENT-UNMAPPED', category: 'identity', severity: 'warning', subject: id, message: `realm client ${id} is not mapped to an owning project in governance/registry/identity.json`, remediation: 'map the client to its project and consumer, or remove it from the realm (owner decision)' }));
  }
  const clients = identity.clients.map((c) => {
    const rc = realmClients.get(c.clientId);
    const result = { clientId: c.clientId, project: c.project, kind: c.kind, inRealm: !!rc, typeOk: null, consumer: null };
    if (!rc) {
      findings.push(finding({ code: 'IDENTITY-CLIENT-MISSING', category: 'identity', severity: 'error', project: c.project, subject: c.clientId, message: `${c.project} expects client ${c.clientId}, which is not in the realm`, remediation: 'add the client to the realm or correct the mapping' }));
      return result;
    }
    result.typeOk = EXPECTED_TYPE[c.kind]?.(rc) ?? null;
    if (result.typeOk === false) findings.push(finding({ code: 'IDENTITY-CLIENT-TYPE', category: 'identity', severity: 'error', project: c.project, subject: c.clientId, message: `realm client ${c.clientId} is not configured as a ${c.kind} client (public ${!!rc.publicClient}, service account ${!!rc.serviceAccountsEnabled})`, remediation: 'service accounts must be confidential with service accounts enabled; least-privilege identities only' }));
    if (!c.consumer) {
      findings.push(finding({ code: 'IDENTITY-NO-CONSUMER', category: 'identity', severity: 'warning', project: c.project, subject: c.clientId, message: `realm client ${c.clientId} has no consumer in ${c.project}`, remediation: 'owner decision: adopt the shared identity in the project or remove the client (canonical identity approach is still open)' }));
      return result;
    }
    const text = readAt(reg, c.consumer.project, c.consumer.path, options);
    const setting = text === null ? null : envValue(text, c.consumer.key);
    result.consumer = { ...c.consumer, declared: setting?.value ?? null };
    if (setting === null) {
      findings.push(finding({ code: 'IDENTITY-CONSUMER-MISSING', category: 'identity', severity: 'warning', project: c.consumer.project, subject: `${c.clientId}:${c.consumer.key}`, message: `${c.consumer.project}:${c.consumer.path} does not declare ${c.consumer.key} for client ${c.clientId}`, remediation: 'declare the setting in the example configuration' }));
    } else if (setting.value === '') {
      findings.push(finding({ code: 'IDENTITY-CONSUMER-UNSET', category: 'identity', severity: 'info', project: c.consumer.project, subject: `${c.clientId}:${c.consumer.key}`, message: `${c.consumer.project} leaves ${c.consumer.key} empty in ${c.consumer.path} (expected ${c.clientId} when enabled)` }));
    } else if (setting.value !== c.clientId) {
      findings.push(finding({ code: 'IDENTITY-CONSUMER-MISMATCH', category: 'identity', severity: 'error', project: c.consumer.project, subject: `${c.clientId}:${c.consumer.key}`, message: `${c.consumer.project} declares ${c.consumer.key}=${setting.value} but the realm client is ${c.clientId}`, remediation: 'align the client id with the realm' }));
    }
    return result;
  });
  return { clients, findings };
}

export function dataDomainReport(reg, options = {}) {
  const findings = [];
  const doc = reg.dataDomains;
  if (!doc) return { domains: [], findings };
  const projectIds = new Set(reg.projects.map((p) => p.id));
  const domains = doc.domains.map((d) => {
    if (!projectIds.has(d.systemOfRecord)) findings.push(finding({ code: 'DATA-DOMAIN-INVALID', category: 'data-ownership', severity: 'error', subject: d.id, message: `data domain ${d.id} system of record ${d.systemOfRecord} is not a project` }));
    for (const c of [...(d.consumers ?? []), ...(d.producers ?? [])]) {
      if (!projectIds.has(c)) findings.push(finding({ code: 'DATA-DOMAIN-INVALID', category: 'data-ownership', severity: 'error', subject: d.id, message: `data domain ${d.id} names unknown project ${c}` }));
    }
    const evidenceOk = (d.evidence ?? []).map((e) => {
      const project = reg.projects.find((p) => p.id === e.project);
      const ok = project ? git(projectPath(project, options.root), ['cat-file', '-e', `${INTEGRATED_REF}:${e.path}`]) !== null : false;
      if (!ok) findings.push(finding({ code: 'DATA-DOMAIN-EVIDENCE-MISSING', category: 'data-ownership', severity: 'warning', project: e.project, subject: `${d.id}:${e.path}`, message: `data domain ${d.id} cites ${e.project}:${e.path}, which is not on ${INTEGRATED_REF}` }));
      return ok;
    });
    const undecided = doc.requiredFields.filter((f) => d[f] === null || d[f] === undefined || d[f] === '');
    if (undecided.length) findings.push(finding({ code: 'DATA-DOMAIN-UNDECIDED', category: 'data-ownership', severity: d.personalData ? 'warning' : 'info', project: d.systemOfRecord, subject: d.id, message: `data domain ${d.id} (${d.title}) has no recorded ${undecided.join(', ')}`, remediation: 'owner decision (ECOSYSTEM_ARCHITECTURE.md section 4)', data: { undecided } }));
    if (d.personalData && (d.consumers ?? []).length && d.id !== 'identities') findings.push(finding({ code: 'DATA-DOMAIN-PERSONAL-SHARED', category: 'data-ownership', severity: 'warning', project: d.systemOfRecord, subject: d.id, message: `personal-data domain ${d.id} lists consumers ${d.consumers.join(', ')}; copying needs an approved purpose and access model` }));
    return { id: d.id, systemOfRecord: d.systemOfRecord, consumers: d.consumers ?? [], producers: d.producers ?? [], personalData: !!d.personalData, evidencePresent: evidenceOk.every(Boolean), undecided };
  });
  return { domains, findings };
}

// Duplicated tooling across repositories (E2:D0.8, E2:D1.9): each registered tool's copies are compared on origin/new
// (line endings normalised). Diverged copies are reported so the owner can decide whether to consolidate; a copy that
// disappeared from a project is reported as a register error.
export function sharedToolingReport(reg, options = {}) {
  const findings = [];
  const doc = reg.sharedTooling;
  if (!doc) return { tools: [], findings };
  const tools = doc.tools.map((t) => {
    const copies = t.projects.map((projectId) => {
      const text = readAt(reg, projectId, t.path, options);
      return { project: projectId, present: text !== null, digest: text === null ? null : createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex').slice(0, 12) };
    });
    for (const c of copies.filter((x) => !x.present)) findings.push(finding({ code: 'SHARED-TOOLING-MISSING', category: 'shared-tooling', severity: 'warning', project: c.project, subject: `${t.id}:${c.project}`, message: `${t.id}: ${c.project} no longer has ${t.path}; update governance/registry/shared-tooling.json` }));
    const variants = new Set(copies.filter((x) => x.present).map((x) => x.digest));
    if (variants.size > 1) findings.push(finding({ code: 'SHARED-TOOLING-DIVERGED', category: 'shared-tooling', severity: 'info', subject: t.id, message: `${t.id} has ${variants.size} different copies across ${copies.filter((x) => x.present).map((x) => x.project).join(', ')}`, remediation: doc.consolidationDecision ? null : 'owner decision: consolidate into one shared tool or keep project-specific variants' }));
    return { id: t.id, path: t.path, copies, variants: variants.size };
  });
  return { tools, findings, consolidationDecision: doc.consolidationDecision };
}
