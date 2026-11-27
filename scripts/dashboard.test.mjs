import test from 'node:test';
import assert from 'node:assert/strict';
import { createDashboardServer } from './dashboard.mjs';

test('dashboard serves health and report JSON', async () => {
  const report = {
    gate: 'pass',
    generatedAt: '2026-11-27T00:00:00.000Z',
    summary: { total: 0, bySeverity: { error: 0, warning: 0, info: 0 } },
    projects: [{ name: 'Organization', health: { rating: 'green' } }],
    checkpoints: [],
  };
  const server = createDashboardServer({ reportBuilder: () => report });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  try {
    const base = `http://127.0.0.1:${address.port}`;
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.gate, 'pass');
    assert.equal(health.projects.length, 1);
    assert.equal((await fetch(`${base}/api/report`)).status, 200);
    assert.equal((await fetch(`${base}/`)).headers.get('content-type'), 'text/html; charset=utf-8');
    assert.equal((await fetch(`${base}/api/report`, { method: 'POST' })).status, 405);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
