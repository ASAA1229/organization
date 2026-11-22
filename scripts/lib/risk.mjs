// Risk and dependency management engine (D0.16).
//   - risk scoring (probability x impact on the registry scale) and rating bands
//   - completeness against the mature-register required fields
//   - review and due-date tracking
//   - dependency readiness, consumer exposure and provider-consumer cycle detection
//   - propagation: a risk inherits exposure from the dependencies it is linked to
// Missing scores, owners and dates are reported as owner decisions; nothing is estimated on the owner's behalf.

import { finding } from './core.mjs';

export function scoreRisk(risk) {
  if (!Number.isInteger(risk.probability) || !Number.isInteger(risk.impact)) return null;
  const score = risk.probability * risk.impact;
  const band = score >= 15 ? 'high' : score >= 8 ? 'medium' : 'low';
  return { score, band };
}

export function dependencyCycles(dependencies) {
  const edges = new Map();
  for (const d of dependencies) for (const c of d.consumers) edges.set(d.provider, [...(edges.get(d.provider) ?? []), c]);
  const cycles = [];
  const state = new Map();
  const stack = [];
  const visit = (node) => {
    state.set(node, 'visiting');
    stack.push(node);
    for (const next of edges.get(node) ?? []) {
      if (state.get(next) === 'visiting') cycles.push([...stack.slice(stack.indexOf(next)), next]);
      else if (!state.has(next)) visit(next);
    }
    stack.pop();
    state.set(node, 'done');
  };
  for (const node of edges.keys()) if (!state.has(node)) visit(node);
  return cycles;
}

export function riskReport(reg, { today = new Date().toISOString().slice(0, 10) } = {}) {
  const findings = [];
  const required = reg.risks.requiredFields;
  const deps = new Map(reg.dependencies.map((d) => [d.id, d]));

  const risks = reg.risks.risks.map((r) => {
    const scored = scoreRisk(r);
    const missing = required.filter((f) => r[f] === null || r[f] === undefined || (Array.isArray(r[f]) && r[f].length === 0 && f !== 'evidence'));
    if (missing.length) {
      findings.push(finding({ code: 'RISK-INCOMPLETE', category: 'risk', severity: 'warning', subject: r.id, message: `${r.id} is missing ${missing.join(', ')}`, remediation: 'owner review: complete the mature-register fields', data: { missing } }));
    }
    if (r.status === 'open' && r.reviewDate && r.reviewDate < today) {
      findings.push(finding({ code: 'RISK-REVIEW-OVERDUE', category: 'risk', severity: 'warning', subject: r.id, message: `${r.id} review date ${r.reviewDate} has passed` }));
    }
    if (r.status === 'open' && r.dueDate && r.dueDate < today) {
      findings.push(finding({ code: 'RISK-MITIGATION-OVERDUE', category: 'risk', severity: 'error', subject: r.id, message: `${r.id} mitigation due date ${r.dueDate} has passed while the risk is open` }));
    }
    const linked = (r.relatedDependencies ?? []).map((id) => deps.get(id)).filter(Boolean);
    const exposedProjects = [...new Set(linked.flatMap((d) => [d.provider, ...d.consumers]))].sort();
    return { id: r.id, description: r.description, category: r.category, owner: r.owner, status: r.status, score: scored?.score ?? null, band: scored?.band ?? 'unscored', completeness: Math.round(((required.length - missing.length) / required.length) * 100), exposedProjects };
  });

  const dependencies = reg.dependencies.map((d) => {
    const ready = d.status === 'active-in-code' && (d.evidence ?? []).length > 0;
    if (!d.owner) findings.push(finding({ code: 'DEPENDENCY-UNOWNED', category: 'dependency', severity: 'warning', subject: d.id, message: `dependency ${d.id} has no owner`, remediation: 'owner decision: assign an owner role' }));
    if (d.status === 'active-in-code' && !(d.evidence ?? []).length) findings.push(finding({ code: 'DEPENDENCY-NO-EVIDENCE', category: 'dependency', severity: 'error', subject: d.id, message: `dependency ${d.id} is marked active without evidence` }));
    if (!d.fallback) findings.push(finding({ code: 'DEPENDENCY-NO-FALLBACK', category: 'dependency', severity: 'info', subject: d.id, message: `dependency ${d.id} has no recorded fallback` }));
    return { id: d.id, provider: d.provider, consumers: d.consumers, status: d.status, owner: d.owner, ready };
  });

  for (const cycle of dependencyCycles(reg.dependencies)) {
    findings.push(finding({ code: 'DEPENDENCY-CYCLE', category: 'dependency', severity: 'warning', subject: cycle.join('>'), message: `provider/consumer cycle: ${cycle.join(' -> ')}`, remediation: 'break the cycle so no two repositories depend on each other circularly' }));
  }

  const exposure = {};
  for (const d of reg.dependencies) for (const c of d.consumers) exposure[c] = [...(exposure[c] ?? []), d.id];
  return { risks, dependencies, exposure, findings };
}
