// Organization-wide delivery checkpoints (Phase E3 E3:D2.1).
//
// Each checkpoint is evaluated against its own exit criteria from repository and evidence data, never from project
// completion percentages. A criterion is met, not met, or not-tracked (no evidence source exists for it yet). A
// checkpoint is Complete only when every criterion is met; Not started when none is met and no evidence exists;
// Blocked when an unmet criterion depends on an owner action; otherwise In progress.
//
//   1 Requirements and development backlog   2 Development completion   3 Testing and validation
//   4 Documentation and operational readiness  5 Release approval

const ACTIVE_CHECKLISTS = ['phase-e2', 'phase-e3'];

function criterion(id, label, met, detail, { owner = false, tracked = true } = {}) {
  return { id, label, state: !tracked ? 'not-tracked' : met ? 'met' : 'not-met', detail, ownerDependent: owner };
}

function statusOf(criteria, { started }) {
  if (criteria.every((c) => c.state === 'met')) return 'Complete';
  if (!started) return 'Not started';
  if (criteria.some((c) => c.state === 'not-met' && c.ownerDependent)) return 'Blocked';
  return 'In progress';
}

export function checkpointReport({ reg, progress, inventory, findings, evidence }) {
  const tasks = progress.tasks.filter((t) => ACTIVE_CHECKLISTS.includes(t.checklist));
  const records = evidence.records ?? [];
  const count = (pred) => tasks.filter(pred).length;
  const resolved = (t) => t.status === 'IMPLEMENTED' || t.status.startsWith('BLOCKED') || t.status === 'OUT OF SCOPE' || t.status === 'DEFERRED — TESTING';
  const has = (code) => findings.filter((f) => f.code === code);
  const pendingPromotion = inventory.filter((i) => i.present).flatMap((i) => (i.promotion?.newVsDev?.ahead ? [`${i.project}: ${i.promotion.newVsDev.ahead} commit(s)`] : []));
  const unprotected = has('BRANCH-UNPROTECTED');
  const tests = records.filter((r) => r.kind === 'test');
  const acceptances = records.filter((r) => r.kind === 'acceptance' && r.decision === 'accepted');
  const releases = records.filter((r) => r.kind === 'release');

  const cp1 = [
    criterion('unique-ids', 'every task has a unique identifier', !findings.some((f) => f.code === 'MODEL-INVALID' && /duplicated/.test(f.message)), `${tasks.length} active tasks`),
    criterion('dependencies', 'cross-project dependencies have contracts', !findings.some((f) => f.code === 'MODEL-INVALID' && /names no contract/.test(f.message)), has('MODEL-INVALID').filter((f) => /names no contract/.test(f.message)).map((f) => f.subject).join(', ') || 'all dependencies name a contract', { owner: true }),
    criterion('requirements-linked', 'every task links a requirement reference', tasks.every((t) => t.trace.requirements.length > 0), `${count((t) => t.trace.requirements.length === 0)} task(s) without a requirement reference (ORG-R01 baseline reconciliation)`, { owner: true }),
    criterion('blockers-recorded', 'every blocked task records its blocker', tasks.filter((t) => t.status.startsWith('BLOCKED')).every((t) => t.blocker), `${count((t) => t.status.startsWith('BLOCKED'))} blocked task(s)`),
  ];
  const cp2 = [
    criterion('tasks-resolved', 'every active task is implemented or explicitly classified', tasks.every(resolved), `${count((t) => !resolved(t))} task(s) not yet implemented or classified`),
    criterion('integrated', 'implemented work is on new', !tasks.some((t) => t.status === 'IMPLEMENTED' && !t.integration.new), `${count((t) => t.status === 'IMPLEMENTED' && !t.integration.new)} implemented task(s) not on new`),
    criterion('promoted', 'new is promoted to dev in every repository', pendingPromotion.length === 0, pendingPromotion.join('; ') || 'dev contains new everywhere', { owner: true }),
    criterion('contracts', 'cross-project contracts implemented', !findings.some((f) => ['CONTRACT-MISSING', 'CONTRACT-DRIFT', 'CONTRACT-NOT-IMPLEMENTED', 'IDENTITY-CLIENT-MISSING', 'IDENTITY-CONSUMER-MISMATCH'].includes(f.code)), has('CONTRACT-NOT-IMPLEMENTED').map((f) => f.subject).join(', ') || 'no contract gaps'),
    criterion('owner-blockers', 'owner-dependent tasks decided', !tasks.some((t) => t.status === 'BLOCKED — OWNER'), `${count((t) => t.status === 'BLOCKED — OWNER')} task(s) waiting on owner decisions`, { owner: true }),
  ];
  const cp3 = [
    criterion('test-evidence', 'passing test evidence for implemented tasks', tasks.filter((t) => t.status === 'IMPLEMENTED').every((t) => ['tested', 'accepted', 'released'].includes(t.lifecycle)), `${tests.length} test record(s); ${count((t) => ['tested', 'accepted', 'released'].includes(t.lifecycle))} task(s) tested`),
  ];
  const cp4 = [
    criterion('documentation', 'documentation reflects the tested implementation', false, 'no documentation evidence source is defined yet', { tracked: false }),
  ];
  const cp5 = [
    criterion('protection', 'branch protection on dev and main', unprotected.length === 0, unprotected.length ? `${unprotected.length} protected branch(es) unprotected` : 'protected', { owner: true }),
    criterion('accepted', 'release candidate accepted by an authorized role holder', acceptances.length > 0, `${acceptances.length} acceptance record(s)`, { owner: true }),
    criterion('release-record', 'release recorded on main', releases.length > 0, `${releases.length} release record(s)`, { owner: true }),
  ];

  return [
    { id: 1, name: 'Requirements and development backlog', status: statusOf(cp1, { started: true }), criteria: cp1 },
    { id: 2, name: 'Development completion', status: statusOf(cp2, { started: true }), criteria: cp2 },
    { id: 3, name: 'Testing and validation', status: statusOf(cp3, { started: tests.length > 0 }), criteria: cp3 },
    { id: 4, name: 'Documentation and operational readiness', status: 'Not started', criteria: cp4 },
    { id: 5, name: 'Release approval', status: statusOf(cp5, { started: acceptances.length + releases.length > 0 }), criteria: cp5 },
  ];
}
