# ASAA1229 Owner Decisions & Execution Baseline

**Updated:** 2026-11-27  
**Source:** Owner decisions Q1–Q36 in the ASAA1229 organization coordination conversation  
**Status:** Current execution baseline; supersedes conflicting assumptions in older planning notes where explicitly stated.

## 1. Operating authority

- Prioritize all six repositories by dependency, urgency, risk and ability to make progress.
- Work independently on routine engineering, documentation, testing, local setup, safe technical choices and scope-preserving improvements.
- Do not stop unrelated work when one item is blocked. Record the blocked item, identify what is needed, and continue other work.
- User availability is limited and unpredictable. Do not wait for the user unless the next action genuinely requires their input.
- Bring every unresolved major decision to the owner as a concise, direct question. Do not re-ask decisions already answered.
- Owner retains final authority over major business decisions, credentials/secrets, paid spending, production release and repository promotion.
- Branch promotion timing is entirely the owner's choice. Do not classify new → dev, dev → main, branch comparison or PR promotion as an owner blocker, and do not repeatedly ask about it. Do not promote branches on the owner's behalf; continue authorized work on working branches.

## 2. Cost and service constraints

- Operating-cost ceiling: ₹0 until the owner explicitly authorizes investment.
- Prefer free/open-source alternatives and existing local infrastructure.
- Use free deployment where practical; local deployment is acceptable and should remain the fallback.
- Do not activate paid hosting, subscriptions, APIs, registries or other paid services without owner approval.
- For unavailable services, build interfaces/adapters and use mocks/dummy data where useful. Mark unavailable dependencies as `NOT_YET_AVAILABLE`; do not let them block unrelated work.

## 3. Credentials and environment files

- Inspect each project to identify exact required environment variables, URLs, account permissions, credentials and secrets.
- Maintain a complete `.env.example` for every project, with variable names, purpose, safe placeholders and whether the value is required for local, test or production use.
- Never put actual secrets, passwords, tokens, private URLs or production credentials in `.env.example`, source control, logs or reports.
- Actual values belong only in the owner's private local `.env` or approved secret store.
- Ask the owner for a value only when a real task reaches the point where it is required. Until then, continue with safe mock/local configuration.
- Never invent credentials or assume an unavailable account exists.

## 4. Local data infrastructure and architecture

The owner has PostgreSQL and MongoDB Compass installed on the development laptop. Inspect and use existing local PostgreSQL and MongoDB services; ask for connection details only when they are actually needed.

Approved direction:
- Hybrid centralized architecture: use the central ASAA data platform and domain-separated schemas by default.
- Use separate databases only where isolation, security, scale or workload justifies them; independent stores communicate through controlled APIs.
- Shared organizational domains include users/employees, roles, organization/departments, projects/ownership, authentication/authorization, audit records, common configuration/assets and reusable reference data.
- Project data remains logically separated with explicit ownership, schemas, permissions, retention and migrations.
- PostgreSQL is used for relational data (databases, schemas, tables, constraints, foreign keys and transactions).
- MongoDB is used where document-oriented storage is justified (databases, collections, documents and indexes); do not duplicate relational records without a documented reason.
- Cross-project access uses centralized identity and versioned APIs/services by default. Direct database access is allowed only when technically justified, tightly scoped and documented.
- Define authoritative system of record, data classification, permitted consumers, retention, correction/deletion and synchronization for each shared domain.
- Do not connect every project to every shared dataset. Apply least privilege and project-specific service identities.

## 5. Project-specific owner decisions

### ASAA
- Build complete supplier, procurement and banking workflows, adapters, scripts, functions and tests now using free/local tooling and dummy data by default.
- Keep real banking connections and real transactions disabled until investment and explicit owner activation. Activation requires owner authentication, MFA, separate transaction approval, emergency disable, complete audit logs and transaction safeguards.
- Keep dummy and real data strictly separated; support generated/manual dummy data, reset and cleanup.
- HR decisions: five-day workweek; 12 holidays per year; two sick-leave days per month; shift-based nine-hour shifts including one-hour lunch; two-month probation; quarterly performance reviews; standard 15-day notice, customizable by role/category; overtime requires management authorization and owner decides compensation case by case.
- HR and department managers jointly recommend hires; owner gives final approval and may delegate within defined limits. Salary is decided by the owner at recruitment based on role, department, experience, knowledge and employee category.
- Workforce includes employees, contractors, interns, temporary staff, consultants, freelancers and external agency/vendor personnel. India is the initial jurisdiction; country rules are configurable.
- Use centralized ASAA identity with local login and optional SSO providers; HR-driven onboarding/role changes/offboarding, immediate revocation, session/device invalidation, periodic access reviews and audit history.
- Use local access by default, VPN for remote access and selectively exposed public services. Keep deployment local until the business is ready.
- Maintain local backups, encrypted offline copies, point-in-time recovery, periodic restore tests, configurable retention and disaster-recovery procedures; recovery targets vary by service criticality.

