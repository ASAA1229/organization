# 5. Project Guide — Templates

**Repository:** https://github.com/ASAA1229/Templates  
**Audience:** ASAA employees and management (current access intent)  
**Product type:** Internal reusable software template and development platform.

## Purpose
Templates reduces delivery time and improves consistency by helping authorized internal users discover, configure, create, test, version, reuse, and distribute software templates and engineering assets. External agencies/businesses may be a future expansion, not current access permission.

## Technology direction
- Frontend: React + Vite + TypeScript/JavaScript.
- Backend: Node.js + Express.
- Database/ORM: PostgreSQL + Prisma.
- UI: Tailwind CSS + shadcn/ui.
- Architecture direction: modular monolith.

Verify package versions, workspace configuration, migrations, deployment topology, and running behavior before making claims about implementation.

## Scope and capability areas
1. Internal access, roles, administration, and governance.
2. Categories, sectors, hybrid taxonomy, and custom divisions.
3. Catalog/demo templates for websites, web apps, e-commerce, mobile, desktop, backend/APIs, enterprise, UI systems, DevOps, AI, and data.
4. Visual editing, advanced configuration, and source access.
5. ZIP downloads, GitHub repositories, online workspaces, and deployment pathways.
6. AI-assisted creation and limited JARVIS mini-capabilities, not the full personal JARVIS product.
7. Versioning, collaboration, QA, security, and documentation.
8. Discovery, asset management, connectors, hybrid deployment, and monitoring.
9. Offline Linux/AIX environment snapshot capability.

## Environment snapshot feature
The requested concept is a standalone offline Python utility adapted as a Templates capability. It should not require network access and should produce TXT and JSON reports. Its context includes Linux/AIX environment inventory and CMM ICG/ACQ/ISS. Exact collection fields, command compatibility, output schema, and acceptance criteria must be validated against the source specification.

## Candidate epic register
1. Platform foundation and modular architecture.
2. Internal access, roles, and governance.
3. Taxonomy, sectors, and divisions.
4. Catalog, demo templates, and lifecycle.
5. Visual builder and source configuration.
6. Workspaces, versioning, and collaboration.
7. AI-assisted creation.
8. ZIP, GitHub, and deployment pathways.
9. QA, security, and documentation.
10. Offline Linux/AIX environment snapshot.
11. Operations, monitoring, assets, and connectors.

## Candidate sub-epics
- Foundation: workspace packages/contracts, API, web app, database, migrations, configuration, error handling.
- Access: employee/management identity, RBAC, approvals, audit, account lifecycle.
- Taxonomy: domains, sectors, hybrid categories, custom divisions, tagging, search.
- Catalog: metadata, previews, demo templates, lifecycle states, ownership, compatibility.
- Builder: visual editor, configuration schema, source editor, validation, preview, export.
- Workspaces: project creation, version history, branching, collaboration, conflict handling.
- AI: assisted scaffolding, prompt/context management, review, safe generation, usage controls.
- Distribution: ZIP export, GitHub integration, workspace provisioning, deployment adapters.
- QA/security: template validation, dependency checks, secrets scanning, test suites, documentation.
- Environment snapshot: offline Linux/AIX inventory, collection profiles, TXT/JSON reports, CMM ICG/ACQ/ISS mapping.
- Operations: monitoring, asset library, connector registry, audit, backup, support.

## Reported progress and remaining work
The owner has reported that the basic platform is built. Local development context previously included workspaces @asaa/contracts, @asaa/api (tsx watch), and @asaa/web (Vite). A historical local issue involved Vite port 5173 being occupied by java.exe PID 7116; later Vite reported ready on 127.0.0.1. These are historical notes, not current runtime proof.

Fresh repository/build/test review must establish remaining work. Verify build/tests/migrations; map built features to requirements; confirm employee/management access; validate taxonomy, catalog, demos, builder, lifecycle, versioning, collaboration, exports, integrations, and deployment; review AI privacy/secrets/cost; verify security, QA, docs, monitoring, backup; validate offline Linux/AIX collection and TXT/JSON output against source requirements.

## Risks and first tasks
Risks include unauthorized access, exported secrets or unsafe dependencies, unreviewed AI-generated code, template compatibility drift, and accidental network access or sensitive collection by the offline tool.

Run a safe local inventory and build/test pass. Understand workspace contracts, API, web app, database, and template lifecycle before editing. Verify access controls and exports early. Treat generated/imported code as untrusted until validated.
