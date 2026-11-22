// Risk and dependency management engine (D0.16).
//   - risk scoring (probability x impact on the registry scale) and rating bands
//   - completeness against the mature-register required fields
//   - review and due-date tracking
//   - dependency readiness, consumer exposure and provider-consumer cycle detection
//   - propagation: a risk inherits exposure from the dependencies it is linked to
// Missing scores, owners and dates are reported as owner decisions; nothing is estimated on the owner's behalf.

import { finding, git, projectPath } from './core.mjs';

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

// Evidence paths are checked against the project's integrated branch (origin/new), not the working tree, so a file that
// only exists on an unmerged work branch does not count. null = repository not available locally (not verifiable).
export function evidencePresent(reg, e, { root, ref = 'origin/new' } = {}) {
  const project = reg.projects.find((p) => p.id === e.project);
  if (!project) return false;
  const path = projectPath(project, root);
  if (git(path, ['rev-parse', '--verify', '--quiet', ref]) === null) return null;
  return git(path, ['cat-file', '-e', `${ref}:${e.path}`]) !== null;
}

export function riskReport(reg, { today = new Date().toISOString().slice(0, 10), root } = {}) {
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
    // A linked dependency is unresolved while it is not active in code with evidence on origin/new, or has no owner (E:D2.4).
    const unresolved = linked.filter((d) => !(d.status === 'active-in-code' && (d.evidence ?? []).length > 0 && (d.evidence ?? []).every((e) => evidencePresent(reg, e, { root }) !== false)) || !d.owner).map((d) => d.id);
    const exposedProjects = [...new Set(linked.flatMap((d) => [d.provider, ...d.consumers]))].sort();
    return { id: r.id, description: r.description, category: r.category, owner: r.owner, status: r.status, score: scored?.score ?? null, band: scored?.band ?? 'unscored', completeness: Math.round(((required.length - missing.length) / required.length) * 100), exposedProjects, unresolvedDependencies: unresolved };
  });

  const dependencies = reg.dependencies.map((d) => {
    const ready = d.status === 'active-in-code' && (d.evidence ?? []).length > 0;
    if (!d.owner) findings.push(finding({ code: 'DEPENDENCY-UNOWNED', category: 'dependency', severity: 'warning', subject: d.id, message: `dependency ${d.id} has no owner`, remediation: 'owner decision: assign an owner role' }));
    if (d.status === 'active-in-code' && !(d.evidence ?? []).length) findings.push(finding({ code: 'DEPENDENCY-NO-EVIDENCE', category: 'dependency', severity: 'error', subject: d.id, message: `dependency ${d.id} is marked active without evidence` }));
    for (const e of d.evidence ?? []) {
      if (evidencePresent(reg, e, { root }) === false) findings.push(finding({ code: 'DEPENDENCY-EVIDENCE-MISSING', category: 'dependency', severity: 'warning', subject: `${d.id}:${e.project}:${e.path}`, message: `dependency ${d.id} cites ${e.project}:${e.path}, which does not exist on new`, remediation: 'correct the evidence path or the dependency status' }));
    }
    if (!d.fallback) findings.push(finding({ code: 'DEPENDENCY-NO-FALLBACK', category: 'dependency', severity: 'info', subject: d.id, message: `dependency ${d.id} has no recorded fallback` }));
    return { id: d.id, provider: d.provider, consumers: d.consumers, status: d.status, owner: d.owner, ready };
  });

  for (const cycle of dependencyCycles(reg.dependencies)) {
    findings.push(finding({ code: 'DEPENDENCY-CYCLE', category: 'dependency', severity: 'warning', subject: cycle.join('>'), message: `provider/consumer cycle: ${cycle.join(' -> ')}`, remediation: 'break the cycle so no two repositories depend on each other circularly' }));
  }

  const exposure = {};
  for (const d of reg.dependencies) for (const c of d.consumers) exposure[c] = [...(exposure[c] ?? []), d.id];
  // Exposure to dependencies that are not ready (candidate, missing evidence on origin/new) or have no owner.
  const notReady = new Set(dependencies.filter((d) => !d.ready || !d.owner).map((d) => d.id));
  const unresolvedExposure = Object.fromEntries(Object.entries(exposure).map(([p, ids]) => [p, ids.filter((id) => notReady.has(id))]));
  for (const r of risks) {
    if (r.status === 'open' && r.unresolvedDependencies.length) findings.push(finding({ code: 'RISK-DEPENDENCY-UNRESOLVED', category: 'risk', severity: 'info', subject: r.id, message: `${r.id} is linked to unresolved dependencies: ${r.unresolvedDependencies.join(', ')}`, data: { dependencies: r.unresolvedDependencies } }));
  }
  return { risks, dependencies, exposure, unresolvedExposure, findings };
}

// Project dependency graph (E:D2.3): nodes are the registered projects; edges run provider -> consumer for every
// registered dependency, with its status, readiness and whether all of its evidence exists on origin/new. Open risks
// linked to a dependency are attached to its edges.
export function dependencyGraph(reg, { root } = {}) {
  const nodes = reg.projects.map((p) => ({ id: p.id, name: p.name, kind: p.kind ?? null }));
  const risksByDep = new Map();
  for (const r of reg.risks.risks ?? []) for (const d of r.relatedDependencies ?? []) risksByDep.set(d, [...(risksByDep.get(d) ?? []), r.id]);
  const edges = [];
  for (const d of reg.dependencies) {
    const evidence = (d.evidence ?? []).map((e) => evidencePresent(reg, e, { root }));
    for (const consumer of d.consumers) {
      edges.push({
        from: d.provider, to: consumer, dependency: d.id, status: d.status, owner: d.owner,
        ready: d.status === 'active-in-code' && evidence.length > 0 && evidence.every((x) => x !== false),
        evidencePresent: evidence.length ? evidence.every((x) => x === true) : false,
        risks: risksByDep.get(d.id) ?? [],
      });
    }
  }
  return { nodes, edges, cycles: dependencyCycles(reg.dependencies), integrationOrder: integrationOrder(reg) };
}

// Order in which projects integrate (E2:D0.9): a provider comes before its consumers. Projects in a provider/consumer
// cycle cannot be ordered and are returned together as one stage, so the cycle stays visible.
export function integrationOrder(reg) {
  const ids = reg.projects.map((p) => p.id);
  const incoming = new Map(ids.map((id) => [id, new Set()]));
  for (const d of reg.dependencies) for (const c of d.consumers) if (c !== d.provider && incoming.has(c)) incoming.get(c).add(d.provider);
  const stages = [];
  const placed = new Set();
  while (placed.size < ids.length) {
    const ready = ids.filter((id) => !placed.has(id) && [...incoming.get(id)].every((p) => placed.has(p)));
    const stage = ready.length ? ready : ids.filter((id) => !placed.has(id));
    stages.push({ stage: stages.length + 1, projects: stage, cyclic: ready.length === 0 });
    for (const id of stage) placed.add(id);
  }
  return stages;
}

export function graphToDot(graph) {
  const lines = ['digraph asaa_ecosystem {', '  rankdir=LR;'];
  for (const n of graph.nodes) lines.push(`  "${n.id}" [label="${n.name}"];`);
  for (const e of graph.edges) lines.push(`  "${e.from}" -> "${e.to}" [label="${e.dependency}${e.ready ? '' : ' (not ready)'}"${e.ready ? '' : ', style=dashed'}];`);
  lines.push('}');
  return lines.join('\n');
}
