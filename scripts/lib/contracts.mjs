// Integration contracts between the six repositories (D0.25).
// Each contract has a canonical file in its provider and optional copies in consumers. Copies must exist and be
// semantically identical (JSON compared after parsing, so formatting and key order do not matter). A marker string,
// when given, must be present in the canonical file. A contract may also list implementations: files in consuming or
// providing projects that must contain a marker on origin/new (for conventions such as the correlation header, where
// every service implements the contract in its own code rather than copying a file).

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { finding, git, projectPath } from './core.mjs';

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function contentDigest(text, path) {
  let normalized = text.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  if (path.endsWith('.json')) {
    try { normalized = canonicalJson(JSON.parse(normalized)); } catch { /* compare as text */ }
  }
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

export function contractsReport(reg, { root } = {}) {
  const findings = [];
  const byId = new Map(reg.projects.map((p) => [p.id, p]));
  const read = (ref) => {
    const full = join(projectPath(byId.get(ref.project), root), ref.path);
    return existsSync(full) ? readFileSync(full, 'utf8') : null;
  };
  const contracts = reg.contracts.map((c) => {
    const canonicalText = read(c.canonical);
    const entry = { id: c.id, provider: c.provider, canonical: { ...c.canonical, present: canonicalText !== null }, copies: [] };
    if (canonicalText === null) {
      findings.push(finding({ code: 'CONTRACT-MISSING', category: 'contract', severity: 'error', project: c.canonical.project, subject: c.id, message: `contract ${c.id}: canonical ${c.canonical.project}/${c.canonical.path} is missing` }));
      return entry;
    }
    if (c.canonical.marker && !canonicalText.includes(c.canonical.marker)) {
      findings.push(finding({ code: 'CONTRACT-MARKER-MISSING', category: 'contract', severity: 'error', project: c.canonical.project, subject: c.id, message: `contract ${c.id}: ${c.canonical.path} does not declare ${c.canonical.marker}` }));
    }
    const digest = contentDigest(canonicalText, c.canonical.path);
    entry.canonical.digest = digest;
    for (const copy of c.copies) {
      const text = read(copy);
      const copyDigest = text === null ? null : contentDigest(text, copy.path);
      entry.copies.push({ ...copy, present: text !== null, digest: copyDigest, inSync: copyDigest === digest });
      if (text === null) findings.push(finding({ code: 'CONTRACT-COPY-MISSING', category: 'contract', severity: 'error', project: copy.project, subject: `${c.id}:${copy.project}`, message: `contract ${c.id}: ${copy.project}/${copy.path} is missing` }));
      else if (copyDigest !== digest) findings.push(finding({ code: 'CONTRACT-DRIFT', category: 'contract', severity: 'error', project: copy.project, subject: `${c.id}:${copy.project}`, message: `contract ${c.id}: ${copy.project}/${copy.path} differs from the canonical ${c.canonical.project}/${c.canonical.path}`, remediation: `align the copy with the canonical contract in ${c.canonical.project}` }));
    }
    entry.implementations = (c.implementations ?? []).map((impl) => {
      const project = byId.get(impl.project);
      const text = project ? git(projectPath(project, root), ['show', `origin/new:${impl.path}`]) : null;
      const implemented = text !== null && text.toLowerCase().includes(impl.marker.toLowerCase());
      if (!implemented) findings.push(finding({ code: 'CONTRACT-NOT-IMPLEMENTED', category: 'contract', severity: 'warning', project: impl.project, subject: `${c.id}:${impl.project}`, message: `contract ${c.id}: ${impl.project}/${impl.path} on origin/new does not implement ${impl.marker}`, remediation: impl.role ? `implement the ${impl.role}` : null }));
      return { ...impl, present: text !== null, implemented };
    });
    return entry;
  });
  return { contracts, findings };
}
