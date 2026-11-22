// Project progress, milestone tracking (D0.17), traceability (D0.23) and the delivery lifecycle (Phase E E:D0.10).
//
// Development status is derived from evidence, never typed into a status file:
//   - the latest development evidence record (governance/evidence/evidence.json) with a reviewed status wins;
//   - otherwise commits that cite the task id (in any branch of the task's repositories) mean IN PROGRESS;
//   - otherwise NOT STARTED.
// Evidence references are verified: a cited commit must exist in the repository, and with { github: true } a cited
// pull request must be merged. A reference that fails verification does not count (E:D0.12).
//
// The delivery lifecycle is a separate dimension and is never inferred from a status alone:
//   not-started -> in-development -> implemented-unverified -> integrated -> tested -> accepted -> released
//   integrated  = an implementing commit is reachable from origin/new
//   tested      = a passing test record whose commit contains an implementing commit
//   accepted    = an acceptance record by an authorized role holder (organization owner or the project's accountable role)
//   released    = a release record whose commit is on origin/main and contains an implementing commit
// Each stage requires the previous one, so a released task is always accepted, tested and integrated.

import { finding, gh, git, projectPath } from './core.mjs';
import { milestoneOf } from './model.mjs';

// Phase D ids (D0.1) and Phase E ids (E:D3.4). The Phase E checklist reuses D-numbers with different meanings, so its
// ids carry the E: prefix and a bare D-token never matches inside an E: token.
const TASK_TOKEN = /(?<![A-Za-z]:)\bD([0-5])\.(\d{1,2})(?:\s*[-–]\s*(?:D\1\.)?(\d{1,2}))?\b/g;
const PHASE_E_TOKEN = /\bE:D([0-6])\.(\d{1,2})(?:\s*[-–]\s*(?:E:D\1\.)?(\d{1,2}))?\b/g;

function expand(ids, prefix, m) {
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  if (to >= from && to - from <= 30) for (let n = from; n <= to; n += 1) ids.add(`${prefix}D${m[1]}.${n}`);
}

// Extracts task ids from text, expanding ranges such as "D0.1-D0.3", "D2.3-5" and "E:D3.1-3".
export function extractTaskIds(text) {
  const ids = new Set();
  for (const m of text.matchAll(TASK_TOKEN)) expand(ids, '', m);
  for (const m of text.matchAll(PHASE_E_TOKEN)) expand(ids, 'E:', m);
  return [...ids];
}

// Collects commits per task id for one repository: Map(taskId -> [{ commit, date, subject, pr }]).
export function commitEvidence(repoPath) {
  const out = git(repoPath, ['log', '--all', '--format=%H%x1f%cI%x1f%s%x1f%b%x1e']);
  const byTask = new Map();
  if (out === null) return byTask;
  for (const record of out.split('\x1e')) {
    const [commit, date, subject, body] = record.replace(/^\n/, '').split('\x1f');
    if (!commit) continue;
    const pr = /Merge pull request #(\d+)/.exec(subject)?.[1] ?? /\(#(\d+)\)\s*$/.exec(subject)?.[1] ?? null;
    for (const id of extractTaskIds(`${subject}\n${body ?? ''}`)) {
      const list = byTask.get(id) ?? [];
      list.push({ commit, date, subject, pr: pr ? Number(pr) : null });
      byTask.set(id, list);
    }
  }
  return byTask;
}

// Commits reachable from each standard flow branch on origin. A closed or merged pull request is not assumed to have
// reached every branch.
export const FLOW_BRANCHES = ['new', 'dev', 'main'];

export function branchReachability(repoPath) {
  const sets = {};
  for (const b of FLOW_BRANCHES) {
    const out = git(repoPath, ['rev-list', `origin/${b}`]);
    sets[b] = out === null ? null : new Set(out.split('\n').filter(Boolean));
  }
  return sets;
}

export const LIFECYCLE = ['not-started', 'in-development', 'implemented-unverified', 'integrated', 'tested', 'accepted', 'released'];
export const EVIDENCE_KINDS = ['development', 'test', 'acceptance', 'release'];

