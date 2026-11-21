import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();

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
  const violations = [];
  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
  ];

  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');
    if (/(^|\/)\.env$|\.pem$/i.test(normalized) && !normalized.endsWith('.env.example')) {
      violations.push(`${normalized}: secret-bearing file is tracked`);
    }
    if (!/\.(md|txt|json|ya?ml|mjs|js|ps1|py|ts|tsx|sh)$/i.test(normalized)) continue;
    const text = readFile(file);
    for (const pattern of secretPatterns) {
      if (pattern.test(text)) violations.push(`${normalized}: secret-like credential material detected`);
    }
  }
  return [...new Set(violations)];
}

const requiredDirectories = ['docs', 'reports'];
if (!existsSync(join(root, 'README.md'))) {
  console.error('Governance validation failed: README.md is missing.');
  process.exit(1);
}

const missingDirectories = requiredDirectories.filter((directory) => {
  const path = join(root, directory);
  return !existsSync(path) || !statSync(path).isDirectory();
});
if (missingDirectories.length > 0) {
  console.error(`Governance validation failed: missing directories: ${missingDirectories.join(', ')}`);
  process.exit(1);
}

const files = findTrackedFiles(root);
const violations = findViolations(files, (file) => readFileSync(join(root, file), 'utf8'));
if (violations.length > 0) {
  console.error('Governance validation failed:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Governance validation passed: ${files.length} files checked.`);
