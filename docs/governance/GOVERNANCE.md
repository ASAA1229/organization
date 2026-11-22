# ASAA Governance and Decision Rights

## 1. Governance objectives

Governance makes authority, accountability, scope, and evidence explicit. It should enable delivery rather than create unnecessary process.

## 2. Decision domains

| Domain | Decision examples | Required record |
|---|---|---|
| Organization strategy | Mission, portfolio direction, classification, risk appetite | Owner decision |
| Product scope | Personas, features, exclusions, success measures | POC / scope / requirements |
| Architecture | Boundaries, technology, integrations, data ownership | Architecture decision record |
| Security and privacy | Data classification, access, threat controls, exceptions | Security/privacy review |
| Delivery | Priority, milestone, acceptance criteria | Roadmap / backlog |
| Release | Production readiness, rollout, rollback | Release approval |
| Cost | Paid services, subscriptions, infrastructure | Cost approval |
| Data | Collection, retention, sharing, deletion | Data owner decision |

## 3. Authority rules

- The organization owner retains final authority over organization-wide policies, portfolio direction, paid commitments, and release permissions unless explicitly delegated.
- Project owners manage project scope and delivery within approved organization policies.
- Technical leads recommend architecture and implementation choices; they do not independently authorize scope expansion, paid services, or production release.
- Security/privacy concerns may block progression until risk is assessed and mitigated or explicitly accepted by the authorized owner.
- A person performing work should not self-approve a high-risk change when independent review is reasonably available.

## 4. Approval gates

A change may require some or all of:
1. Requirement and scope approval
2. Architecture and dependency review
3. Security/privacy and data review
4. Cost approval
5. Code review and automated checks
6. QA and integration evidence
7. User/business acceptance
8. Release and rollback approval

Applicability must be risk-based and recorded.

## 5. Decision records

Every material decision should record:
- ID and date
- Context and problem
- Options considered
- Decision and rationale
- Scope and affected projects
- Risks and mitigations
- Owner/approver
- Evidence or links
- Review trigger/date
- Status: Proposed, Approved, Rejected, Superseded, or Withdrawn

## 6. Governance status

The ASAA Master Requirements Baseline v1.0 was approved on 2026-11-14 for planning and governance. It does not grant implementation, test, deployment, merge, purchase, or release authority. Specific approval must be obtained for those activities.
