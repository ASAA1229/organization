// Change-control and governance-policy enforcement (D0.18, D0.24).
//   - pull request rules: routine work targets new; dev/main only through an allowed promotion that carries the
//     owner-authorization marker; the PR body contains every required section
//   - protected-branch history: dev and main change only through merge commits (first-parent, non-merge commits
//     since the policy baseline are reported)
// Pull request data comes from the GitHub CLI when available; evaluatePullRequest() is pure and reusable from CI.

import { finding, gh, git, projectPath } from './core.mjs';

export const POLICY_BASELINE_DATE = '2026-11-14';

export function missingSections(body, cc) {
  const text = (body ?? '').toLowerCase();
  return cc.pullRequestBodySections.filter((s) => !s.patterns.some((p) => text.includes(p))).map((s) => s.id);
}

// pr: { number, title, baseRefName, headRefName, body, labels: [{name}], headRepository? }. Returns findings.
// enforce=true (pull request CI) makes a promotion without the owner-authorization marker an error, so the required
// check blocks the merge until the owner adds the marker. Reports over open pull requests keep it a warning.
export function evaluatePullRequest(pr, cc, { project = null, enforce = false, repository = null } = {}) {
  const out = [];
  const subject = `${project ?? ''}#${pr.number}`;
  const labels = new Set((pr.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name)));
  const authorized = cc.promotionAuthorization.acceptedMarkers.some((m) => m.startsWith('label:') && labels.has(m.slice(6)));
  const base = pr.baseRefName;
  const head = pr.headRefName;

  if (cc.protectedBases.includes(base)) {
    const allowed = cc.allowedPromotions.some((p) => p.from === head && p.to === base);
    if (!allowed) {
      out.push(finding({ code: 'PR-PROTECTED-BASE', category: 'change-control', severity: 'error', project, subject, message: `PR #${pr.number} targets protected ${base} from ${head}; only ${cc.allowedPromotions.map((p) => `${p.from}->${p.to}`).join(', ')} promotions may target protected branches`, remediation: `retarget the pull request to ${cc.routinePullRequestBase}` }));
    } else if (!authorized) {
      out.push(finding({ code: 'PR-PROMOTION-UNAUTHORIZED', category: 'change-control', severity: enforce ? 'error' : 'warning', project, subject, message: `promotion PR #${pr.number} (${head}->${base}) has no owner-authorization marker`, remediation: 'do not merge until the owner authorizes the promotion' }));
    }
    // A promotion must come from the same repository's branch, never from a fork that happens to use the same name.
    if (allowed && repository && pr.headRepository && pr.headRepository !== repository) {
      out.push(finding({ code: 'PR-PROTECTED-BASE', category: 'change-control', severity: 'error', project, subject, message: `PR #${pr.number} promotes ${head} from ${pr.headRepository}, not from ${repository}`, remediation: 'promotions are opened from the repository\'s own branch' }));
    }
  } else if (base !== cc.routinePullRequestBase) {
    out.push(finding({ code: 'PR-NONSTANDARD-BASE', category: 'change-control', severity: 'warning', project, subject, message: `PR #${pr.number} targets ${base}; routine work targets ${cc.routinePullRequestBase}` }));
  }
  const missing = missingSections(pr.body, cc);
  if (missing.length) {
    out.push(finding({ code: 'PR-BODY-INCOMPLETE', category: 'change-control', severity: 'warning', project, subject, message: `PR #${pr.number} body is missing: ${missing.join(', ')}`, data: { missing } }));
  }
  return out;
}

export function protectedHistoryFindings(project, reg, { root, since = POLICY_BASELINE_DATE } = {}) {
  const out = [];
  const path = projectPath(project, root);
  for (const branch of reg.organization.protectedBranches) {
    const log = git(path, ['log', '--first-parent', '--no-merges', `--since=${since}`, '--format=%H%x1f%s', `origin/${branch}`]);
    if (!log) continue;
    for (const line of log.split('\n').filter(Boolean)) {
      const [commit, subject] = line.split('\x1f');
      out.push(finding({ code: 'PROTECTED-DIRECT-COMMIT', category: 'change-control', severity: 'warning', project: project.id, subject: `${project.id}:${branch}:${commit.slice(0, 12)}`, message: `${project.name}: ${branch} has a non-merge first-parent commit ${commit.slice(0, 12)} (${subject.slice(0, 60)})`, remediation: 'protected branches should only change through reviewed merges' }));
    }
  }
  return out;
}

export function changeControlReport(reg, { root, github = false } = {}) {
  const findings = [];
  const pullRequests = [];
  for (const project of reg.projects) {
    findings.push(...protectedHistoryFindings(project, reg, { root }));
    if (!github) continue;
    const prs = gh(['pr', 'list', '-R', project.repository.slug, '--state', 'open', '--limit', '100', '--json', 'number,title,baseRefName,headRefName,body,labels']);
    if (prs === null) {
      findings.push(finding({ code: 'PR-DATA-UNAVAILABLE', category: 'change-control', severity: 'info', project: project.id, subject: project.repository.slug, message: `${project.name}: open pull requests could not be read (gh unavailable or unauthenticated)` }));
      continue;
    }
    for (const pr of prs) {
      const prFindings = evaluatePullRequest(pr, reg.changeControl, { project: project.id });
      findings.push(...prFindings);
      pullRequests.push({ project: project.id, number: pr.number, base: pr.baseRefName, head: pr.headRefName, compliant: prFindings.every((f) => f.severity !== 'error') });
    }
  }
  return { pullRequests, findings };
}
