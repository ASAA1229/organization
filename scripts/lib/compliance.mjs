// Repository compliance detection (D0.19) and secret scanning across the six repositories (D0.20).
// Each repository is checked against the organization baseline. Results are findings plus a compliance score.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { finding, git, projectPath, readJson } from './core.mjs';
import { scanFiles } from './secrets.mjs';

export const ALLOWLIST_PATH = 'governance/secret-scan-allowlist.json';

export function trackedFiles(repoPath) {
  const out = git(repoPath, ['ls-files', '-z']);
  return out === null ? null : out.split('\0').filter(Boolean);
}

function loadAllowlist(orgRoot) {
  const path = join(orgRoot, ALLOWLIST_PATH);
  if (!existsSync(path)) return new Set();
  const doc = readJson(path);
  return new Set((doc.entries ?? []).map((e) => e.fingerprint ?? `${e.file}:${e.rule}`));
}

export function scanRepositorySecrets(project, { root, orgRoot } = {}) {
  const path = projectPath(project, root);
  const files = trackedFiles(path);
  if (files === null) return { scanned: 0, detections: [], available: false };
  const allowlist = loadAllowlist(orgRoot);
  const detections = scanFiles(files, (f) => readFileSync(join(path, f), 'utf8'), { allowlist })
    .map((d) => ({ ...d, allowKey: d.fingerprint ?? `${d.file}:${d.rule}` }));
  return { scanned: files.length, detections, available: true };
}

function workflowText(files, path) {
  return files.filter((f) => f.startsWith('.github/workflows/') && /\.ya?ml$/.test(f)).map((f) => readFileSync(join(path, f), 'utf8'));
}

const CHECKS = [
  { id: 'readme', label: 'README present', test: (files) => files.includes('README.md') },
  { id: 'gitignore', label: '.gitignore present', test: (files) => files.includes('.gitignore') },
  { id: 'gitignore-env', label: '.gitignore excludes env files', test: (files, path) => files.includes('.gitignore') && /(^|\n)\s*\.env/.test(readFileSync(join(path, '.gitignore'), 'utf8')) },
  { id: 'ci-workflow', label: 'GitHub Actions workflow present', test: (files) => files.some((f) => f.startsWith('.github/workflows/') && /\.ya?ml$/.test(f)) },
  { id: 'no-workflow-write-all', label: 'workflows do not grant write-all permissions', test: (files, path) => files.filter((f) => f.startsWith('.github/workflows/')).every((f) => !/permissions:\s*write-all/.test(readFileSync(join(path, f), 'utf8'))) },
  // Every repository runs the shared change-control check on its pull requests; product repositories also run the
  // Configuration policy gate (E:D2.8, E:D0.9).
  { id: 'change-control-gate', label: 'pull requests run the organization change-control check', test: (files, path) => workflowText(files, path).some((t) => /ASAA1229\/organization\/\.github\/workflows\/change-control\.yml@|\.\/\.github\/workflows\/change-control\.yml/.test(t)) },
  { id: 'policy-gate', label: 'pull requests run the Configuration policy gate (product repositories)', applies: (p) => p.kind === 'product', test: (files, path) => workflowText(files, path).some((t) => /ASAA1229\/Configuration\/\.github\/workflows\/organization-policy-ci\.yml@/.test(t)) },
  { id: 'ecosystem-contract', label: 'ecosystem contract copy present (product repositories)', applies: (p) => p.kind === 'product', test: (files) => files.some((f) => /contracts\/(asaa-)?ecosystem\/v1\/ecosystem-registry\.json$/.test(f)) },
];

export function complianceReport(reg, { root, orgRoot, inventory = [] } = {}) {
  const findings = [];
  const repositories = [];
  for (const project of reg.projects) {
    const path = projectPath(project, root);
    const files = trackedFiles(path);
    if (files === null) {
      repositories.push({ project: project.id, available: false, score: null, checks: [] });
      continue;
    }
    const checks = CHECKS.filter((c) => !c.applies || c.applies(project)).map((c) => {
      let ok;
      try { ok = c.test(files, path); } catch { ok = false; }
      if (!ok) findings.push(finding({ code: 'COMPLIANCE-GAP', category: 'compliance', severity: 'warning', project: project.id, subject: `${project.id}:${c.id}`, message: `${project.name}: ${c.label} — not met` }));
      return { id: c.id, label: c.label, ok };
    });
    const inv = inventory.find((i) => i.project === project.id);
    if (inv?.present) checks.push({ id: 'standard-branches', label: 'all standard branches exist on origin', ok: inv.missingStandardBranches.length === 0 });

    const secrets = scanRepositorySecrets(project, { root, orgRoot });
    for (const d of secrets.detections) {
      const severity = d.severity === 'critical' || d.severity === 'high' ? 'error' : d.severity === 'medium' ? 'warning' : 'info';
      findings.push(finding({
        code: d.line === null ? 'SECRET-FILE-TRACKED' : 'SECRET-DETECTED', category: 'secret', severity, project: project.id,
        subject: `${project.id}:${d.file}:${d.line ?? '-'}:${d.rule}`,
        message: `${project.name}: ${d.rule} in ${d.file}${d.line ? ` line ${d.line}` : ''} (${d.severity})`,
        remediation: 'remove the material, rotate the credential if real, or allow-list the fingerprint after review',
        data: { rule: d.rule, file: d.file, line: d.line, fingerprint: d.fingerprint, allowKey: d.allowKey },
      }));
    }
    checks.push({ id: 'no-secrets', label: 'no unreviewed secret material in tracked files', ok: secrets.detections.every((d) => d.severity !== 'critical' && d.severity !== 'high') });
    const passed = checks.filter((c) => c.ok).length;
    repositories.push({ project: project.id, available: true, score: Math.round((passed / checks.length) * 100), checks, secretScan: { scanned: secrets.scanned, detections: secrets.detections.length } });
  }
  return { repositories, findings };
}
