// Shared helpers for the organization governance engines. Node standard library only.
// Findings use the same shape as the Configuration project's policy findings so both reports can be merged.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const WORKSPACE_ROOT = process.env.ASAA_WORKSPACE_ROOT ? resolve(process.env.ASAA_WORKSPACE_ROOT) : resolve(ORG_ROOT, '..');
export const REGISTRY_DIR = join(ORG_ROOT, 'governance', 'registry');
export const EVIDENCE_PATH = join(ORG_ROOT, 'governance', 'evidence', 'evidence.json');

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));
}

export function loadRegistry(dir = REGISTRY_DIR) {
  const file = (name) => readJson(join(dir, `${name}.json`));
  return {
    organization: file('organization'),
    projects: file('projects').projects,
    risks: file('risks'),
    dependencies: file('dependencies').dependencies,
    backlog: file('backlog'),
    changeControl: file('change-control'),
    contracts: file('contracts').contracts,
  };
}

export function loadEvidence(path = EVIDENCE_PATH) {
  return existsSync(path) ? readJson(path) : { schema: 'asaa.governance.evidence.v1', records: [] };
}

export function projectPath(project, root = WORKSPACE_ROOT) {
  return join(root, project.repository.localDir);
}

export function finding({ code, category, severity = 'error', project = null, subject, message, remediation = null, data = null }) {
  const id = `${code}:${createHash('sha256').update(`${code}|${project ?? ''}|${subject}`).digest('hex').slice(0, 10)}`;
  return { id, code, category, severity, project, subject, message, remediation, ...(data ? { data } : {}) };
}

export function summarize(findings) {
  const bySeverity = { error: 0, warning: 0, info: 0 };
  const byCategory = {};
  for (const f of findings) {
    bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;
    byCategory[f.category] = (byCategory[f.category] ?? 0) + 1;
  }
  return { total: findings.length, bySeverity, byCategory, gate: bySeverity.error === 0 ? 'pass' : 'fail' };
}

// Runs git in a repository. Returns stdout, or null when git fails (missing repository, unknown ref).
export function git(repoPath, args) {
  try {
    return execFileSync('git', args, { cwd: repoPath, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
}

// Runs the GitHub CLI. Returns parsed JSON or null (not installed, not authenticated, offline).
export function gh(args) {
  try {
    const out = execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 });
    return JSON.parse(out);
  } catch {
    return null;
  }
}
