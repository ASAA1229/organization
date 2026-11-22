// Organization governance command-line interface. Node standard library only.
//
//   report      [--github] [--config-report <file>] [--no-config] [--out <file>]   full asaa.governance.report.v1 (JSON)
//   health      [--github]                    per-project health ratings with reasons
//   model                                     data-model integrity findings
//   ownership                                 RACI per project and unassigned roles
//   inventory   [--github]                    repositories, standard branches, work branches, promotion lag;
//                                             --github also compares refs with GitHub and lists unregistered repositories
//   compliance                                repository compliance checks and secret scan summary
//   secrets     [--project <id>]              secret detections (file, line, rule, fingerprint; never values)
//   risks                                     risk scores, completeness, dependency readiness and cycles
//   progress    [--project <id>] [--github]   development status and delivery lifecycle (implemented-unverified,
//                                             integrated, tested, accepted, released) from verified evidence
//   trace       <task-id>                     requirement -> task -> repository -> commits/PRs -> evidence
//   contracts                                 integration contract presence and copy drift
//   identity                                  realm clients vs project client settings (service identity contract)
//   data-domains                              data domains: system of record, consumers, undecided owner fields
//   graph       [--format json|dot]           project dependency graph, linked risks and integration order
//   shared-tooling                            copies of shared scripts across repositories and their divergence
//   change-control [--github]                 open pull request rules and protected-branch history
//   pr-check    --base <b> --head <h> [--body-file <f>] [--labels a,b] [--repo <owner/name>] [--head-repo <owner/name>]
//                                             evaluate one pull request (for use in project CI)
//   evidence add --task <id> --by <who> [--repo <id>] [--note <text>] [--requirement <ref>] and one of
//                --kind development --status <status> [--commit <sha>] [--pr <n>] [--blocker <text>]   (default kind)
//                --kind test --result pass|fail --commit <sha> --environment <env> [--scope <text>]
//                --kind acceptance --decision accepted|rejected   (--by must hold an accepting role)
//                --kind release --version <v> --commit <sha on main>
//
// Exit codes: 0 ok, 1 findings with errors (or refused write), 2 usage error.

import { readFileSync, writeFileSync } from 'node:fs';
import { EVIDENCE_PATH, loadEvidence, loadRegistry, summarize } from './lib/core.mjs';
import { buildReport } from './lib/report.mjs';
import { ownershipReport, validateModel } from './lib/model.mjs';
import { inventoryAll } from './lib/inventory.mjs';
import { complianceReport } from './lib/compliance.mjs';
import { riskReport } from './lib/risk.mjs';
import { progressReport, validateEvidenceRecord } from './lib/progress.mjs';
import { changeControlReport, evaluatePullRequest } from './lib/changecontrol.mjs';
import { contractsReport } from './lib/contracts.mjs';
import { dataDomainReport, identityReport, sharedToolingReport } from './lib/interfaces.mjs';
import { dependencyGraph, graphToDot } from './lib/risk.mjs';
import { ORG_ROOT } from './lib/core.mjs';

const argv = process.argv.slice(2);
const command = argv[0];
const flag = (n) => argv.includes(n);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const print = (v) => console.log(JSON.stringify(v, null, 2));
const exitFor = (findings) => { process.exitCode = findings.some((f) => f.severity === 'error') ? 1 : 0; };
const github = flag('--github');

function usage(msg) {
  if (msg) console.error(msg);
  console.error('usage: node scripts/governance.mjs <report|health|model|ownership|inventory|compliance|secrets|risks|progress|trace|contracts|identity|data-domains|shared-tooling|graph|change-control|pr-check|evidence> (see file header)');
  process.exitCode = 2;
}

const reg = command && !['report', 'health'].includes(command) ? loadRegistry() : null;

