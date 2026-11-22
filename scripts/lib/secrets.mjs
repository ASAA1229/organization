// Secret and sensitive-file detection (D0.20).
//
// Detects and classifies potential credential exposure without printing or transmitting the detected value. Each
// detection carries the file, line, rule, severity and a fingerprint (truncated SHA-256 of the match) so findings can
// be tracked and allow-listed without ever storing the secret. Only tracked files are scanned when git is available.

import { createHash } from 'node:crypto';

export const SECRET_RULES = [
  { id: 'private-key', severity: 'critical', pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED |PGP )?PRIVATE KEY(?: BLOCK)?-----/g },
  { id: 'github-fine-grained-token', severity: 'critical', pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { id: 'github-token', severity: 'critical', pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
  { id: 'aws-access-key-id', severity: 'critical', pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { id: 'gitlab-token', severity: 'critical', pattern: /\bglpat-[A-Za-z0-9_-]{20,}\b/g },
  { id: 'npm-token', severity: 'high', pattern: /\bnpm_[A-Za-z0-9]{20,}\b/g },
  { id: 'slack-token', severity: 'high', pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { id: 'google-api-key', severity: 'high', pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/g },
  { id: 'openai-key', severity: 'critical', pattern: /\bsk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{20,}\b/g },
  { id: 'anthropic-key', severity: 'critical', pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
  { id: 'stripe-live-key', severity: 'critical', pattern: /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/g },
  { id: 'azure-storage-key', severity: 'critical', pattern: /\bAccountKey=[A-Za-z0-9+/=]{40,}/g },
  { id: 'jwt', severity: 'medium', pattern: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
  { id: 'url-credentials', severity: 'high', pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@'"]+:[^\s@/'"$]{6,}@[^\s'"]+/gi },
];

// Assignment of a secret-named key to a high-entropy literal (generic detection).
const GENERIC_ASSIGNMENT = /\b([A-Za-z0-9_]*(?:PASSWORD|PASSWD|SECRET|TOKEN|API_?KEY|PRIVATE_?KEY|ACCESS_?KEY|CLIENT_?SECRET)[A-Za-z0-9_]*)[ \t]*[:=][ \t]*["']?([^\s"'#,;]{16,})/gi;
// Password segment of a URL that is a documentation placeholder (PASSWORD, <password>, ${VAR}).
const URL_PASSWORD_PLACEHOLDER = /:\/\/[^\s:/@'"]+:(?:[A-Z_]+|<[^>]*>|\$\{[^}]*\}|\*+)@/;
// Generic detection only applies to configuration-style files, not source code (regex literals, constants).
const CONFIG_STYLE = /(\.(env|vars|json|jsonc|ya?ml|toml|ini|conf|cfg|properties|tfvars)$|(^|\/)\.(env|dev\.vars)(\.[^/]+)?$)/i;
// Test and fixture paths: deliberate fake credentials are expected there and are reported at lower severity.
export const TEST_PATH = /(^|\/)(test|tests|__tests__|e2e|fixtures?|testdata|spec)(\/|$)|\.(test|spec)\.[a-z0-9]+$|(^|\/)test_[^/]+\.py$/i;
const LOOPBACK_URL_HOST = /@(localhost|127\.0\.0\.1|\[::1\]|postgres|db|database|mysql|redis)(:\d+)?[/?]/i;
const PLACEHOLDER = /^(?:REPLACE|secret:\/\/|CHANGE|YOUR|EXAMPLE|PLACEHOLDER|DUMMY|TEST|FAKE|SAMPLE|XXX|\*\*\*|<|\$\{|\$\(|\{\{|process\.env|env\.|os\.environ|import\.meta)/i;

export const TEXT_FILE_EXTENSIONS = /\.(md|txt|json|jsonc|ya?ml|mjs|cjs|js|jsx|ts|tsx|sh|bash|ps1|psm1|py|toml|ini|conf|cfg|properties|xml|tf|tfvars|sql|go|java|kt|kts|cs|rs|swift|gradle|env|vars|dockerfile|html|vue|svelte)$/i;
export const SENSITIVE_FILE = [
  { id: 'keystore-or-key-file', severity: 'critical', pattern: /\.(pem|key|p12|pfx|jks|keystore|ppk|asc|gpg|kdbx)$/i },
  { id: 'ssh-private-key-file', severity: 'critical', pattern: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/i },
  { id: 'credentials-file', severity: 'high', pattern: /(^|\/)(credentials(\.json)?|\.npmrc|\.pypirc|\.netrc|\.git-credentials|service-account[^/]*\.json)$/i },
];
export const ENV_FILE = /(^|\/)\.(env|dev\.vars)(?:\.[^/]+)?$/i;
export const SAFE_ENV_EXAMPLE = /(^|\/)\.(env|dev\.vars)\.(?:example|sample|template|dist)$/i;

export function fingerprint(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

export function shannonEntropy(value) {
  const counts = new Map();
  for (const ch of value) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let h = 0;
  for (const n of counts.values()) { const p = n / value.length; h -= p * Math.log2(p); }
  return h;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (text.charCodeAt(i) === 10) line += 1;
  return line;
}

// Scans text and returns detections without values: [{ rule, severity, line, fingerprint }].
export function scanText(text, { configStyle = true } = {}) {
  const detections = [];
  for (const rule of SECRET_RULES) {
    rule.pattern.lastIndex = 0;
    for (const m of text.matchAll(rule.pattern)) {
      if (rule.id === 'url-credentials' && URL_PASSWORD_PLACEHOLDER.test(m[0])) continue;
      // Credentials in a URL to a loopback or compose-local database host are local development values.
      const local = rule.id === 'url-credentials' && LOOPBACK_URL_HOST.test(`${m[0]}/`);
      detections.push({ rule: rule.id, severity: local ? 'low' : rule.severity, line: lineOf(text, m.index), fingerprint: fingerprint(m[0]), ...(local ? { context: 'local-development' } : {}) });
    }
  }
  GENERIC_ASSIGNMENT.lastIndex = 0;
  for (const m of configStyle ? text.matchAll(GENERIC_ASSIGNMENT) : []) {
    const value = m[2];
    if (PLACEHOLDER.test(value) || /^[a-z]+(?:[._-][a-z]+)*$/i.test(value) || '/(\\'.includes(value[0]) || /^https?:\/\/[^@\s]*$/i.test(value)) continue;
    if (shannonEntropy(value) < 3.5) continue;
    detections.push({ rule: 'generic-secret-assignment', severity: 'medium', line: lineOf(text, m.index), fingerprint: fingerprint(value), key: m[1] });
  }
  // One detection per line and fingerprint.
  const seen = new Set();
  return detections.filter((d) => { const k = `${d.line}|${d.fingerprint}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

export function classifyFile(file) {
  const normalized = file.replace(/\\/g, '/');
  if (ENV_FILE.test(normalized) && !SAFE_ENV_EXAMPLE.test(normalized)) return { rule: 'env-file-tracked', severity: 'high' };
  for (const s of SENSITIVE_FILE) if (s.pattern.test(normalized)) return { rule: s.id, severity: s.severity };
  return null;
}

// Scans a list of files. readFile(file) returns text. allowlist: Set of fingerprints or "file:rule" entries.
export function scanFiles(files, readFile, { allowlist = new Set() } = {}) {
  const results = [];
  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');
    const sensitive = classifyFile(normalized);
    if (sensitive && !allowlist.has(`${normalized}:${sensitive.rule}`)) results.push({ file: normalized, line: null, ...sensitive, fingerprint: null });
    const isText = TEXT_FILE_EXTENSIONS.test(normalized) || ENV_FILE.test(normalized) || /(^|\/)Dockerfile[^/]*$/i.test(normalized);
    if (!isText) continue;
    let text;
    try { text = readFile(file); } catch { continue; }
    if (text.includes('\u0000')) continue;
    const inTests = TEST_PATH.test(normalized);
    for (const d of scanText(text, { configStyle: CONFIG_STYLE.test(normalized) && !inTests })) {
      if (allowlist.has(d.fingerprint) || allowlist.has(`${normalized}:${d.rule}`)) continue;
      // Fake credentials in tests are expected; they stay visible at low severity so real ones are not hidden.
      results.push(inTests ? { file: normalized, ...d, severity: 'low', context: 'test-fixture' } : { file: normalized, ...d });
    }
  }
  return results;
}

// Backwards-compatible string violations used by validate-governance.mjs and its tests.
export function findViolations(files, readFile) {
  const out = [];
  for (const r of scanFiles(files, readFile)) {
    if (r.line === null) out.push(`${r.file}: secret-bearing file is tracked`);
    else out.push(`${r.file}: secret-like credential material detected`);
  }
  return [...new Set(out)];
}
