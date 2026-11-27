# ASAA1229 Master Task Register

**Created:** 2026-11-27  
**Scope:** Organization, Configuration, ASAA, JARVIS, Templates, Portfolio  
**Status vocabulary:** Not started, In progress, Implemented, Testing, Failed, Blocked, Completed

## Progress method

Progress is the count of **Completed** tasks divided by total registered tasks, excluding task categories with no approved requirement. This register will be updated after evidence is collected. It does not count source presence, merged PRs, documentation or local test files as completed.

## Audit snapshot

- All six `new` working branches are aligned with `origin/new`.
- Organization has one untracked report created during this review; all other working trees are clean.
- GitHub CLI authentication is available.
- No open pull requests are present in any of the six repositories.
- The historical claim of 17 pending commits has no matching open PR or local commit queue. Refresh result: no 17-commit pending set is identifiable.
- Protected-branch promotion and release are explicitly excluded until owner approval.

| Task ID | Project | Module | Requirement | Existing status | Remaining work | Dependencies | Priority | Acceptance criteria | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| ORG-001 | Organization | Repository audit | Central project registry | Implemented | Verify exact fields and owner synchronization | GitHub inventory data | High | Machine-readable registry reflects all six repos and exact heads | `organization/governance`, `scripts/governance.mjs` |
| ORG-002 | Organization | Governance CI | Validate requirements and branch controls | Completed | Refresh exact GitHub CI run separately | Node 24-compatible runtime | High | Governance model and test pass on current SHA | 68 files scanned; 4 governance tests passed; governance model emitted one dependency-contract warning |
| ORG-003 | Organization | Cross-project report | Dashboard/status/risk/reporting | Implemented | Verify report against current branches and CI | GitHub read access | High | Report identifies exact evidence and unavailable integrations | `scripts/governance.mjs report` |
| ORG-004 | Organization | Branch protection | Prevent unauthorized promotions | Blocked | Inspect rulesets and required checks | Repository admin access | High | Settings and required checks verified | GitHub API branch/ruleset evidence |
| CFG-001 | Configuration | Policy validation | Central schemas/locality/secrets/drift/dependency checks | Testing | Resolve 3 approval/discrepancy warnings and 2 pending owner requests | Node; all repositories present | High | Policy gate passes; all warnings and owner decisions are explicitly resolved | Fresh exact-head run passed; 197/197 approved; 5 approval findings |
| CFG-002 | Configuration | Dependency control | Immutable approved dependencies | Implemented | Refresh exact reported snapshot only after delta review | Owner approval for snapshot changes | High | No mutable image refs or unapproved dependencies | `policy/approved-dependencies.json` |
| CFG-003 | Configuration | Identity | Central Keycloak local identity | Testing | Start and verify loopback, TOTP, demo data labeling | Docker/PostgreSQL if available | Medium | Loopback-only smoke passes; no live secrets | `identity/docker-compose.yml` |
| CFG-004 | Configuration | Recovery | Policy/configuration rollback and history | Partially implemented | Map and test rollback/restore procedure | Configuration owner approval | Medium | Rollback and version evidence are reproducible | `docs`, `reports`, `checks/history` |
| ASAA-001 | ASAA | Build/API | Frontend/backend build integrity | Completed | Attach exact GitHub CI evidence if needed | npm/Python/PostgreSQL optional | High | Web build and applicable API tests pass | Vite build passed; 75 UI tests passed; 757 API tests passed/6 skipped |
| ASAA-002 | ASAA | Identity/security | OIDC/PKCE/authorization isolation | Implemented | Run negative authorization tests on exact head | Identity settings external | High | Negative routes reject forged/expired/unauthorized tokens | `apps/ap-api/tests` |
| ASAA-003 | ASAA | Finance/HR | End-to-end payroll, leave, expense and procurement workflows | Implemented | Run local API/UI and reconcile missing external integrations | Approved policies | High | Applicable workflows pass API/UI tests and are auditable | `docs/EPIC_STATUS.md`, `apps/ap-api` |
| ASAA-004 | ASAA | Operations | PostgreSQL, backup, monitoring and recovery | Partially implemented | Run local migration/backup/restore; production requires external access | PostgreSQL, hosting, credentials | High | Migration/restore evidence and runbook pass locally | `deploy`, `scripts`, `monitoring` |
| ASAA-005 | ASAA | Branch/CI | `dev`/`main` exact-head CI | Blocked | Diagnose current branch failures; rerun exact heads | GitHub CI access | High | Required workflows pass exact candidate SHA | GitHub Actions |
| JARV-001 | JARVIS | Build/test | Exact-head build and test suite | Completed | Attach exact GitHub CI run separately | Node 24; local tools | High | Build/lint/core tests pass or failures are fixed | TypeScript build/lint passed; 811 core tests passed; 3 script tests passed |
| JARV-002 | JARVIS | Voice/Windows | Wake, STT/TTS and Windows command lifecycle | Partially implemented | Complete software lifecycle tests; require hardware acceptance separately | MSI Windows 11, microphone | High | Software lifecycle pass; physical-device evidence attached | `src`, `test`, `docs` |
| JARV-003 | JARVIS | Android | Enrollment, sessions, QR/authenticator and revocation | Blocked | Complete physical two-phone validation | Two Android phones, SDK | High | Independent sessions/revoke/offline flows pass on devices | `android-app`, `test` |
| JARV-004 | JARVIS | Security | Sensitive-action confirmation and payment exclusion | Implemented | Re-run policy/safety regression suite | None | High | Payment apps denied; confirmations enforced | `test/policy_permission_matrix.test.ts` |
| JARV-005 | JARVIS | CI/CD | Jenkins/artifacts and exact-head CI | Blocked | Verify live Jenkins endpoint and exact GitHub SHA | Jenkins credentials/endpoint | Medium | Live pipeline and artifact lifecycle evidence attached | `Jenkinsfile`, CI workflows |
| TMP-001 | Templates | Build/test | Exact-head validate/smoke/build/E2E | Completed | Attach smoke/E2E evidence and exact GitHub CI run separately | Node 24; PostgreSQL | High | Validation, smoke and applicable E2E pass | Format/lint/typecheck pass; contracts 25/25; API 442 pass/2 skip; web 26/26; production build passes |
| TMP-002 | Templates | Environment Snapshot | Linux/AIX snapshot and CMM mappings | Partially implemented | Run available host tests and document unavailable native targets | Linux/AIX targets | High | TXT/JSON and CMM mappings pass on supported hosts | `tools`, `scripts`, `docs` |
| TMP-003 | Templates | Isolation | Live container resource/network/filesystem enforcement | Blocked | Exercise live container if Docker is available | Docker daemon/host | High | Isolation limits and cleanup pass | `apps/api/src`, tests |
| TMP-004 | Templates | Jenkins/deployment | Live connectors and backup/recovery | Blocked | Verify with approved endpoints; do not activate Nexus | Owner/credentials/topology | Medium | Live approved integration evidence attached | `Jenkinsfile`, deployment docs |
| TMP-005 | Templates | Authoring/delivery | Catalog, versioning, ZIP, Git/GitHub, workspace | Implemented | Run regression suites and close known E2E gaps | Git/GitHub access | High | Discovery/edit/version/export workflows pass | `apps`, `packages`, tests |
| PORT-001 | Portfolio | Build/test | Exact-head verify and browser tests | Completed | Attach exact GitHub CI run separately | Node 24 | High | Verify/build/test/E2E pass exactly and repeatably | Package guard/typecheck/lint passed; Vitest 668 passed/1 skipped; Node script 4 passed |
| PORT-002 | Portfolio | Media/storage | R2/resume/image lifecycle | Partially implemented | Run hosted acceptance or record external blocker | Cloudflare/R2 environment | High | Hosted upload/replacement/deletion/recovery pass | `src/server.ts`, Miniflare/tests |
| PORT-003 | Portfolio | AI | Secure JARVIS/OpenAI gateway integration | Partially implemented | Verify live gateway or explicitly defer; preserve secrets | JARVIS gateway/provider | Medium | Backend-only keys, throttle, errors and usage evidence pass | `src`, gateway tests |
| PORT-004 | Portfolio | UI/performance | INP, accessibility and responsive behavior | Testing | Investigate and remediate INP/regression targets | Browser/physical devices | Medium | INP <= 200 ms target where applicable; axe/browser tests pass | `scripts/browser-audit.mjs`, Playwright |
| PORT-005 | Portfolio | Deployment/recovery | Hosted deployment, monitoring and rollback | Blocked | Dry-run local and await owner-approved environment | Cloudflare credentials/topology | High | Dry-run/recovery evidence and owner approval attached | `docs/OPERATIONS.md`, scripts |
| X-001 | Shared | Identity/configuration | Shared identity, secret and configuration contracts | Implemented | Reconcile contracts and exact consumers | Configuration repository | High | Each consumer resolves approved settings consistently | `contracts`, Configuration policy |
| X-002 | Shared | Data/API/events | Cross-project API and event contracts | In progress | Generate/validate contract inventory and integration tests | Project module owners | High | Contract suite covers project boundaries and failures | `contracts/ecosystem`, project `contracts` |
| X-003 | Shared | CI/CD | Branch, CI, artifact and quality gates | In progress | Re-run existing workflow candidates; verify branch protection separately | GitHub/Jenkins access | High | Exact-SHA builds/tests and branch controls are visible | `.github/workflows`, Jenkinsfiles; no open PRs |
| X-004 | Shared | Security | Secrets, dependency, authorization and vulnerability checks | In progress | Run available local audits/scans | npm/Python tools | High | No hardcoded secrets; dependency findings disposed | Repository audits |
| X-005 | Shared | Documentation | POC/status/user-story/operations alignment | Implemented | Refresh status only after verification evidence | Project test evidence | Medium | Status documents reflect exact evidence and blockers | `docs`, `reports` |

**Initial registered tasks:** 31  
**Completed:** 5 (ORG-002, ASAA-001, JARV-001, PORT-001, TMP-001)  
**In progress/Testing/Implemented:** 26  
**Failed:** 0  
**Blocked:** 10
