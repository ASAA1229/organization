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
    findings,
  };
}

export function inventoryAll(reg, options = {}) {
  const standardBranches = reg.organization.standardBranches;
  const protectedBranches = reg.organization.protectedBranches;
  return reg.projects.map((p) => inventoryRepository(p, { ...options, standardBranches, protectedBranches }));
}
