# Engineering, Quality and Delivery Standards

## 1. Lifecycle state definitions

| State | Meaning |
|---|---|
| Not assessed | No reliable assessment has been completed |
| Planned | Accepted as intended work, not started |
| Ready | Scope and dependencies are sufficiently clear to begin |
| In development | Implementation is actively underway |
| Implemented-unverified | Code or artifact exists; behavior has not been adequately verified |
| Testing | Verification is underway |
| Tested | Defined tests passed; acceptance/production is not implied |
| Integration in progress | Component integration is underway |
| Integrated | Integration checks passed for the stated scope |
| Partially complete | Some acceptance criteria are met; remaining criteria are listed |
| Blocked | Progress depends on an unresolved blocker |
| Accepted | Authorized stakeholder accepted the stated scope |
| Released/operational | Released into the target environment and operational evidence exists |
| Deprecated | Retired or scheduled for removal with a migration/retirement plan |

Never collapse these states into a simple “done” label.

## 2. Definition of Ready

A work item should have a clear problem/outcome, user or stakeholder, scope and exclusions, dependencies, acceptance criteria, priority, owner, and relevant security/privacy/cost considerations.

## 3. Definition of Done

A work item is complete only for the explicitly stated scope when:
- implementation matches approved acceptance criteria;
- code/documentation review is complete;
- relevant unit, integration, end-to-end, security, accessibility, performance, and regression tests pass as applicable;
- test evidence and environment are recorded;
- dependencies and data migrations are reviewed;
- security/privacy risks are addressed or formally accepted;
- telemetry, support, rollback, and recovery needs are addressed for operational changes;
- user/business acceptance is recorded where required;
- documentation and traceability are updated.

A code file existing is not proof of a working feature. A passing local test is not proof of production operation.

## 4. Requirements traceability

Use a stable ID chain:
Organization objective → requirement → epic → sub-epic → user story → task/change → test case → evidence → acceptance/release.

Each user story should include a persona, need, outcome, priority, acceptance criteria, dependencies, risks, and evidence links. Exact question-level reconciliation from the discovery rounds remains outstanding.

## 5. Architecture and code quality

Prefer modular boundaries, explicit contracts, maintainable interfaces, documented data ownership, secure configuration, automated quality checks, and minimal coupling. Technology choices are project-specific and must be recorded in architecture decisions.

## 6. Testing strategy

Use risk-based testing. Cover happy paths, negative paths, permissions, edge cases, failure/retry behavior, data integrity, migrations, accessibility, responsiveness, security, and performance as applicable. Record test environment, build/commit, results, defects, and limitations.

## 7. Release readiness

Release requires approved scope, reviewed change, passing checks, QA evidence, security/privacy assessment, user acceptance as applicable, migration and rollback plan, monitoring, support ownership, and explicit release authorization.
