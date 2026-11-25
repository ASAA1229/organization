# ASAA Ecosystem Architecture Principles

**Status:** Cross-project principles; detailed target architecture and interfaces require project-level decisions.

## 1. Architectural intent

Create a coherent ecosystem without forcing a single monolith or a shared runtime. Projects remain independently understandable and deployable where appropriate. Shared capabilities should be introduced only when reuse creates clear value and ownership is defined.

## 2. Provisional capability map

| Capability | Likely consumers | Key design question |
|---|---|---|
| Identity and authentication | ASAA, Portfolio, Templates, JARVIS (where appropriate) | Which identities are shared and which remain device/product-local? |
| Authorization | All | Common policy vocabulary vs project-specific permission models |
| Security/privacy | All | Common minimum controls, local risk assessment |
| Audit and evidence | ASAA, JARVIS, Templates, Portfolio admin | Event schema, retention, access |
| APIs and events | Cross-project integrations | Versioning, ownership, retries, idempotency |
| Notifications | ASAA, JARVIS, Templates | User preferences, delivery, privacy |
| Knowledge/documentation | All | Canonical location and sync ownership |
| Assets/media | Portfolio, Templates, ASAA | Storage, lifecycle, rights, access |
| AI governance | JARVIS, Portfolio, Templates, ASAA | Provider policy, data controls, cost, human approval |
| CI/CD and artifacts | All | Shared standards vs separate credentials and pipelines |
| Observability | All | Common metadata, privacy, retention |
| Backup/recovery | Data-owning systems | RPO/RTO, restore tests, owner |

These are candidate shared capabilities, not a decision to centralize all systems.

## 3. Design principles

- Modular boundaries and explicit ownership.
- Least-privilege service and user identities.
- Versioned APIs and event contracts.
- Idempotent integrations with retries, dead-letter/error handling, and reconciliation.
- No implicit trust between projects.
- Separate secrets, environments, and production access.
- Data remains owned by the system that creates and governs it.
- Avoid duplicated master records; define authoritative sources.
- Use asynchronous integration where synchronous coupling is not justified.
- Human approval for high-impact or irreversible automation.
- Design for observability, recovery, and graceful degradation.

## 4. Data ownership

Each shared data domain must identify its system of record, owner, permitted consumers, classification, retention, correction/deletion workflow, and synchronization method. Do not copy employee, client, device, or credential data across projects without an approved purpose and access model.

## 5. Integration contract checklist

For each integration document:
- provider and consumer;
- business purpose and owner;
- data exchanged and classification;
- API/event schema and version;
- authentication and authorization;
- consent/approval requirements;
- retry, timeout, idempotency and error handling;
- rate/cost limits;
- audit and monitoring;
- data retention and deletion;
- test strategy and compatibility policy;
- disablement and exit plan.

## 6. Architecture decisions still required

Select canonical identity approach, shared API gateway strategy (if any), event transport, secrets management, observability stack, artifact registry, environment strategy, data classification, and integration ownership. Keep the zero-cost default and avoid selecting paid infrastructure without approval.


## 7. Owner-approved database and cross-project data direction — 2026-11-25

The following direction supersedes the open design questions in this document where they conflict:
- Use centralized/shared local database infrastructure, with separate databases for individual projects and shared organizational databases (hybrid model).
- Shared organizational domains include users/employees/roles, organization/departments, project ownership, authentication/authorization, audit records, common configuration/assets and reusable reference data.
- Keep each project's operational data logically separated. Use explicit schemas, tables, constraints and foreign keys in PostgreSQL; use MongoDB collections/documents/indexes only for justified document-oriented workloads.
- Do not create duplicate master records or cross-project direct database coupling. Identify the authoritative system of record and ownership for each domain.
- Centralized, versioned APIs/services are the default cross-project access path. Direct database access is an exception requiring documented technical justification, least-privilege credentials and explicit data ownership.
- Apply project/role/service permissions, environment separation, migrations, backups, retention and audit to shared and project-specific data.
- The owner has PostgreSQL and MongoDB Compass installed locally. Inspect and use existing local services; request connection URLs/credentials only when required. Never place real secrets in source control.
- The operating-cost ceiling remains ₹0. Use local infrastructure and mocks until a free/authorized service is available.

The owner decisions do not imply that a shared database server, shared API, or cross-project integrations are already installed or accepted. Implementation and verification remain separate tracked work.
