# ASAA Organization Operating Model

## 1. Operating layers

| Layer | Responsibility | Primary records |
|---|---|---|
| Organization | Direction, governance, portfolio priorities, policy, risk appetite | Charter, policies, decisions, organization reports |
| Portfolio | Cross-project priorities, dependencies, capacity, outcomes | Portfolio roadmap, dependency and risk registers |
| Project/product | Scope, backlog, architecture, delivery, quality, acceptance | Project POC, requirements, epics, user stories, project status |
| Engineering/platform | Shared engineering practices, CI/CD, security, tooling, reusable assets | Standards, pipelines, platform documentation |
| Delivery/operations | Release, monitoring, support, incidents, recovery | Release records, runbooks, incident and operational reports |

## 2. Organization monitoring vs project execution

The organization workspace and this repository are for visibility, coordination, governance, analysis, and reporting. Implementation, testing, and DevOps execution occur in the relevant project context.

A status discussion or recommendation in an organization report is not authorization to change a project repository. Obtain explicit project-level authorization before making implementation changes.

## 3. Portfolio management cycle

1. Capture a business or user need.
2. Identify the accountable project and classify it as Personal or Professional.
3. Define outcomes, scope, exclusions, constraints, and stakeholders.
4. Decompose requirements into epics, sub-epics, user stories, tasks, and acceptance criteria.
5. Assess architecture, dependencies, privacy, security, cost, and operational impact.
6. Prioritize against capacity and risk.
7. Implement on the approved work branch.
8. Verify through review, tests, integration, and evidence.
9. Obtain acceptance and release authorization.
10. Monitor outcomes, incidents, support, and change requests.
11. Retire or archive with data and access handling.

## 4. Project autonomy and shared standards

Projects may choose architecture and delivery sequencing appropriate to their needs. Organization-wide standards define minimum controls for security, traceability, change management, branch use, evidence, and reporting. Exceptions require a documented decision with scope, rationale, risk, approver, and expiry/review date.

## 5. Cost principle

Default to zero-cost tools, services, infrastructure, and operating approaches until the owner explicitly approves a cost. Any paid option must include purpose, amount/currency, recurring vs one-time cost, alternatives, data/privacy implications, and exit plan.

## 6. Reporting cadence

Proposed cadence, pending owner approval:
- Weekly: project progress, blockers, next milestones, risks, and decisions needed.
- Monthly: portfolio health, dependency review, cost review, security/quality trends.
- Per release: readiness, test evidence, approvals, rollback and operational handover.
- On incident: timely incident record, impact, mitigation, root cause, and corrective actions.

## 7. Roles (role categories, not assigned people)

Potential role categories include Organization Owner, Portfolio Coordinator, Project/Product Owner, Technical/Architecture Lead, Engineering Lead, Security/Privacy Lead, Data Owner, QA/Release Lead, Platform/Operations Lead, and Business/Acceptance Owner. Named assignments, delegation, backups, and approval limits remain to be confirmed.

## 8. Escalation

Escalate immediately when there is a suspected security/privacy incident, unauthorized access, data loss, financial or legal exposure, production outage, unsafe automation, or a release that bypasses required approval. For ordinary delivery blockers, record impact, owner, due date, mitigation, and decision required.
