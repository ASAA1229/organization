// Local-only ASAA1229 governance dashboard. Serves loopback-only JSON and a read-only browser view.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildReport } from './lib/report.mjs';

const directory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export function createDashboardServer({ reportBuilder = () => buildReport({ github: false }) } = {}) {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    if (request.method !== 'GET') {
      response.writeHead(405, { 'allow': 'GET', 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'method_not_allowed' }));
      return;
    }
    try {
      if (url.pathname === '/api/report') {
        response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        response.end(JSON.stringify(reportBuilder()));
        return;
      }
      if (url.pathname === '/api/health') {
        const report = reportBuilder();
        response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        response.end(JSON.stringify({ gate: report.gate, summary: report.summary, projects: report.projects }));
        return;
      }
      if (url.pathname === '/' || url.pathname === '/index.html') {
        const html = await readFile(path.join(directory, 'dashboard.html'), 'utf8');
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        response.end(html);
        return;
      }
      response.writeHead(404, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'not_found' }));
    } catch (error) {
      response.writeHead(500, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'dashboard_report_failed', detail: error instanceof Error ? error.message : 'unknown error' }));
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.ASAA_DASHBOARD_PORT ?? 4177);
  const server = createDashboardServer();
  server.listen(port, '127.0.0.1', () => console.log(`ASAA1229 dashboard: http://127.0.0.1:${port}/`));
}
