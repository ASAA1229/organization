import test from 'node:test';
import assert from 'node:assert';
import { findViolations } from './validate-governance.mjs';

test('governance validation rejects tracked private keys', () => {
  const violations = findViolations(
    ['docs/example.md', 'identity/private.pem'],
    (file) => file.endsWith('.pem') ? ['-----BEGIN', 'PRIVATE', 'KEY-----'].join(' ') + '\nvalue\n' : 'safe',
  );
  assert.ok(violations.some((item) => item.includes('identity/private.pem')));
});

test('governance validation allows environment examples', () => {
  const violations = findViolations(['identity/.env.example'], () => 'OWNER_TOKEN=replace-me');
  assert.deepStrictEqual(violations, []);
});