const kindOf = (r) => r.kind ?? 'development';
const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
const latest = (records, taskId, kind) => records.filter((r) => r.task === taskId && kindOf(r) === kind).sort(byDate).at(-1) ?? null;

// Role holders allowed to accept a task: the organization owner and the holder of the project's accountable role.
export function authorizedAcceptors(reg, projectId) {
  const roles = new Map((reg.organization.roles ?? []).map((r) => [r.id, r.holder]));
  const project = reg.projects.find((p) => p.id === projectId);
  return new Set([roles.get('organization-owner'), roles.get(project?.raci?.accountable)].filter(Boolean));
}

// Static validation of evidence records (no repository access).
export function validateEvidenceRecord(r, reg) {
  const problems = [];
  const kind = kindOf(r);
  const task = reg.backlog.tasks.find((t) => t.id === r.task);
  if (!task) problems.push(`evidence names unknown task ${r.task}`);
  if (!EVIDENCE_KINDS.includes(kind)) problems.push(`unknown evidence kind ${kind}`);
  if (!r.by) problems.push('evidence has no recorder (by)');
  if (kind === 'development') {
    if (!reg.backlog.statuses.includes(r.status)) problems.push(`unknown status ${r.status}`);
    if (/BLOCKED/.test(r.status ?? '') && !r.blocker) problems.push(`${r.status} without a recorded blocker`);
    if (r.status === 'IMPLEMENTED' && !(r.refs ?? []).some((x) => x.commit || x.pr)) problems.push('IMPLEMENTED needs a commit or pull request reference');
  }
  if (kind === 'test') {
    if (!['pass', 'fail'].includes(r.result)) problems.push('test evidence needs result pass or fail');
    if (!r.commit) problems.push('test evidence needs the tested commit');
    if (!r.environment) problems.push('test evidence needs the environment');
  }
  if (kind === 'acceptance') {
    if (!['accepted', 'rejected'].includes(r.decision)) problems.push('acceptance evidence needs decision accepted or rejected');
    if (task && !authorizedAcceptors(reg, task.project).has(r.by)) problems.push(`acceptance recorded by ${r.by}, who holds no accepting role for ${task.project}`);
  }
  if (kind === 'release') {
    if (!r.version) problems.push('release evidence needs a version');
    if (!r.commit) problems.push('release evidence needs the released commit');
  }
  return problems;
}

const commitExists = (path, sha) => git(path, ['cat-file', '-e', `${sha}^{commit}`]) !== null;
const resolve = (path, sha) => git(path, ['rev-parse', '--verify', '--quiet', `${sha}^{commit}`])?.trim() ?? null;
const contains = (path, ancestor, descendant) => git(path, ['merge-base', '--is-ancestor', ancestor, descendant]) !== null;

// Projects whose commits count for a task: the task's project, or every project of a cross-project milestone.
function evidenceProjects(reg, t) {
  const m = reg.backlog.milestones.find((x) => x.id === milestoneOf(t.id));
  return m && m.projects.length > 1 ? m.projects : [t.project];
}

