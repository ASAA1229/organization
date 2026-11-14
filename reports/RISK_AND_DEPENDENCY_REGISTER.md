# Organization Risk and Dependency Register

**Status:** Initial register; scoring, owners, dates, and mitigations require owner review.

## Risk register

| ID | Risk | Impact | Initial response | Owner |
|---|---|---|---|---|
| ORG-R01 | Requirements are broad but not fully normalized or traceable | Scope gaps, duplication, rework | Reconcile source answers; assign IDs and acceptance criteria | To assign |
| ORG-R02 | Project scope boundaries are ambiguous, especially ASAA enterprise platform vs broader operations vision | Scope creep and architecture overload | Owner decision on product boundary | To assign |
| ORG-R03 | Status may be overstated without current evidence | Incorrect planning/release decisions | Evidence-based lifecycle states and dated links | Project owners |
| ORG-R04 | Branch protection may exist only as written policy | Accidental direct changes to protected branches | Verify and configure GitHub rulesets | Repository admins |
| ORG-R05 | Shared capabilities may create coupling or data leakage | Security and reliability impact | Define ownership, contracts, access, and isolation | Architecture/security |
| ORG-R06 | Zero-cost constraint may conflict with hosting/provider requirements | Delays or unexpected cost | Cost/feasibility assessment before commitment | Owner |
| ORG-R07 | AI integrations may expose private data or incur usage cost | Privacy, security, financial exposure | Provider review, local-first options, approvals and limits | Security/AI owner |
| ORG-R08 | Insufficient UAT/operational evidence | Poor user experience or unsafe release | Acceptance and release gates | Project owner |
| ORG-R09 | Backup/recovery targets are undefined | Data loss and prolonged outage | Define RPO/RTO and test restores | Operations/data owners |
| ORG-R10 | Named owners and delegation are incomplete | Decisions blocked or unaccountable | Confirm RACI and backups | Organization owner |

## Cross-project dependency candidates

| Dependency | Provider → consumer | Required contract/evidence |
|---|---|---|
| Identity and access patterns | Organization policy → all products | Identity model, roles, session and provisioning boundaries |
| Requirements and project registry | ASAA platform concept → portfolio reporting | Project/requirement schema and evidence links |
| Reusable templates | Templates → project teams | Template metadata, version compatibility, security checks |
| AI/automation capabilities | JARVIS and approved providers → eligible projects | Tool contracts, privacy controls, permissions, cost limits |
| Shared assets/media | Asset capability → Portfolio/Templates | Storage, rights, access, retention |
| CI/CD and artifact practices | Shared engineering standards → all repos | Pipeline conventions, credentials, artifact provenance |
| Audit/monitoring | Shared standards → all products | Event schema, retention, dashboards, alert ownership |

These are candidate dependencies, not proof that integrations are currently active.

## Required fields for a mature register

Risk ID, description, category, probability, impact, score, trigger, owner, mitigation, contingency, due date, residual risk, status, review date, evidence link.

Dependency ID, provider, consumer, contract, owner, readiness, required-by date, failure impact, fallback, version, test evidence, status.