switch (command) {
  case 'report': {
    const report = buildReport({ github, configReportFile: opt('--config-report') ?? null, runConfiguration: !flag('--no-config') });
    const out = opt('--out');
    if (out) writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
    print(report);
    process.exitCode = report.gate === 'pass' ? 0 : 1;
    break;
  }
  case 'health': {
    const report = buildReport({ github, runConfiguration: !flag('--no-config') });
    for (const p of report.projects) {
      console.log(`${p.health.rating.toUpperCase().padEnd(5)} ${p.name.padEnd(14)} errors ${p.health.errors}, warnings ${p.health.warnings}, compliance ${p.complianceScore ?? 'n/a'}%`);
      for (const r of p.health.reasons) console.log(`      ${r}`);
    }
    console.log(`gate: ${report.gate} ${JSON.stringify(report.summary.bySeverity)}`);
    process.exitCode = report.gate === 'pass' ? 0 : 1;
    break;
  }
  case 'model': { const f = validateModel(reg); print({ findings: f }); exitFor(f); break; }
  case 'ownership': { const r = ownershipReport(reg); print(r); break; }
  case 'inventory': { const r = inventoryAll(reg, { github }); print(r); exitFor(r.flatMap((i) => i.findings)); break; }
  case 'compliance': { const r = complianceReport(reg, { orgRoot: ORG_ROOT, inventory: inventoryAll(reg) }); print({ repositories: r.repositories, summary: summarize(r.findings) }); exitFor(r.findings); break; }
  case 'secrets': {
    const r = complianceReport(reg, { orgRoot: ORG_ROOT });
    const p = opt('--project');
    const f = r.findings.filter((x) => x.category === 'secret' && (!p || x.project === p));
    print({ detections: f.map((x) => ({ project: x.project, severity: x.severity, ...x.data })) });
    exitFor(f);
    break;
  }
  case 'identity': { const r = identityReport(reg); print(r); exitFor(r.findings); break; }
  case 'shared-tooling': { const r = sharedToolingReport(reg); print(r); exitFor(r.findings); break; }
  case 'data-domains': { const r = dataDomainReport(reg); print(r); exitFor(r.findings); break; }
  case 'graph': { const g = dependencyGraph(reg); console.log(opt('--format') === 'dot' ? graphToDot(g) : JSON.stringify(g, null, 2)); break; }
  case 'risks': { const r = riskReport(reg); print(r); exitFor(r.findings); break; }
  case 'progress': {
    const r = progressReport(reg, loadEvidence(), { github });
    const p = opt('--project');
    print({ method: r.method, milestones: r.milestones, projects: r.projects, tasks: p ? r.tasks.filter((t) => t.project === p) : r.tasks, findings: r.findings.filter((f) => f.severity !== 'info') });
    exitFor(r.findings);
    break;
  }
  case 'trace': {
    const id = argv[1];
    if (!id) { usage('trace <task-id>'); break; }
    const t = progressReport(reg, loadEvidence(), { github }).tasks.find((x) => x.id === id);
    if (!t) { usage(`unknown task ${id}`); break; }
    const project = reg.projects.find((p) => p.id === t.project);
    print({ task: t.id, title: t.title, status: t.status, repository: project.repository.slug, ...t.trace, evidence: loadEvidence().records.filter((r) => r.task === id) });
    break;
  }
  case 'contracts': { const r = contractsReport(reg); print(r); exitFor(r.findings); break; }
  case 'change-control': { const r = changeControlReport(reg, { github }); print(r); exitFor(r.findings); break; }
  case 'pr-check': {
    const base = opt('--base');
    const head = opt('--head');
    if (!base || !head) { usage('pr-check --base <b> --head <h> [--body-file <f>] [--labels a,b]'); break; }
    const body = opt('--body-file') ? readFileSync(opt('--body-file'), 'utf8') : '';
    const labels = (opt('--labels') ?? '').split(',').filter(Boolean).map((name) => ({ name }));
    const repository = opt('--repo') ?? null;
    const project = repository ? reg.projects.find((p) => p.repository.slug.toLowerCase() === repository.toLowerCase())?.id ?? null : null;
    const f = evaluatePullRequest(
      { number: Number(opt('--number') ?? 0), baseRefName: base, headRefName: head, body, labels, headRepository: opt('--head-repo') ?? null },
      reg.changeControl,
      { project, repository, enforce: true },
    );
    print({ findings: f });
    exitFor(f);
    break;
  }
  case 'evidence': {
    if (argv[1] !== 'add') { usage('evidence add ...'); break; }
    const task = opt('--task');
    const kind = opt('--kind') ?? 'development';
    const by = opt('--by');
    const taskDef = reg.backlog.tasks.find((t) => t.id === task);
    if (!task || !by) { usage('evidence add --task <id> --by <who> [--kind development|test|acceptance|release] ...'); break; }
    if (!taskDef) { console.error(`refused: unknown task ${task}`); process.exitCode = 1; break; }
    const repo = opt('--repo') ?? taskDef.project;
    const refs = [];
    if (opt('--commit') && kind === 'development') refs.push({ repo, commit: opt('--commit') });
    if (opt('--pr')) refs.push({ repo, pr: Number(opt('--pr')) });
    const record = {
      task, kind, by, date: new Date().toISOString(),
      ...(kind === 'development' ? { status: opt('--status'), refs } : {}),
      ...(kind === 'test' ? { result: opt('--result'), commit: opt('--commit'), environment: opt('--environment'), repo, scope: opt('--scope') ?? null } : {}),
      ...(kind === 'acceptance' ? { decision: opt('--decision'), refs } : {}),
      ...(kind === 'release' ? { version: opt('--version'), commit: opt('--commit'), repo } : {}),
      ...(opt('--blocker') ? { blocker: opt('--blocker') } : {}),
      ...(opt('--note') ? { note: opt('--note') } : {}),
      ...(opt('--requirement') ? { requirements: [opt('--requirement')] } : {}),
    };
    const problems = validateEvidenceRecord(record, reg);
    if (problems.length) { console.error(`refused: ${problems.join('; ')}`); process.exitCode = 1; break; }
    const doc = loadEvidence();
    doc.records.push(record);
    writeFileSync(EVIDENCE_PATH, JSON.stringify(doc, null, 2) + '\n');
    print({ recorded: record });
    break;
  }
  default:
    usage(command ? `unknown command ${command}` : undefined);
}
