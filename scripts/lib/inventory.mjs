// Repository and branch inventory (D0.14). Reads local sibling checkouts with git only (no network). With
// { github: true } it also asks the GitHub CLI for branch protection, which is otherwise reported as unverified.

import { existsSync } from 'node:fs';
import { finding, gh, git, projectPath } from './core.mjs';

function refs(repoPath, pattern) {
  const out = git(repoPath, ['for-each-ref', '--format=%(refname:short)%09%(objectname)%09%(committerdate:iso-strict)', pattern]);
  if (out === null) return [];
  return out.split('\n').filter(Boolean).map((line) => {
    const [name, sha, date] = line.split('\t');
    return { name, sha, date };
  });
}

function aheadBehind(repoPath, a, b) {
  const out = git(repoPath, ['rev-list', '--left-right', '--count', `${a}...${b}`]);
  if (!out) return null;
  const [ahead, behind] = out.trim().split(/\s+/).map(Number);
  return { ahead, behind };
}

export function inventoryRepository(project, { github = false, standardBranches, protectedBranches, root } = {}) {
  const path = projectPath(project, root);
  const findings = [];
  if (!existsSync(path) || git(path, ['rev-parse', '--git-dir']) === null) {
    findings.push(finding({ code: 'REPO-MISSING', category: 'inventory', severity: 'warning', project: project.id, subject: project.repository.slug, message: `${project.name}: no local checkout at ${project.repository.localDir}` }));
    return { project: project.id, slug: project.repository.slug, present: false, findings };
  }
  const remote = refs(path, 'refs/remotes/origin');
  const local = refs(path, 'refs/heads');
  const remoteNames = new Set(remote.map((r) => r.name.replace(/^origin\//, '')));
  const missing = standardBranches.filter((b) => !remoteNames.has(b));
  for (const b of missing) {
    findings.push(finding({ code: 'BRANCH-MISSING', category: 'inventory', severity: 'error', project: project.id, subject: `${project.repository.slug}:${b}`, message: `${project.name}: standard branch ${b} does not exist on origin`, remediation: `create ${b} from the agreed base through the normal flow` }));
  }
  const workBranches = [...remoteNames].filter((b) => b !== 'HEAD' && b !== 'origin' && !standardBranches.includes(b)).sort();
  const promotion = {
    newVsDev: remoteNames.has('new') && remoteNames.has('dev') ? aheadBehind(path, 'origin/new', 'origin/dev') : null,
    devVsMain: remoteNames.has('dev') && remoteNames.has('main') ? aheadBehind(path, 'origin/dev', 'origin/main') : null,
  };
  promotionFindings(project, path, remoteNames, findings);
  const status = git(path, ['status', '--porcelain']);
  const current = git(path, ['branch', '--show-current'])?.trim() ?? null;

  let protection = protectedBranches.map((b) => ({ branch: b, protected: null, verified: false }));
  if (github) {
    protection = protectedBranches.map((b) => {
      const data = gh(['api', `repos/${project.repository.slug}/branches/${b}`]);
      return { branch: b, protected: data ? data.protected === true : null, verified: data !== null };
    });
    for (const p of protection) {
      if (p.verified && !p.protected) findings.push(finding({ code: 'BRANCH-UNPROTECTED', category: 'compliance', severity: 'error', project: project.id, subject: `${project.repository.slug}:${p.branch}`, message: `${project.name}: ${p.branch} is not protected on GitHub (DEC-ORG-004)`, remediation: 'repository admin configures branch protection or a ruleset (owner-controlled GitHub setting)' }));
    }
  }
  let githubSync = null;
  if (github) githubSync = syncWithGithub(project, remote, findings);
  for (const p of protection.filter((x) => !x.verified)) {
    findings.push(finding({ code: 'PROTECTION-UNVERIFIED', category: 'compliance', severity: 'info', project: project.id, subject: `${project.repository.slug}:${p.branch}`, message: `${project.name}: protection of ${p.branch} not verified (run with --github)` }));
  }

  return {
    project: project.id,
    slug: project.repository.slug,
    present: true,
    currentBranch: current,
    workingTreeClean: status !== null && status.trim() === '',
    standardBranches: standardBranches.map((b) => ({ branch: b, sha: remote.find((r) => r.name === `origin/${b}`)?.sha ?? null })),
    missingStandardBranches: missing,
    workBranches,
    localBranches: local.map((l) => l.name),
    promotion,
    protection,
    githubSync,
    findings,
  };
}

// Promotion state along new -> dev -> main. Commits waiting for promotion are informational (promotion needs owner
// authorization). Non-merge commits that exist only on the downstream protected branch mean content entered a
// protected branch outside the flow, or was never brought back to new.
const FLOW = [['new', 'dev'], ['dev', 'main']];

function promotionFindings(project, path, remoteNames, findings) {
  for (const [from, to] of FLOW) {
    if (!remoteNames.has(from) || !remoteNames.has(to)) continue;
    const pending = git(path, ['rev-list', '--count', `origin/${to}..origin/${from}`]);
    const pendingCount = pending === null ? 0 : Number(pending.trim());
    if (pendingCount > 0) {
      findings.push(finding({ code: 'PROMOTION-PENDING', category: 'inventory', severity: 'info', project: project.id, subject: `${project.repository.slug}:${from}->${to}`, message: `${project.name}: ${pendingCount} commit(s) on ${from} are not yet promoted to ${to}`, remediation: `promote ${from} to ${to} through an owner-authorized pull request`, data: { from, to, commits: pendingCount } }));
    }
    const only = git(path, ['rev-list', '--no-merges', `origin/${from}..origin/${to}`]);
    const onlyCommits = only === null ? [] : only.split('\n').filter(Boolean);
    if (onlyCommits.length > 0) {
      findings.push(finding({ code: 'PROTECTED-ONLY-CONTENT', category: 'change-control', severity: 'warning', project: project.id, subject: `${project.repository.slug}:${to}-not-in-${from}`, message: `${project.name}: ${onlyCommits.length} non-merge commit(s) exist on ${to} but not on ${from}`, remediation: `bring the commits back to ${from} through a pull request so the next promotion does not lose or conflict with them`, data: { from, to, commits: onlyCommits.slice(0, 20).map((c) => c.slice(0, 12)) } }));
    }
  }
}

// Compares the local origin refs with GitHub. Stale refs make every other inventory result out of date.
function syncWithGithub(project, remote, findings) {
  const branches = gh(['api', `repos/${project.repository.slug}/branches?per_page=100`]);
  if (!Array.isArray(branches)) {
    findings.push(finding({ code: 'GITHUB-UNAVAILABLE', category: 'inventory', severity: 'info', project: project.id, subject: project.repository.slug, message: `${project.name}: GitHub branch list could not be read` }));
    return { available: false };
  }
  const local = new Map(remote.filter((r) => r.name !== 'origin/HEAD' && r.name !== 'origin').map((r) => [r.name.replace(/^origin\//, ''), r.sha]));
  const onGithub = new Map(branches.map((b) => [b.name, b.commit?.sha]));
  const stale = [];
  const notFetched = [];
  const deleted = [];
  for (const [name, sha] of onGithub) {
    if (!local.has(name)) notFetched.push(name);
    else if (local.get(name) !== sha) stale.push(name);
  }
  for (const name of local.keys()) if (!onGithub.has(name)) deleted.push(name);
  if (stale.length) findings.push(finding({ code: 'INVENTORY-STALE', category: 'inventory', severity: 'warning', project: project.id, subject: `${project.repository.slug}:stale`, message: `${project.name}: local refs differ from GitHub for ${stale.join(', ')}`, remediation: 'git fetch --prune before relying on this inventory', data: { branches: stale } }));
  if (notFetched.length) findings.push(finding({ code: 'INVENTORY-STALE', category: 'inventory', severity: 'info', project: project.id, subject: `${project.repository.slug}:not-fetched`, message: `${project.name}: GitHub branches not fetched locally: ${notFetched.join(', ')}`, data: { branches: notFetched } }));
  if (deleted.length) findings.push(finding({ code: 'INVENTORY-STALE', category: 'inventory', severity: 'info', project: project.id, subject: `${project.repository.slug}:deleted`, message: `${project.name}: local refs for branches deleted on GitHub: ${deleted.join(', ')}`, remediation: 'git fetch --prune', data: { branches: deleted } }));
  return { available: true, branches: onGithub.size, stale, notFetched, deleted };
}

export function inventoryAll(reg, options = {}) {
  const standardBranches = reg.organization.standardBranches;
  const protectedBranches = reg.organization.protectedBranches;
  const results = reg.projects.map((p) => inventoryRepository(p, { ...options, standardBranches, protectedBranches }));
  if (options.github) results.push(unregisteredRepositories(reg));
  return results;
}

// Repositories that exist in the GitHub organization but are not in the governance registry.
function unregisteredRepositories(reg) {
  const owners = [...new Set(reg.projects.map((p) => p.repository.slug.split('/')[0]))];
  const known = new Set(reg.projects.map((p) => p.repository.slug.toLowerCase()));
  const findings = [];
  const unregistered = [];
  for (const owner of owners) {
    const repos = gh(['repo', 'list', owner, '--limit', '200', '--json', 'nameWithOwner,isArchived']);
    if (!Array.isArray(repos)) continue;
    for (const r of repos) {
      if (r.isArchived || known.has(r.nameWithOwner.toLowerCase())) continue;
      unregistered.push(r.nameWithOwner);
      findings.push(finding({ code: 'REPO-UNREGISTERED', category: 'inventory', severity: 'warning', subject: r.nameWithOwner, message: `${r.nameWithOwner} exists on GitHub but is not in governance/registry/projects.json`, remediation: 'the owner registers the repository with its baseline and ownership, or archives it' }));
    }
  }
  return { project: null, slug: null, present: false, organizationScan: true, unregistered, findings };
}