### JARVIS
- Android phones are available. Inspect the laptop development environment and configure free Android tooling where possible.
- Physical MSI voice/wake-word acceptance and two-phone acceptance remain real-world validation tasks; ask for owner/device access only when necessary.
- Continue all non-device work while physical validation is unavailable.
- Keep payment apps excluded and high-impact actions behind explicit approval.
- Jenkins is in use. Nexus is paid and intentionally paused until investment; it is not a blocker. Do not request Nexus credentials.

### Templates
- Keep access internal to authorized management and employees.
- Use local/free execution and storage where possible; keep untrusted code isolated from the trusted API process.
- Continue template, generation, export, certification, offline environment-snapshot and documentation work with dummy data when integrations are unavailable.
- Jenkins is in use. Paid Nexus integration is intentionally paused until investment and is not a blocker. Real remote Git credentials and production deployment remain deferred until available and authorized.

### Portfolio
- Owner has full administrator access.
- Other administrators have restricted permissions.
- Each profile owner can manage only their own profile and permitted content.
- Portfolio administrator-role decisions are owner-controlled and considered decided; do not list them as an open owner blocker.
- Preserve profile isolation, private media/resume handling and existing Lovable history/integration constraints.
- Do not convert the product into a multi-tenant SaaS or add paid AI/infrastructure without approval.

### Configuration
- Keep configuration and policy checks local-first and secret-free.
- Reconcile the older blanket external-identity-provider-disabled statement with the latest decision: local authentication first; optional free external identity providers may be supported when explicitly configured.
- Preserve dependency approval evidence and do not silently weaken security or data-locality checks.

### Organization
- Maintain a consolidated cross-project dashboard/register for project status, completed/pending/blocked/untested work, dependencies, risks, checkpoints, ownership and evidence.
- Maintain one owner-blocker register with priority, impact, exact requested action and affected project.
- Critical owner blockers are reported immediately; non-critical items are consolidated into weekly reporting.

## 6. Quality, security, backup and release rules

- Mandatory security baseline: RBAC, least privilege, secure authentication/session/password handling, audit logging, encryption, secrets management and automated security tests.
- Mandatory quality evidence: applicable unit, integration, API, UI, E2E, security, performance and compatibility tests; document exact commit, environment and result.
- A feature is not complete merely because code exists. Completion requires applicable tests and checks, documented results, and no unresolved critical failure.
- Automated testing and local deployment/verification should proceed without waiting for production services.
- Local automated backups, configurable retention, restore drills and documented recovery objectives are required where data is owned.
- Owner approves production releases. No production release is implied by a green local test or CI run.

## 7. Repository workflow

- Standard branches: `main`, `dev`, `new`, `fix`, `test`.
- Routine work is staged on `new`; targeted fixes may use `fix`; validation may use `test`.
- No merge/promotion into `dev` or `main` without explicit owner authorization.
- Preserve existing history, branches, pull requests, code, data and integrations.
- Report each delivery with repository, branch, commit/PR, changed paths and verification evidence.

## 8. Owner actions that may still be required

Only request owner input when a concrete task requires one of these:
1. A real credential, API key, database URL or account permission that is not available locally.
2. Identity verification, account registration or an action only the owner can perform.
3. A major business/product/security decision not covered by this baseline.
4. Paid spending or a decision to move beyond the ₹0 constraint.
5. Physical-device access or owner acceptance for a real-world test.
6. Branch promotion is owner-controlled scheduling, not a blocker; do not ask again unless the owner requests promotion assistance.
7. Final production release approval.

Do not treat these as reasons to pause other work.


## Owner clarification — 2026-11-27

- Claude is responsible for repository implementation. ChatGPT's current scope is requirements, constraints, architecture, dependencies, risk review and documentation updates explicitly requested by the owner. Do not change application code, workflows, configuration, branches or PR state unless separately authorized.
- The owner will develop, test, fix and promote branches on their own schedule. Branch promotion is not an owner blocker.
- Jenkins is active. Nexus is paid and paused; not a blocker.
- Portfolio administrator decisions are settled and not a blocker.
- Configuration remains public by owner decision; sensitive configuration, infrastructure details and secrets must remain protected.
- The latest Configuration policy evidence reported 197 approved / 197 current dependencies, zero removed, with locality, secret-reference and drift checks passing. Do not resurrect earlier discrepancies without newer evidence.
