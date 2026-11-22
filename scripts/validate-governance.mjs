// Repository governance validation for the organization repository (CI entry point).
//   1. README.md and the docs/ and reports/ directories exist.
//   2. The governance registry passes data-model integrity validation.
//   3. No tracked file is secret-bearing or contains credential material (values are never printed).
// Cross-repository checks live in scripts/governance.mjs.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findViolations as findSecretViolations, scanFiles } from './lib/secrets.mjs';
import { loadRegistry } from './lib/core.mjs';
import { validateModel } from './lib/model.mjs';

export function findTrackedFiles(directory, base = directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...findTrackedFiles(absolute, base));
    else files.push(relative(base, absolute).replace(/\\/g, '/'));
  }
  return files.sort();
}

export function findViolations(files, readFile) {
  return findSecretViolations(files, readFile);
}

export function validate(root = process.cwd()) {
  const errors = [];
  if (!existsSync(join(root, 'README.md'))) errors.push('README.md is missing.');
  const missingDirectories = ['docs', 'reports'].filter((d) => !existsSync(join(root, d)) || !statSync(join(root, d)).isDirectory());
  if (missingDirectories.length) errors.push(`missing directories: ${missingDirectories.join(', ')}`);

  if (existsSync(join(root, 'governance', 'registry'))) {
    for (const f of validateModel(loadRegistry(join(root, 'governance', 'registry')))) if (f.severity === 'error') errors.push(`registry: ${f.message}`);
  }

  const files = findTrackedFiles(root);
  for (const d of scanFiles(files, (file) => readFileSync(join(root, file), 'utf8')).filter((x) => x.severity !== 'low')) {
    errors.push(d.line === null ? `${d.file}: secret-bearing file is tracked (${d.rule})` : `${d.file}:${d.line}: ${d.rule} (${d.severity}, fingerprint ${d.fingerprint})`);
  }
  return { ok: errors.length === 0, errors, fileCount: files.length };
}

if (process.argv[1]?.endsWith('validate-governance.mjs')) {
  const result = validate();
  if (!result.ok) {
    console.error('Governance validation failed:');
    for (const e of result.errors) console.error('- ' + e);
    process.exit(1);
  }
  console.log('Governance validation passed: ' + result.fileCount + ' files checked.');
}
