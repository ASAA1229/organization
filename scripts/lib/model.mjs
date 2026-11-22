// Organization and project data model: integrity, ownership/responsibility management (RACI) and lookups.
// D0.13 data model, D0.15 ownership and responsibility management.

import { finding } from './core.mjs';

const PROJECT_ID = /^[a-z][a-z0-9-]*$/;
const SLUG = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

// Referential and structural integrity of the whole registry. Returns findings.
export function validateModel(reg) {
  const out = [];
  const add = (severity, subject, message, remediation = null) => out.push(finding({ code: 'MODEL-INVALID', category: 'model', severity, subject, message, remediation }));
  const roles = new Map(reg.organization.roles.map((r) => [r.id, r]));
  const projectIds = new Set();

  for (const p of reg.projects) {
    if (!PROJECT_ID.test(p.id)) add('error', p.id, `project id ${p.id} is not a lower-case identifier`);
    if (projectIds.has(p.id)) add('error', p.id, `project id ${p.id} is duplicated`);
    projectIds.add(p.id);
    if (!SLUG.test(p.repository?.slug ?? '')) add('error', p.id, `project ${p.id} has no valid repository slug`);
    if (!['Professional', 'Personal'].includes(p.classification)) add('error', p.id, `project ${p.id} classification must be Professional or Personal`);
    for (const key of ['accountable', 'responsible']) {
      const role = p.raci?.[key];
      if (!role) add('error', p.id, `project ${p.id} has no ${key} role`);
      else if (!roles.has(role)) add('error', p.id, `project ${p.id} ${key} role ${role} is not defined`);
    }
    for (const role of [...(p.raci?.consulted ?? []), ...(p.raci?.informed ?? [])]) {
      if (!roles.has(role)) add('error', p.id, `project ${p.id} references undefined role ${role}`);
    }
  }

  for (const r of reg.risks.risks) {
    if (r.owner && !roles.has(r.owner)) add('error', r.id, `risk ${r.id} owner ${r.owner} is not a defined role`);
    for (const dep of r.relatedDependencies ?? []) {
      if (!reg.dependencies.some((d) => d.id === dep)) add('error', r.id, `risk ${r.id} references unknown dependency ${dep}`);
    }
  }
  for (const d of reg.dependencies) {
    if (!projectIds.has(d.provider)) add('error', d.id, `dependency ${d.id} provider ${d.provider} is not a project`);
    for (const c of d.consumers) if (!projectIds.has(c)) add('error', d.id, `dependency ${d.id} consumer ${c} is not a project`);
    if (d.owner && !roles.has(d.owner)) add('error', d.id, `dependency ${d.id} owner ${d.owner} is not a defined role`);
    for (const e of d.evidence ?? []) if (!projectIds.has(e.project)) add('error', d.id, `dependency ${d.id} evidence names unknown project ${e.project}`);
  }
  const taskIds = new Set();
  const milestoneIds = new Set(reg.backlog.milestones.map((m) => m.id));
  for (const t of reg.backlog.tasks) {
    if (taskIds.has(t.id)) add('error', t.id, `task ${t.id} is duplicated`);
    taskIds.add(t.id);
    if (!projectIds.has(t.project)) add('error', t.id, `task ${t.id} project ${t.project} is not a project`);
    if (!milestoneIds.has(milestoneOf(t.id))) add('error', t.id, `task ${t.id} does not belong to a defined milestone`);
  }
  for (const c of reg.contracts) {
    if (!projectIds.has(c.provider)) add('error', c.id, `contract ${c.id} provider ${c.provider} is not a project`);
    for (const copy of [c.canonical, ...c.copies]) if (!projectIds.has(copy.project)) add('error', c.id, `contract ${c.id} names unknown project ${copy.project}`);
  }
  return out;
}

export function milestoneOf(taskId) {
  return taskId.split('.')[0];
}

// RACI resolution and ownership gaps (D0.15). Role holders that are unassigned are owner decisions, not errors.
export function ownershipReport(reg) {
  const roles = new Map(reg.organization.roles.map((r) => [r.id, r]));
  const findings = [];
  const projects = reg.projects.map((p) => {
    const resolve = (roleId) => ({ role: roleId, holder: roles.get(roleId)?.holder ?? null });
    const raci = {
      accountable: resolve(p.raci.accountable),
      responsible: resolve(p.raci.responsible),
      consulted: (p.raci.consulted ?? []).map(resolve),
      informed: (p.raci.informed ?? []).map(resolve),
    };
    for (const [kind, entry] of [['accountable', raci.accountable], ['responsible', raci.responsible]]) {
      if (!entry.holder) {
        findings.push(finding({ code: 'OWNER-UNASSIGNED', category: 'ownership', severity: 'warning', project: p.id, subject: `${p.id}:${kind}`, message: `${p.name}: ${kind} role ${entry.role} has no named holder`, remediation: 'owner decision: name the role holder (ORG-R10)' }));
      }
    }
    return { project: p.id, name: p.name, responsibilities: p.responsibilities, raci };
  });
  // Responsibilities must not be claimed by two projects (duplicated responsibilities between shared services).
  const claimed = new Map();
  for (const p of reg.projects) for (const r of p.responsibilities ?? []) claimed.set(r, [...(claimed.get(r) ?? []), p.id]);
  for (const [r, owners] of claimed) {
    if (owners.length > 1) findings.push(finding({ code: 'RESPONSIBILITY-DUPLICATED', category: 'ownership', severity: 'warning', subject: r, message: `responsibility ${r} is claimed by ${owners.join(', ')}`, remediation: 'assign the responsibility to one project and make the others consumers' }));
  }
  return { projects, roles: [...roles.values()], findings };
}

export function responsibleProjectFor(reg, responsibility) {
  return reg.projects.find((p) => (p.responsibilities ?? []).includes(responsibility))?.id ?? null;
}
