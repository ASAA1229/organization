# Open Questions and Validation Register

Unknowns are deliberately visible. Do not replace them with guesses.

## Organization
- [ ] Confirm legal entity status, jurisdiction, registration, and formal company structure.
- [ ] Confirm organization chart, named role holders, delegation, backups, and approval limits.
- [ ] Confirm external-facing mission, vision, and service descriptions.
- [ ] Confirm reporting cadence, KPI definitions, and audience.
- [ ] Confirm commercial, client, contracting, invoicing, tax, and support policies with appropriate professional review.

## Governance and policy
- [ ] Ratify each policy, policy owner, approver, effective date, and review period.
- [ ] Define data classification, retention, deletion, and privacy request procedures.
- [ ] Define incident severity, response time targets, notification, and escalation.
- [ ] Define risk appetite and formal exception process.
- [ ] Verify GitHub branch protection/rulesets across every repository.

## Master requirements
- [ ] Reconcile original question and answer records from all five rounds / 50 sets / 1,000 questions.
- [ ] Map every normalized requirement to its exact source question(s).
- [ ] Resolve duplicate, conflicting, conditional, and ambiguous statements.
- [ ] Confirm project applicability and shared capability ownership.
- [ ] Assign named accountable owners and approvers.
- [ ] Add measurable acceptance criteria, tests, evidence, priorities, dependencies, estimates and target dates.

## ASAA project
- [ ] Confirm whether workforce, payroll, procurement, finance, vendor and customer operations belong in the ASAA product or broader organization vision.
- [ ] Verify current architecture, modules, APIs, database, deployment, tests and security posture.
- [ ] Revalidate historical production NO-GO gates and record current evidence.

## Portfolio project
- [ ] Verify current source branch, framework, deployment, profile data ownership and admin access.
- [ ] Confirm consent and content rights for each profile.
- [ ] Verify resume/media upload security, storage, retention and deletion.
- [ ] Verify AI provider, key handling, cost limits and privacy settings.
- [ ] Re-run test, accessibility, performance and UAT checks.

## JARVIS project
- [ ] Inventory existing implementation and merged changes before planning new work.
- [ ] Verify actual wake-word behavior on target laptop and privacy indicators.
- [ ] Verify both Android devices, pairing, session isolation and recovery.
- [ ] Verify local/cloud routing, no continuous cloud audio upload, provider cost and failure behavior.
- [ ] Verify payment-app exclusion and high-risk action approvals.
- [ ] Confirm Jenkins/Nexus activation status and operational prerequisites.

## Templates project
- [ ] Verify current build, tests, security scans, migrations and runtime.
- [ ] Confirm employee/management-only access and role matrix.
- [ ] Verify template catalog, builder, versioning, collaboration, exports and deployment paths.
- [ ] Confirm JARVIS mini-feature boundaries and AI privacy/cost controls.
- [ ] Verify offline Linux/AIX environment snapshot behavior, TXT/JSON outputs, no-network constraint, and CMM ICG/ACQ/ISS mapping.

## Evidence rule

Each completed validation item must link to a dated source: commit, PR, test run, deployment, screenshot, signed acceptance, policy setting, or other verifiable record. A checkbox should not be checked based solely on an unverified statement.


## Owner decisions completed — 2026-11-25

The following questions are no longer owner blockers; implement or verify them within existing scope:
- ASAA supplier/banking workflows may be developed with dummy data; real banking integration waits for explicit authorization/investment.
- JARVIS Android phones are available; inspect the local development environment and set up free tooling where possible. Physical device acceptance remains a validation task.
- Jenkins/Nexus strategy: support local Jenkins/artifact storage, GitHub Actions/free alternatives and a hybrid path; keep live/paid Nexus integrations optional and non-blocking.
- Portfolio access: owner full admin; other admins restricted; profile owners manage their own profile.
- ASAA backups: automated local backups, configurable retention, documented RPO/RTO and restore testing. Numeric business targets are not yet confirmed.
- Authentication: local-first, optional free external identity providers.
- Security: RBAC/least privilege, secure authentication/session/password handling, audit, encryption, secrets management and automated security tests.
- Organization monitoring: central dashboard/reporting for all six repositories, including status, evidence, risks, dependencies, ownership and checkpoints.
- Quality: all applicable tests/checks with documented results; no unresolved critical failures before feature completion.
- Environment/configuration: every project maintains `.env.example`; missing values are identified and requested only when needed; actual secrets never enter Git.
- Data: dummy data by default until real data is authorized. Owner has local PostgreSQL and MongoDB Compass; use existing services and request connection details only when required.
- Database organization: shared infrastructure, separate project databases plus shared organizational databases. Shared domains include identity/users/roles, organization/departments, projects/ownership, audit, common configuration/assets and reference data.
- Cross-project data access: centralized APIs/services by default; direct database access only when technically justified.

## Owner decisions still open or actions requiring owner participation

- Legal entity, jurisdiction, registration and formal company structure.
- Named role holders, organization chart, delegated authority and approval limits.
- Final policy ratification/effective dates and formal incident/risk appetite commitments.
- Numeric business RPO/RTO commitments if they must be approved as organizational targets.
- Credentials, account registrations, permissions and identity verification when a concrete integration requires them.
- Physical-device acceptance and user acceptance where only the owner can perform the test.
- Paid spending, any move beyond zero cost, PR promotion into `dev`/`main`, and production release approval.

The owner is not required to answer all open items before development continues. Request only the one decision needed for the next genuinely blocked task. Continue other work.
