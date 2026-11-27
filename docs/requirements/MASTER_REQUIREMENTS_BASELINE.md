# ASAA Master Requirements Baseline v1.0

**Approval date:** 2026-11-14  
**Approval scope:** Planning and governance baseline  
**Status:** Approved baseline; detailed reconciliation and evidence validation remain open.

## 1. What approval means

The owner approved the proposed ASAA Master Requirements Baseline v1.0 as the planning and governance baseline for ASAA, Portfolio, JARVIS, Templates, and shared ecosystem capabilities.

This approval establishes the baseline for organizing, reconciling, tracing, and governing requirements. It does **not** authorize coding, testing, repository changes, deployment, paid services, merges, or releases.

## 2. Discovery history

The requirements discovery process is recorded as five rounds, 50 sets, and 1,000 questions, with a subsequent 12-stage consolidation at framework/planning level. Many answers selected all applicable options. These answers express broad desired coverage; they do not mean every option applies identically to every project, nor do they prove implementation.

## 3. Baseline governance expectations

The baseline expects:
- stable requirement IDs and traceability;
- source question and answer references;
- explicit project applicability and shared capability ownership;
- duplicate, conflict, ambiguity, and gap analysis;
- named owners and approval responsibilities;
- lifecycle state and change/version history;
- measurable acceptance criteria;
- dependency and risk mapping;
- evidence links from implementation, tests, integration, deployment, and acceptance;
- completeness checks across features, workflows, edge cases, security, UX, operations, and support;
- epic, sub-epic, user-story, task, test, and release structures;
- explicit approval gates and change control.

## 4. Required reconciliation work

1. Retrieve and reconcile all question-level answers and source records.
2. Normalize statements into atomic requirements without losing original meaning.
3. Mark each requirement as organization-wide, project-specific, shared, conditional, optional, or out of scope.
4. Identify duplicates, conflicts, ambiguity, missing decisions, and superseded answers.
5. Assign accountable owner and approver.
6. Define measurable acceptance criteria and verification method.
7. Map to epics, sub-epics, stories, tasks, test cases, and evidence.
8. Verify current repository and runtime state.
9. Score priority, risk, dependencies, effort, and readiness.
10. Obtain owner approval for the reconciled version.

## 5. Requirement lifecycle

Draft → Under analysis → Clarification required → Proposed → Approved → Planned → In progress → Implemented-unverified → Verified → Accepted → Released/operational → Deprecated or Rejected.

A requirement can be approved while its implementation remains unstarted. Do not infer delivery status from requirement approval.

## 6. Evidence hierarchy

Prefer direct, current evidence:
1. deployed behavior and production telemetry;
2. verified acceptance/UAT records;
3. automated test results tied to a commit/build;
4. integration and environment evidence;
5. source code, configuration, schemas, API/UI implementation;
6. project documentation and plans;
7. verbal or historical statements.

Record evidence date, commit/build, environment, scope, result, and limitations.

## 7. Open baseline items

The exact question-level source mapping, applicability decisions, named RACI, complete dependency graph, acceptance criteria, evidence verification, gap scoring, estimates, and target dates are not yet fully reconciled in this repository. These must remain visible as pending rather than being invented.


## 8. Owner execution decisions — 2026-11-25

The owner has now explicitly authorized independent continuation of remaining work within the existing project scope. This updates the earlier statement in section 1: the 2026-11-14 approval alone was planning-only, but the 2026-11-25 instruction authorizes engineering, documentation, local setup, testing and scope-safe remediation on working branches. It does not authorize merges/promotions to `dev` or `main`, paid services, production release, or actions requiring unavailable owner credentials.

The authoritative owner decisions are recorded in [OWNER_DECISIONS_AND_EXECUTION_BASELINE.md](../OWNER_DECISIONS_AND_EXECUTION_BASELINE.md). Key constraints:
- Prioritize all six repositories by dependencies, urgency and risk; continue unblocked work when the owner is unavailable.
- Strict ₹0 operating cost until investment is explicitly authorized; prefer free/local services and use dummy/mock data for unavailable integrations.
- Identify missing credentials only when required. Maintain each project's `.env.example` with safe placeholders and never commit actual secrets.
- Use the owner's existing local PostgreSQL and MongoDB installations. Adopt shared infrastructure with separate project databases plus shared organizational databases; prefer centralized APIs for cross-project data access and permit direct access only when justified.
- Owner decisions: local authentication first with optional free external providers; local automated backups and recovery testing; mandatory RBAC, least privilege, audit, encryption and automated security tests; owner retains production-release authority.
- Repository promotions into `dev` and `main` are postponed until explicit owner authorization.

These decisions are implementation constraints and do not assert that the corresponding capabilities are already implemented or verified.


## Owner decisions and execution constraints — 2026-11-27

This update records decisions made after the original v1.0 planning baseline and supersedes conflicting assumptions in older planning notes. Claude owns repository implementation. ChatGPT may update requirements documents only when explicitly asked; no application code, workflow, branch or PR changes are implied.

- Branch promotion timing is the owner's choice and is not an owner blocker.
- ₹0 operating cost until investment; use free/local tooling and dummy data where practical.
- Jenkins is in use. Nexus is paid and intentionally paused; not a blocker.
- ASAA HR: five-day workweek, 12 annual holidays, two sick days/month, nine-hour shift including one-hour lunch, two-month probation, quarterly reviews, standard 15-day notice (customizable by role/category), owner-decided salary at recruitment, owner-controlled hiring approval/delegation, and management-authorized overtime with owner-decided compensation.
- ASAA finance/procurement: implement complete dummy/local supplier and banking workflows now; real adapters remain disabled until investment and explicit owner activation with MFA, separate transaction approval, emergency disable and audit logging.
- Shared identity: centralized ASAA identity, local login plus optional external SSO; HR-driven access lifecycle and immediate revocation.
- Data architecture: central data platform and domain schemas by default; separate databases only when justified, connected through controlled APIs.
- Local-first access/deployment; VPN for remote access; public services selectively exposed. India initial jurisdiction, with configurable country rules and legal entities.
- Portfolio admin decisions are settled by the owner. Configuration repository remains public with sensitive information protected.
- JARVIS Android tooling: existing Android Studio/SDK, free local installation of missing components, plus command-line builds.

These are approved requirements, not implementation or test evidence. Project delivery status must be changed only from current, exact-commit evidence.
