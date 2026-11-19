# 2. Project Guide — ASAA

**Repository:** https://github.com/ASAA1229/ASAA  
**Working description:** Enterprise Project Integration Platform  
**Product-boundary status:** Core project/governance intent is described; broader organizational operations scope needs owner confirmation.

## Purpose
ASAA's project-platform direction is to help the organization understand and coordinate projects and repositories. The intended platform should make project information, repository structure, branches, requirements, dependencies, implementation evidence, risks, and portfolio reports easier to inspect and manage.

A broader vision has included workforce, payroll, leave, timesheets, expenses, supplier/procurement, accounts payable, customer/commercial operations, finance, and project delivery. It is not confirmed whether these belong inside this product, in separate modules/products, or in organizational processes. Do not assume they are approved product scope.

## Potential users
Organization owner and administrators; managers and portfolio coordinators; project/product owners; technical and engineering leads; contributors; reviewers/auditors; and authorized business stakeholders. Exact roles, permissions, and approval boundaries remain to be finalized.

## Capability areas
1. Organization profile, divisions, teams, roles, and policy records.
2. Identity, authentication, authorization, sessions, and access reviews.
3. Project/repository registry, metadata, branch visibility, and documentation references.
4. POC, scope, requirements, epics, stories, milestones, dependencies, and risks.
5. Status and evidence tracking across source, tests, integration, deployment, and acceptance.
6. Dashboards, reports, audit history, and portfolio analytics.
7. Security, privacy, access governance, and incident records.
8. CI/CD, release, monitoring, backup, recovery, and operational readiness.
9. Potential workforce, finance, procurement, supplier, customer, and commercial workflows, conditional on boundary approval.
10. Shared ecosystem integrations and data ownership controls.

## Candidate epic register
1. Governance and organization administration.
2. Identity, authentication, and authorization.
3. People and workforce lifecycle.
4. Payroll, leave, timesheets, and expenses.
5. Supplier, procurement, and accounts payable.
6. Accounts receivable, customer, and commercial operations.
7. Project, product, and service delivery.
8. Analytics and reporting.
9. Security, privacy, and audit.
10. CI/CD, release, and operations.
11. Backup, recovery, and continuity.
12. Shared ecosystem and data integration.

Epics 3–6 are a broad capability register and must not be treated as confirmed product scope until approved.

## Candidate sub-epics
- Organization administration: organization profile, divisions, teams, roles, policies, approval matrix.
- Identity/access: authentication, optional SSO, MFA, sessions/devices, RBAC/ABAC, provisioning/deprovisioning.
- Workforce (conditional): directory, onboarding/offboarding, role changes, skills, access reviews.
- Time/pay/expenses (conditional): time capture, leave, expense claims, payroll integrations, approvals, audit.
- Procurement/AP (conditional): supplier onboarding, due diligence, purchase requests, approvals, invoices, reconciliation.
- Customer/AR (conditional): customer records, proposals, contracts, billing, collections, support obligations.
- Project delivery: project registry, POC/scope, requirements, epics, dependencies, milestones, status, evidence, acceptance.
- Analytics: portfolio dashboards, delivery metrics, risk trends, cost views, audit exports.
- Security/audit: policy controls, audit events, incident workflow, privacy requests, evidence retention.
- CI/CD/operations: repository integration, pipeline status, deployment records, environment inventory, monitoring.
- Continuity: backup policy, restore tests, recovery objectives, disaster recovery, runbooks.
- Integration: API contracts, events, identity federation, data ownership, connectors, synchronization/error handling.

## Architecture notes
Historical context described a web UI/API and PostgreSQL-backed data/migration direction, including React/Vite and FastAPI/SQLAlchemy. This is not verified current architecture. Inspect the current repository, active branch, manifests, API, schemas, migrations, tests, and deployment configuration before treating the stack as current.

## Reported progress and remaining work
A previous assessment described local API/UI/E2E/security/database evidence and a production **NO-GO** assessment. This is historical and must be revalidated. Previously identified gates included provider activation, production database/hosting, UAT, independent assurance, recovery objectives, live monitoring, and release readiness.

The complete remaining-work list must be produced from a fresh repository inventory and requirement-to-evidence mapping. Do not claim production readiness until required gates are closed with evidence and explicit approval.

## Risks and first tasks
Key risks: premature scope expansion into HR/finance/procurement/customer systems; sensitive data exposure; integration coupling and data inconsistency; dashboards presenting stale/self-reported status as verified; missing operational ownership.

New contributors should read the current README, POC, stories, architecture, and status; inspect active branch and code; map modules/tests to candidate epics; identify gaps with commit/test evidence; and confirm the product boundary before implementing broad business modules.