export function progressReport(reg, evidence, { root, github = false } = {}) {
  const findings = [];
  const statuses = reg.backlog.statuses;
  const records = evidence.records ?? [];
  const paths = new Map(reg.projects.map((p) => [p.id, projectPath(p, root)]));
  const commitsByProject = new Map();
  const reachByProject = new Map();
  for (const p of reg.projects) {
    commitsByProject.set(p.id, commitEvidence(paths.get(p.id)));
    reachByProject.set(p.id, branchReachability(paths.get(p.id)));
  }
  const prCache = new Map();
  const prState = (projectId, number) => {
    const key = `${projectId}#${number}`;
    if (!prCache.has(key)) {
      const slug = reg.projects.find((p) => p.id === projectId)?.repository.slug;
      prCache.set(key, slug ? gh(['pr', 'view', String(number), '-R', slug, '--json', 'state,mergeCommit']) : null);
    }
    return prCache.get(key);
  };

  for (const r of records) {
    for (const problem of validateEvidenceRecord(r, reg)) {
      findings.push(finding({ code: 'EVIDENCE-INVALID', category: 'progress', severity: 'error', subject: `${r.task}:${kindOf(r)}:${r.date}`, message: `${r.task}: ${problem}` }));
    }
  }

  // Verifies one record's references and returns the implementing commits they establish: [{ project, commit }].
  const verifiedRefs = (r, task) => {
    const out = [];
    for (const ref of r.refs ?? []) {
      const project = ref.repo ?? task.project;
      const path = paths.get(project);
      if (ref.commit) {
        const sha = path ? resolve(path, ref.commit) : null;
        if (!sha) findings.push(finding({ code: 'EVIDENCE-REF-INVALID', category: 'progress', severity: 'error', project, subject: `${r.task}:${ref.commit}`, message: `${r.task} cites commit ${ref.commit}, which does not exist in ${project}`, remediation: 'cite a commit that exists in the repository' }));
        else out.push({ project, commit: sha });
      }
      if (ref.pr) {
        if (!github) { out.push({ project, pr: ref.pr, unverified: true }); continue; }
        const pr = prState(project, ref.pr);
        if (pr === null) {
          findings.push(finding({ code: 'EVIDENCE-PR-UNVERIFIED', category: 'progress', severity: 'info', project, subject: `${r.task}:#${ref.pr}`, message: `${r.task}: pull request #${ref.pr} could not be read from GitHub` }));
        } else if (pr.state !== 'MERGED') {
          findings.push(finding({ code: 'EVIDENCE-PR-NOT-MERGED', category: 'progress', severity: 'error', project, subject: `${r.task}:#${ref.pr}`, message: `${r.task} cites pull request #${ref.pr}, which is ${pr.state.toLowerCase()} and not merged; it is not implementation evidence`, remediation: 'cite the merged pull request or commit that carries the implementation' }));
        } else if (pr.mergeCommit?.oid && path && commitExists(path, pr.mergeCommit.oid)) {
          out.push({ project, commit: pr.mergeCommit.oid, pr: ref.pr });
        }
      }
    }
    return out;
  };

  const tasks = reg.backlog.tasks.map((t) => {
    const projects = evidenceProjects(reg, t);
    const commits = projects.flatMap((p) => (commitsByProject.get(p)?.get(t.id) ?? []).map((c) => ({ ...c, project: p })));
    const record = latest(records, t.id, 'development');
    const refs = record ? verifiedRefs(record, t) : [];
    let status = 'NOT STARTED';
    let source = 'none';
    if (record && statuses.includes(record.status)) { status = record.status; source = 'evidence-record'; }
    else if (commits.length) { status = 'IN PROGRESS'; source = 'commits'; }

    const implementing = [...commits.map((c) => ({ project: c.project, commit: c.commit })), ...refs.filter((r) => r.commit)];
    const hasEvidence = implementing.length > 0 || refs.some((r) => r.unverified);
    if (status === 'IMPLEMENTED' && !hasEvidence) {
      findings.push(finding({ code: 'STATUS-WITHOUT-EVIDENCE', category: 'progress', severity: 'error', project: t.project, subject: t.id, message: `${t.id} is recorded IMPLEMENTED but no verified commit or merged pull request evidence exists`, remediation: 'link the implementing commit or merged pull request, or correct the status (ORG-R03)' }));
    }

    const onBranch = (b) => implementing.some((c) => reachByProject.get(c.project)?.[b]?.has(c.commit));
    const integration = Object.fromEntries(FLOW_BRANCHES.map((b) => [b, implementing.length ? onBranch(b) : false]));
    if (status === 'IMPLEMENTED' && implementing.length > 0 && !integration.new) {
      findings.push(finding({ code: 'IMPLEMENTED-NOT-INTEGRATED', category: 'progress', severity: 'warning', project: t.project, subject: t.id, message: `${t.id} is recorded IMPLEMENTED but none of its commits is on new`, remediation: 'merge the implementing pull request into new, or correct the status' }));
    }

    // Lifecycle stages; each requires the previous one.
    const containsImpl = (project, sha) => implementing.some((c) => c.project === project && contains(paths.get(project), c.commit, sha));
    const projectOfRecord = (r) => r.repo ?? t.project;
    const test = latest(records, t.id, 'test');
    const acceptance = latest(records, t.id, 'acceptance');
    const release = latest(records, t.id, 'release');
    const implemented = status === 'IMPLEMENTED' && hasEvidence;
    const integrated = implemented && integration.new;
    const testSha = test?.commit ? resolve(paths.get(projectOfRecord(test)) ?? '', test.commit) : null;
    const tested = integrated && test?.result === 'pass' && !!testSha && containsImpl(projectOfRecord(test), testSha);
    const accepted = tested && acceptance?.decision === 'accepted' && validateEvidenceRecord(acceptance, reg).length === 0;
    const releaseProject = release ? projectOfRecord(release) : null;
    const releaseSha = release?.commit ? resolve(paths.get(releaseProject) ?? '', release.commit) : null;
    const released = accepted && !!releaseSha && reachByProject.get(releaseProject)?.main?.has(releaseSha) && containsImpl(releaseProject, releaseSha);
    if (release && !released && accepted) {
      findings.push(finding({ code: 'RELEASE-NOT-ON-MAIN', category: 'progress', severity: 'warning', project: t.project, subject: `${t.id}:release`, message: `${t.id} release ${release.version} does not name a commit on main that contains the implementation` }));
    }
    const lifecycle = released ? 'released' : accepted ? 'accepted' : tested ? 'tested' : integrated ? 'integrated'
      : implemented ? 'implemented-unverified' : commits.length || (record && status !== 'NOT STARTED') ? 'in-development' : 'not-started';

    return {
      id: t.id, project: t.project, milestone: milestoneOf(t.id), checklist: t.checklist ?? 'phase-d', title: t.title, status, source, lifecycle,
      blocker: record?.blocker ?? null,
      integration,
      trace: {
        requirements: [...(t.requirements ?? []), ...(record?.requirements ?? [])],
        commits: commits.map((c) => `${c.project}:${c.commit.slice(0, 12)}`),
        pullRequests: [...new Set([...commits.map((c) => c.pr).filter(Boolean), ...refs.map((r) => r.pr).filter(Boolean)])],
        evidenceRecords: records.filter((r) => r.task === t.id).length,
      },
    };
  });

  for (const t of tasks) {
    if (t.trace.requirements.length === 0) {
      findings.push(finding({ code: 'TRACE-NO-REQUIREMENT', category: 'traceability', severity: 'info', project: t.project, subject: t.id, message: `${t.id} has no requirement reference (requirement IDs pending baseline reconciliation, ORG-R01)` }));
    }
  }

  const count = (list, status) => list.filter((t) => t.status === status).length;
  const lifecycleCounts = (list) => Object.fromEntries(LIFECYCLE.map((s) => [s, list.filter((t) => t.lifecycle === s).length]));
  const milestones = reg.backlog.milestones.map((m) => {
    const list = tasks.filter((t) => t.milestone === m.id);
    const implemented = count(list, 'IMPLEMENTED');
    const blocked = list.filter((t) => t.status.startsWith('BLOCKED')).length;
    return {
      id: m.id, title: m.title, priority: m.priority, checklist: m.checklist ?? 'phase-d', tasks: list.length,
      byStatus: Object.fromEntries(statuses.map((s) => [s, count(list, s)])),
      byLifecycle: lifecycleCounts(list),
      implementedPercent: list.length ? Math.round((implemented / list.length) * 100) : null,
      independentScopePercent: list.length - blocked ? Math.round((implemented / (list.length - blocked)) * 100) : null,
    };
  });

  const projects = reg.projects.map((p) => {
    const list = tasks.filter((t) => t.project === p.id);
    return { project: p.id, baselinePercent: p.baselineProgress?.percent ?? null, tasks: list.length, byStatus: Object.fromEntries(statuses.map((s) => [s, count(list, s)])), byLifecycle: lifecycleCounts(list) };
  });

  return {
    tasks, milestones, projects, findings,
    method: 'development status from the latest development evidence record (verified references only), else IN PROGRESS when commits cite the task id, else NOT STARTED; lifecycle is separate: integrated = implementing commit on origin/new, tested/accepted/released need test, acceptance (authorized role holder) and release (commit on main) records; percentages = IMPLEMENTED / tasks (and / non-blocked tasks)',
  };
}
