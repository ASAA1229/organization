# ASAA — Organization Knowledge & Governance

**Repository:** [ASAA1229/organization](https://github.com/ASAA1229/organization)  
**Purpose:** Central reference for the ASAA organization and its complete project ecosystem.  
**Documentation baseline:** 2026-11-14  
**Status:** Initial documentation foundation — owner validation and evidence reconciliation remain in progress.

## Why this repository exists

This repository is the organization-wide knowledge and governance home. It explains what ASAA is, why it exists, how it operates, what each project is responsible for, how projects relate, and which policies govern people, requirements, engineering, security, delivery, reporting, and change.

It is intended to help a new team member understand the organization and its projects without needing repeated verbal explanations.

## What belongs here

- Organization charter, mission, structure, operating model, and business context
- Policies, standards, decision rights, approvals, and governance
- Organization-wide requirements baseline and change control
- Portfolio overview, project scopes, roadmaps, dependencies, and risks
- Status reports, evidence registers, decisions, and onboarding material
- Shared architecture principles and cross-project capabilities
- Links to detailed project repositories and their authoritative implementation records

## Project portfolio

| Project | Role in the ecosystem | Repository |
|---|---|---|
| ASAA | Organization governance and enterprise project integration platform; broader organizational operations vision is separately identified | [ASAA](https://github.com/ASAA1229/ASAA) |
| Portfolio | Multi-profile portfolio and professional/personal presentation experience | [Portfolio](https://github.com/ASAA1229/Portfolio) |
| JARVIS | Personal AI assistant, developer assistant, and automation platform | [JARVIS](https://github.com/ASAA1229/JARVIS) |
| Templates | Internal reusable templates and development platform | [Templates](https://github.com/ASAA1229/Templates) |
| Configuration | Local-first identity, data-locality and dependency-approval policies for the project ecosystem | [Configuration](https://github.com/ASAA1229/Configuration) |

## Repository map

- [Organization charter](docs/organization/CHARTER.md)
- [Operating model](docs/organization/OPERATING_MODEL.md)
- [Governance and decision rights](docs/governance/GOVERNANCE.md)
- [Policy index](docs/policies/POLICY_INDEX.md)
- [Engineering and delivery standards](docs/engineering/ENGINEERING_STANDARDS.md)
- [Requirements baseline](docs/requirements/MASTER_REQUIREMENTS_BASELINE.md)
- [Project portfolio](docs/portfolio/PROJECT_PORTFOLIO.md)
- [Cross-project architecture](docs/architecture/ECOSYSTEM_ARCHITECTURE.md)
- [Organization status report](reports/ORGANIZATION_STATUS_2026-11-14.md)
- [Risk and dependency register](reports/RISK_AND_DEPENDENCY_REGISTER.md)
- [Decision register](reports/DECISION_REGISTER.md)
- [Team onboarding](docs/onboarding/TEAM_ONBOARDING.md)
- [Unknowns and owner clarifications](reports/OPEN_QUESTIONS_AND_VALIDATION.md)

## Source-of-truth boundaries

This repository governs and summarizes organization-wide context. Each project repository remains authoritative for its own source code, detailed technical design, implementation records, tests, and release evidence. A summary here must link to project evidence and must not turn an unverified statement into a completion claim.

The master requirements baseline was approved for planning on 2026-11-14. On 2026-11-25, the owner separately authorized independent continuation of remaining engineering, documentation, local setup and testing within approved scope on working branches. This does not authorize paid services, promotion into dev/main, production deployment or release.

## Branch and change policy

- Standard branches: `main`, `dev`, `new`, `fix`, `test`.
- Routine work starts from and targets `new`.
- `dev` and `main` are protected integration/release branches and are never routine work targets.
- Promotion from `new` to `dev`, and from `dev` to `main`, requires a separately reviewed and explicitly authorized pull request.
- Do not merge or release without explicit authorization.

See [Branching and change control](docs/policies/BRANCHING_AND_CHANGE_CONTROL.md). GitHub branch-protection enforcement must be verified in repository settings; written policy alone does not prove enforcement.

## Status language

Use evidence-based lifecycle states: Not assessed, Planned, Ready, In development, Implemented-unverified, Testing, Tested, Integration in progress, Integrated, Partially complete, Blocked, Accepted, Released/operational, and Deprecated. Definitions are in [Engineering standards](docs/engineering/ENGINEERING_STANDARDS.md).

## Important caution

This initial baseline combines known organizational decisions and prior project context. Where exact owner decisions, current repository evidence, dates, metrics, named role holders, or operational proof are missing, the documents say so explicitly. Proposed decomposition is not a claim that every epic, sub-epic, or user story has been approved or implemented.


## 2026-11-19 organization-wide audit update

The current organization-wide repository inventory and evidence reconciliation are recorded in [Organization Baseline Audit](docs/ORGANIZATION_BASELINE_AUDIT.md). The audit now includes the six visible repositories: Portfolio, JARVIS, Templates, ASAA, organization and Configuration.

The audit identified material branch divergence: current delivery implementation is concentrated on `new` in several repositories. In particular, Templates' application is present on `new` while `dev` and `test` remain documentation-only at the inspected snapshot. No automatic promotion or merge is implied.

The [Configuration repository](https://github.com/ASAA1229/Configuration) is now included in the organization inventory; its purpose and ownership still require confirmation from the approved organization requirements baseline before its technical design is changed.


## Status and evidence — 2026-11-20

The 2026-11-20 organization assessment records six public repositories, all five standard branches in each repository, unprotected branch records, branch-specific CI exceptions and organization-wide NO-GO. No code, merges, promotions or deployments were performed.

See [reports/ORGANIZATION_STATUS_2026-11-20.md](reports/ORGANIZATION_STATUS_2026-11-20.md) for the dated evidence, outstanding gates and next actions. Workflow results are specific to their recorded run and commit; missing runs are not passes.


## Owner execution baseline — 2026-11-25

- [Owner decisions and execution constraints](docs/OWNER_DECISIONS_AND_EXECUTION_BASELINE.md)
- [Major-gap execution backlog and owner blocker queue](reports/MAJOR_GAP_EXECUTION_BACKLOG_2026-11-25.md)

The owner has authorized independent continuation of remaining work across all six repositories. Continue unblocked work while recording concrete owner-only blockers. Cost remains ₹0 until investment is explicitly authorized. Use dummy/mock data and free/local alternatives where required; ask for credentials only when a real task needs them. Use local PostgreSQL and MongoDB installations where available.

The approved data direction is hybrid: separate project databases plus shared organizational databases on shared infrastructure. Centralized APIs/services are the default cross-project access path; direct database access is an exception requiring justification and least privilege.

PR promotion into dev/main is deliberately postponed. Do not merge, release or activate paid services without explicit owner authorization. The owner blocker queue must distinguish verified current evidence from older audit snapshots.


## Current architecture and environment references

- [Shared data architecture](docs/architecture/SHARED_DATA_ARCHITECTURE.md) — hybrid PostgreSQL/MongoDB direction, shared data domains, conceptual relationships and API-first access.
- [Environment configuration audit](reports/ENVIRONMENT_CONFIGURATION_AUDIT_2026-11-25.md) — .env.example inventory and missing-credential handling.

## Local governance dashboard

Run the zero-dependency dashboard on the loopback-only interface:

```powershell
npm test
npm run dashboard
```

Open `http://127.0.0.1:4177/`. The dashboard reads the latest local governance evidence and exposes only read-only health, report and checkpoint JSON endpoints.
