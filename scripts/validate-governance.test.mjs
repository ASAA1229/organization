import test from 'node:test';
import assert from 'node:assert';

import { findViolations } from './validate-governance.mjs';

test('governance validation rejects private keys and keystore files', () => {
  const violations = findViolations(
    ['identity/private.pem', 'identity/client.p12', 'docs/example.md'],
    (file) => file.endsWith('.md') ? 'safe' : 'binary placeholder',
  );
  assert.ok(violations.some((item) => item.includes('identity/private.pem')));
  assert.ok(violations.some((item) => item.includes('identity/client.p12')));
});

test('governance validation rejects production env files but allows examples', () => {
  const violations = findViolations(
    ['identity/.env.production', 'identity/.env.example', 'identity/.env.sample'],
    () => 'OWNER_TOKEN=placeholder',
  );
  assert.ok(violations.some((item) => item.includes('identity/.env.production')));
  assert.ok(!violations.some((item) => item.includes('.env.example')));
  assert.ok(!violations.some((item) => item.includes('.env.sample')));
});

test('governance validation detects common provider credential formats in supported text files', () => {
  const samples = [
    ['github', ['ghp_', 'A'.repeat(36)].join('')],
    ['fine-grained-github', ['github_pat_', 'A'.repeat(40)].join('')],
    ['gitlab', ['glpat-', 'A'.repeat(24)].join('')],
    ['npm', ['npm_', 'A'.repeat(24)].join('')],
    ['slack', ['xoxb-', 'A'.repeat(24)].join('')],
    ['google', ['AIza', 'A'.repeat(35)].join('')],
    ['openai', ['sk-proj-', 'A'.repeat(32)].join('')],
    ['stripe', ['sk_live_', 'A'.repeat(24)].join('')],
    ['aws', ['AKIA', 'A'.repeat(16)].join('')],
  ];

  for (const [name, value] of samples) {
    const violations = findViolations(
      [`config/${name}.toml`],
      () => `credential = "${value}"`,
    );
    assert.ok(violations.some((item) => item.includes('secret-like credential material')), `expected ${name} credential to be detected`);
  }
});

test('governance validation scans env text and configuration formats', () => {
  const violations = findViolations(
    ['config/.env.local', 'config/settings.toml'],
    (file) => file.endsWith('.toml') ? 'safe = true' : 'OWNER_TOKEN=placeholder',
  );
  assert.ok(violations.some((item) => item.includes('config/.env.local')));
});
