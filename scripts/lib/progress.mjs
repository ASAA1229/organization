// Project progress and milestone tracking (D0.17) and traceability (D0.23).
//
// Task status is derived from evidence, never typed into a status file:
//   - an evidence record (governance/evidence/evidence.json) with a reviewed status wins;
//   - otherwise commits that cite the task id (in any branch of the task's repository) mean IN PROGRESS;
//   - otherwise NOT STARTED.
// An IMPLEMENTED record without commit evidence in the repository is an error (status without evidence, ORG-R03).
// Traceability links requirement references -> task -> repository -> commits / pull requests -> evidence records.

import { finding, git, projectPath } from './core.mjs';
import { milestoneOf } from './model.mjs';

const TASK_TOKEN = /\bD([0-5])\.(\d{1,2})(?:\s*[-–]\s*(?:D\1\.)?(\d{1,2}))?\b/g;

// Extracts task ids from text, expanding ranges such as "D0.1-D0.3" and "D2.3-5".
export function extractTaskIds(text) {
  const ids = new Set();
  for (const m of text.matchAll(TASK_TOKEN)) {
    const phase = m[1];
    const from = Number(m[2]);
    const to = m[3] ? Number(m[3]) : from;
    if (to >= from && to - from <= 30) for (let n = from; n <= to; n += 1) ids.add(`D${phase}.${n}`);
  }
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

// Commits reachable from each standard flow branch on origin, so a task's commits can be located in new, dev and main.
// A closed or merged pull request is not assumed to have reached every branch.
export const FLOW_BRANCHES = ['new', 'dev', 'main'];

export function branchReachability(repoPath) {
  const sets = {};
  for (const b of FLOW_BRANCHES) {
    const out = git(repoPath, ['rev-list', `origin/${b}`]);
    sets[b] = out === null ? null : new Set(out.split('\n').filter(Boolean));
  }
  return sets;
}

function integrationOf(commits, reach) {
  if (!reach) return null;
  return Object.fromEntries(FLOW_BRANCHES.map((b) => [b, reach[b] === null ? null : commits.some((c) => reach[b].has(c.commit))]));
}

function latestRecord(records, taskId) {
  return records.filter((r) => r.task === taskId).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)).at(-1) ?? null;
}

export function progressReport(reg, evidence, { root } = {}) {
  const findings = [];
  const statuses = reg.backlog.statuses;
  const commitsByProject = new Map();
  const reachByProject = new Map();
  for (const p of reg.projects) {
    commitsByProject.set(p.id, commitEvidence(projectPath(p, root)));
    reachByProject.set(p.id, branchReachability(projectPath(p, root)));
  }

  for (const r of evidence.records ?? []) {
    if (!statuses.includes(r.status)) findings.push(finding({ code: 'EVIDENCE-INVALID', category: 'progress', severity: 'error', subject: `${r.task}:${r.date}`, message: `evidence for ${r.task} uses unknown status ${r.status}` }));
    if (!reg.backlog.tasks.some((t) => t.id === r.task)) findings.push(finding({ code: 'EVIDENCE-INVALID', category: 'progress', severity: 'error', subject: `${r.task}:${r.date}`, message: `evidence names unknown task ${r.task}` }));
    if (/BLOCKED/.test(r.status) && !r.blocker) findings.push(finding({ code: 'EVIDENCE-INVALID', category: 'progress', severity: 'error', subject: `${r.task}:${r.date}`, message: `${r.task} is ${r.status} without a recorded blocker` }));
  }

  const tasks = reg.backlog.tasks.map((t) => {
    const commits = commitsByProject.get(t.project)?.get(t.id) ?? [];
    const record = latestRecord(evidence.records ?? [], t.id);
    let status = 'NOT STARTED';
    let source = 'none';
    if (record) { status = record.status; source = 'evidence-record'; }
    else if (commits.length) { status = 'IN PROGRESS'; source = 'commits'; }
    if (status === 'IMPLEMENTED' && commits.length === 0 && !(record?.refs ?? []).some((r) => r.commit || r.pr)) {
      findings.push(finding({ code: 'STATUS-WITHOUT-EVIDENCE', category: 'progress', severity: 'error', project: t.project, subject: t.id, message: `${t.id} is recorded IMPLEMENTED but no commit or pull request evidence exists`, remediation: 'link the implementing commit or pull request, or correct the status (ORG-R03)' }));
    }
    const integration = integrationOf(commits, reachByProject.get(t.project));
    if (status === 'IMPLEMENTED' && commits.length > 0 && integration?.new === false) {
      findings.push(finding({ code: 'IMPLEMENTED-NOT-INTEGRATED', category: 'progress', severity: 'warning', project: t.project, subject: t.id, message: `${t.id} is recorded IMPLEMENTED but none of its commits is on new`, remediation: 'merge the implementing pull request into new, or correct the status' }));
    }
    return {
      id: t.id, project: t.project, milestone: milestoneOf(t.id), title: t.title, status, source,
      blocker: record?.blocker ?? null,
      integration,
      trace: {
        requirements: [...(t.requirements ?? []), ...(record?.requirements ?? [])],
        commits: commits.map((c) => c.commit.slice(0, 12)),
        pullRequests: [...new Set([...commits.map((c) => c.pr).filter(Boolean), ...((record?.refs ?? []).map((r) => r.pr).filter(Boolean))])],
        evidenceRecords: (evidence.records ?? []).filter((r) => r.task === t.id).length,
      },
    };
  });

  for (const t of tasks) {
    if (t.trace.requirements.length === 0) {
      findings.push(finding({ code: 'TRACE-NO-REQUIREMENT', category: 'traceability', severity: 'info', project: t.project, subject: t.id, message: `${t.id} has no requirement reference (requirement IDs pending baseline reconciliation, ORG-R01)` }));
    }
  }

  const count = (list, status) => list.filter((t) => t.status === status).length;
  const milestones = reg.backlog.milestones.map((m) => {
    const list = tasks.filter((t) => t.milestone === m.id);
    const implemented = count(list, 'IMPLEMENTED');
    const blocked = list.filter((t) => t.status.startsWith('BLOCKED')).length;
    return {
      id: m.id, title: m.title, priority: m.priority, tasks: list.length,
      byStatus: Object.fromEntries(statuses.map((s) => [s, count(list, s)])),
      implementedPercent: list.length ? Math.round((implemented / list.length) * 100) : null,
      independentScopePercent: list.length - blocked ? Math.round((implemented / (list.length - blocked)) * 100) : null,
    };
  });

  const projects = reg.projects.map((p) => {
    const list = tasks.filter((t) => t.project === p.id);
    return { project: p.id, baselinePercent: p.baselineProgress?.percent ?? null, tasks: list.length, byStatus: Object.fromEntries(statuses.map((s) => [s, count(list, s)])) };
  });

  return { tasks, milestones, projects, findings, method: 'status from latest evidence record, else IN PROGRESS when commits cite the task id, else NOT STARTED; percentages = IMPLEMENTED / tasks (and / non-blocked tasks); integration = whether a citing commit is reachable from origin/new, dev and main' };
}
