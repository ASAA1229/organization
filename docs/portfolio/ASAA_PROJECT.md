# Project Profile — ASAA

**Repository:** https://github.com/ASAA1229/ASAA  
**Product description:** Enterprise Project Integration Platform (working description); broader ASAA organization-operations vision requires boundary confirmation.

## Purpose and intended outcomes

Provide an organization-level platform for registering and understanding projects/repositories, reviewing branches and documentation, tracking requirements and dependencies, collecting implementation evidence, and producing portfolio summaries and gap reports.

A broader organizational vision has also included workforce, finance, customer/vendor, procurement, and project operations capabilities. It is not yet confirmed whether these belong in this product, separate modules/products, or organizational processes. Do not silently fold all such functions into the platform scope.

## Potential user groups

Organization owner/administrators, managers, project/product owners, technical leads, contributors, auditors/reviewers, and authorized business stakeholders. Exact roles and permission matrix require owner approval.

## Architecture notes

Historical repository context described a web UI/API and PostgreSQL-backed data/migration direction, including React/Vite and FastAPI/SQLAlchemy. Treat this as repository-described historical context, not a verified current architecture. Re-inspect the current branch and code before making implementation claims.

## Epic register (12 epics)

1. Governance and organization administration
2. Identity, authentication and authorization
3. People and workforce lifecycle
4. Payroll, leave, timesheets and expenses
5. Supplier, procurement and accounts payable
6. Accounts receivable, customer and commercial operations
7. Project, product and service delivery
8. Analytics and reporting
9. Security, privacy and audit
10. CI/CD, release and operations
11. Backup, recovery and continuity
12. Shared ecosystem and data integration

Epics 3–6 reflect a broad capability register and require confirmation against the final product boundary.

## Candidate sub-epic decomposition (to validate)

- Organization administration: organization profile, divisions, teams, roles, policy registry, approval matrix.
- Identity/access: authentication, SSO options, MFA, session/device management, RBAC/ABAC, provisioning/deprovisioning.
- Workforce: people directory, onboarding/offboarding, role changes, skills, access reviews.
- Payroll/time/expenses: time capture, leave workflow, expense claims, payroll integrations, approvals and audit.
- Procurement/AP: supplier onboarding, due diligence, purchase requests, approvals, invoices, reconciliation.
- AR/commercial: customer records, proposals, contracts, billing, collections, support obligations.
- Delivery: project registry, POC/scope, requirements, epics, dependencies, milestones, status, evidence, acceptance.
- Analytics: portfolio dashboards, delivery metrics, risk trends, cost views, audit exports.
- Security/audit: policy controls, audit events, incident workflow, privacy requests, evidence retention.
- CI/CD/operations: repository integration, pipeline status, deployment records, environment inventory, monitoring.
- Continuity: backup policy, restore tests, RPO/RTO, disaster recovery, continuity runbooks.
- Integration: API contracts, events, identity federation, data ownership, connectors, sync/error handling.

## Current status and known gates

Prior assessment context reported local API/UI/E2E/security/database evidence, but production was **NO-GO** at that assessment. Open gates included provider activation, production database/hosting, UAT, independent assurance, RPO/RTO, live monitoring, and release readiness. These are historical reported findings and must be revalidated against current evidence before treating them as current facts.

## Next validation

Confirm product boundary, current architecture, epic applicability, implementation state, test evidence, data model, external provider choices, operational ownership, legal requirements, and production gates.
