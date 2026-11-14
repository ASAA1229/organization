# 6. How We Work — Policies, Delivery, and Onboarding

## Branch policy
Standard branches across ASAA projects:
- main: production/release line.
- dev: integration line.
- new: routine feature and planned change work.
- fix: focused defect correction.
- test: testing and validation.

Routine work targets new. dev and main are not routine work targets. Promotion from new to dev and dev to main requires a separately reviewed and explicitly authorized pull request. Do not merge or release without explicit approval. Written policy does not prove GitHub branch protection is enforced; verify repository settings.

## Change authorization
A planning discussion, recommendation, status report, onboarding guide, or approved requirements baseline does not automatically authorize implementation. Before changing a project:
1. Confirm project and exact outcome.
2. Confirm explicit owner authorization.
3. Read current project docs and inspect repository state.
4. Identify dependencies, data sensitivity, security, cost, and rollback impact.
5. Work on the correct branch.
6. Keep the change focused and reviewable.
7. Test and record evidence.
8. Obtain approval before promotion, deployment, or release.

Do not assume authorization to purchase services, activate paid providers, merge, deploy, publish personal data, or perform consequential automation.

## Cost principle
Zero ongoing cost is the default. Before proposing paid tools/services/infrastructure/AI, document purpose, one-time and recurring costs with currency, alternatives, data/privacy implications, usage limits, and exit plan. Do not activate paid services without approval.

## Requirements and lifecycle
Master Requirements Baseline v1.0 was approved on 2026-11-14 as a planning/governance baseline only. It does not authorize implementation, testing, repository changes, deployment, paid services, merges, or releases.

Discovery is recorded as five rounds, 50 sets, 1,000 questions, followed by 12 consolidation stages at framework/planning level. Exact question-level mapping and reconciliation remain open. Selecting all options means broad desired coverage, not that every option applies to every project.

Use explicit states: Not assessed; Planned; Ready; In development; Implemented-unverified; Testing; Tested; Integration in progress; Integrated; Partially complete; Blocked; Accepted; Released/operational; Deprecated.

Code existing does not equal tested, accepted, or operational. Evidence should identify commit/build, environment, test/review performed, result, date, scope, and limitations.

## Definition of Ready
A work item should have a clear problem/outcome, project and stakeholders, scope/exclusions, acceptance criteria, dependencies/risks, data/security/privacy impact, cost impact, technical approach where needed, owner/approval path, and verification approach. If critical details are missing, mark clarification required.

## Definition of Done
Acceptance criteria met; code/config/docs reviewed; relevant tests pass; security/privacy checked; integration verified where applicable; evidence linked to commit/build and environment; limitations documented; owner/acceptance authority accepts; and release/operational requirements satisfied if release is intended.

## Security and privacy
Use least privilege. Never commit secrets, API keys, passwords, or tokens. Do not copy personal, profile, client, or business data into unapproved systems. Treat uploads, imported templates, generated code, and external inputs as untrusted. Prevent logs from leaking credentials or sensitive data. Escalate suspected exposure, unauthorized access, data loss, or unsafe automation immediately.

Project-specific controls: JARVIS preserves payment-app exclusion and approval gates; Portfolio preserves profile consent and data separation; Templates enforces internal access; ASAA protects sensitive organizational data.

## Communication
Report what changed, what was verified and how, what remains, blockers/risks, decisions needed, and next step. Distinguish verified facts, owner-reported context, assumptions, proposals, and unknowns. Do not report historical status as current without revalidation.

Weekly project updates and monthly portfolio reviews are proposed cadences, pending owner approval. Maintain release-readiness and incident reports when those events occur.

## Escalation
Escalate immediately for suspected security/privacy incidents, unauthorized access, data loss, financial/legal exposure, production outage, unsafe automation, or release bypassing approval. For ordinary blockers, record impact, owner, due date, mitigation, and decision required.

## New member checklist
### Before access
- [ ] Confirm role, project assignment, reporting line, and approver.
- [ ] Complete required confidentiality, security, and policy onboarding.
- [ ] Receive only minimum required repository/environment access.
- [ ] Understand incident and urgent-blocker reporting.

### First days
- [ ] Read this guide and organization charter/operating model.
- [ ] Read assigned project's README, POC, requirements, architecture, status, and open issues.
- [ ] Inspect branch policy and working branch.
- [ ] Set up environment using project instructions.
- [ ] Run existing checks without changing unrelated code.
- [ ] Identify owners, dependencies, test commands, and deployment boundaries.

### Before first change
- [ ] Confirm work item and acceptance criteria.
- [ ] Confirm authorization and correct branch.
- [ ] Check secrets, data, privacy, and cost implications.
- [ ] Record baseline behavior and tests.
- [ ] Make a small reviewable change and provide evidence.

### Ongoing
- [ ] Keep docs/status evidence current when authorized.
- [ ] Raise unclear requirements early.
- [ ] Never merge, deploy, purchase, publish, or enable external services without approval.
- [ ] Document decisions so future teammates can onboard independently.

## Organization-wide open items
Legal entity/jurisdiction/registration; organization chart and named role holders; approval limits; final product boundary for HR/finance/procurement/customer capabilities; commercial/contract/tax/invoicing/support policies; policy owners and ratification; exact question-level discovery reconciliation; approved requirement-to-story/test/evidence traceability; current implementation/test/deployment/acceptance evidence; branch protection enforcement; and formal data retention/incident response targets remain to be confirmed.

If an open item affects your task, pause and ask the owner. This guide is designed to eliminate routine orientation questions, not to invent decisions that have not been made.
