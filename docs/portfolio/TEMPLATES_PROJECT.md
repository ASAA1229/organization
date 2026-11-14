# Project Profile — Templates

**Repository:** https://github.com/ASAA1229/Templates  
**Purpose:** Internal reusable software template and development platform for ASAA employees and management.

## Product intent

Reduce delivery time and improve consistency by discovering, configuring, creating, testing, versioning, reusing, and distributing software templates and engineering assets. External agencies/businesses may be a future expansion, not assumed current access.

## Current technology direction

React + Vite + TypeScript/JavaScript; Node.js + Express; PostgreSQL + Prisma; Tailwind CSS + shadcn/ui. Modular monolith is the current architecture direction. Verify actual package versions and deployed topology from the repository before treating this as an implementation fact.

## Scope areas

- Internal access, roles, administration and governance
- Categories, sectors, hybrid taxonomy and custom divisions
- Catalog and demo templates across websites, web apps, e-commerce, mobile, desktop, backend/APIs, enterprise, UI systems, DevOps, AI and data
- Visual editing, advanced configuration and source access
- ZIP downloads, GitHub repositories, online workspaces and deployment pathways
- AI-assisted creation and JARVIS mini-capabilities (not the full personal JARVIS product)
- Versioning, collaboration, QA, security, documentation, discovery, assets and connectors
- Hybrid deployment and operational monitoring
- Offline Linux/AIX environment snapshot feature

## Epic register (11 epics)

1. Platform foundation and modular architecture
2. Internal access, roles and governance
3. Taxonomy, sectors and divisions
4. Catalog, demo templates and lifecycle
5. Visual builder and source configuration
6. Workspaces, versioning and collaboration
7. AI-assisted creation
8. ZIP, GitHub and deployment pathways
9. QA, security and documentation
10. Offline Linux/AIX environment snapshot
11. Operations, monitoring, assets and connectors

## Candidate sub-epics (to validate)

- Foundation: workspace packages/contracts, API, web app, database, migrations, configuration, error handling.
- Access: employee/management identity, RBAC, approvals, audit, account lifecycle.
- Taxonomy: domains, sectors, hybrid categories, custom divisions, tagging and search.
- Catalog: template metadata, previews, demo templates, lifecycle states, ownership, compatibility.
- Builder: visual editor, configuration schema, source editor, validation, preview, export.
- Workspaces: project creation, version history, branching, collaboration, conflict handling.
- AI: assisted scaffolding, prompt/context management, review, safe generation, usage controls.
- Distribution: ZIP export, GitHub integration, workspace provisioning, deployment adapters.
- QA/security: template validation, dependency checks, secrets scanning, test suites, documentation.
- Env snapshot: offline Linux/AIX inventory, collection profiles, TXT/JSON reports, CMM ICG/ACQ/ISS context, no network requirement.
- Operations: monitoring, asset library, connector registry, audit, backup, support.

## Current status context

The owner reports that the basic platform is built. Local development context includes workspaces `@asaa/contracts`, `@asaa/api` (tsx watch), and `@asaa/web` (Vite). A previous local issue involved Vite port 5173 being occupied by java.exe PID 7116; later Vite reported ready on 127.0.0.1. These are historical troubleshooting notes, not current runtime proof.

## Next validation

Run a repository inventory and build/test pass; map each implemented feature to acceptance criteria; verify employee-only access, data security, template lifecycle, export/integration behavior, and offline environment snapshot constraints; distinguish implemented from tested, integrated, and accepted.
