// Cross-project status aggregation (D0.21) and centralized health and risk reporting (D0.22).
// Produces asaa.governance.report.v1: every engine's output plus a per-project health rating with the reasons that
// determined it. The Configuration policy report (asaa.configuration.policy-report.v1) is merged when available.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ORG_ROOT, WORKSPACE_ROOT, loadEvidence, loadRegistry, readJson, summarize } from './core.mjs';
import { ownershipReport, validateModel } from './model.mjs';
import { inventoryAll } from './inventory.mjs';
import { complianceReport } from './compliance.mjs';
import { riskReport } from './risk.mjs';
import { progressReport } from './progress.mjs';
import { changeControlReport } from './changecontrol.mjs';
import { contractsReport } from './contracts.mjs';

export const GOVERNANCE_REPORT_SCHEMA = 'asaa.governance.report.v1';

const CONFIG_REPO_NAMES = { ASAA: 'asaa', JARVIS: 'jarvis', Templates: 'templates', Portfolio: 'portfolio', configuration: 'configuration' };

// Loads the Configuration policy report from a file, or runs Configuration's check-all in the sibling checkout.
export function loadConfigurationReport({ file = null, root = WORKSPACE_ROOT, run = true } = {}) {
  if (file) return existsSync(file) ? readJson(file) : null;
  const script = join(root, 'Configuration', 'checks', 'check-all.mjs');
  if (!run || !existsSync(script)) return null;
  try {
    const out = execFileSync(process.execPath, [script, '--json'], { cwd: join(root, 'Configuration'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
    return JSON.parse(out);
  } catch (e) {
    // check-all exits 1 when its gate fails but still prints the report.
    try { return JSON.parse(e.stdout); } catch { return null; }
  }
}

function configurationFindings(configReport) {
  if (!configReport?.findings) return [];
  return configReport.findings.map((f) => ({
    id: `CFG:${f.id}`, code: f.code, category: `configuration-${f.category}`, severity: f.severity,
    project: CONFIG_REPO_NAMES[f.repo] ?? (f.repo ? String(f.repo).toLowerCase() : 'configuration'),
    subject: f.subject, message: f.message, remediation: f.remediation ?? null,
  }));
}

function health(projectId, findings) {
  const own = findings.filter((f) => f.project === projectId);
  const errors = own.filter((f) => f.severity === 'error');
  const warnings = own.filter((f) => f.severity === 'warning');
  const rating = errors.length ? 'red' : warnings.length ? 'amber' : 'green';
  const reasons = [...errors, ...warnings].slice(0, 10).map((f) => `${f.severity}: [${f.code}] ${f.message}`);
  return { rating, errors: errors.length, warnings: warnings.length, reasons };
}

export function buildReport({ root = WORKSPACE_ROOT, github = false, configReportFile = null, runConfiguration = true, now = new Date() } = {}) {
  const reg = loadRegistry();
  const evidence = loadEvidence();
  const model = validateModel(reg);
  const ownership = ownershipReport(reg);
  const inventory = inventoryAll(reg, { github, root });
  const compliance = complianceReport(reg, { root, orgRoot: ORG_ROOT, inventory });
  const risk = riskReport(reg, { today: now.toISOString().slice(0, 10) });
  const progress = progressReport(reg, evidence, { root });
  const changeControl = changeControlReport(reg, { root, github });
  const contracts = contractsReport(reg, { root });
  const configReport = loadConfigurationReport({ file: configReportFile, root, run: runConfiguration });

  const findings = [
    ...model, ...ownership.findings, ...inventory.flatMap((i) => i.findings), ...compliance.findings, ...risk.findings,
    ...progress.findings, ...changeControl.findings, ...contracts.findings, ...configurationFindings(configReport),
  ];

  const projects = reg.projects.map((p) => {
    const comp = compliance.repositories.find((r) => r.project === p.id);
    const prog = progress.projects.find((r) => r.project === p.id);
    const inv = inventory.find((i) => i.project === p.id);
    return {
      project: p.id, name: p.name, slug: p.repository.slug,
      health: health(p.id, findings),
      complianceScore: comp?.score ?? null,
      progress: prog,
      branches: inv?.present ? { missing: inv.missingStandardBranches, workBranches: inv.workBranches.length, promotion: inv.promotion } : null,
      riskExposure: (risk.exposure[p.id] ?? []).length,
    };
  });

  return {
    schema: GOVERNANCE_REPORT_SCHEMA,
    generatedAt: now.toISOString(),
    sources: { github, configurationPolicyReport: configReport ? configReport.gate ?? 'present' : 'unavailable' },
    gate: summarize(findings).gate,
    summary: summarize(findings),
    projects,
    milestones: progress.milestones,
    progressMethod: progress.method,
    risks: risk.risks,
    dependencies: risk.dependencies,
    ownership: ownership.projects,
    inventory: inventory.map(({ findings: _f, ...rest }) => rest),
    compliance: compliance.repositories,
    contracts: contracts.contracts,
    pullRequests: changeControl.pullRequests,
    tasks: progress.tasks,
    findings,
  };
}

export { ORG_ROOT };
