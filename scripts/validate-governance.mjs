import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

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

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bglpat-[A-Za-z0-9_-]{20,}\b/,
  /\bnpm_[A-Za-z0-9]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
  /\bsk-proj-[A-Za-z0-9_-]{20,}\b/,
  /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/,
  /\bAccountKey=[A-Za-z0-9+/=]{40,}/,
];

const TEXT_FILE_EXTENSIONS = /\.(md|txt|json|ya?ml|mjs|cjs|js|jsx|ts|tsx|sh|ps1|py|toml|ini|conf|cfg|properties|xml|tf|tfvars|sql|go|java|cs|rs|swift|gradle)$/i;
const SENSITIVE_KEYSTORE_EXTENSIONS = /\.(pem|key|p12|pfx|jks|keystore|ppk)$/i;
const ENV_FILE = /(^|\/)\.env(?:\.[^/]+)?$/i;
const SAFE_ENV_EXAMPLE = /(^|\/)\.env\.(?:example|sample|template|dist)$/i;

export function findViolations(files, readFile) {
  const violations = [];

  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');
    const safeExample = SAFE_ENV_EXAMPLE.test(normalized);
    if ((ENV_FILE.test(normalized) && !safeExample) || SENSITIVE_KEYSTORE_EXTENSIONS.test(normalized)) {
      violations.push(normalized + ': secret-bearing file is tracked');
    }

    const isEnvText = ENV_FILE.test(normalized);
    if (!TEXT_FILE_EXTENSIONS.test(normalized) && !isEnvText) continue;

    const text = readFile(file);
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        violations.push(normalized + ': secret-like credential material detected');
      }
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
  console.error('Governance validation failed: missing directories: ' + missingDirectories.join(', '));
  process.exit(1);
}

const files = findTrackedFiles(root);
const violations = findViolations(files, (file) => readFileSync(join(root, file), 'utf8'));
if (violations.length > 0) {
  console.error('Governance validation failed:');
  for (const violation of violations) console.error('- ' + violation);
  process.exit(1);
}

console.log('Governance validation passed: ' + files.length + ' files checked.');
