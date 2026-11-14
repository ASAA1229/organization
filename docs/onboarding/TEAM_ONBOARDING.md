# ASAA Team Member Onboarding Guide

## Welcome

This guide is the starting point for understanding ASAA, its governance, and its four current projects. Read it with the linked project repositories; this repository is the organization-level overview, not a substitute for project-specific technical documentation.

## 1. Understand the organization

Read in order:
1. [Organization Charter](../organization/CHARTER.md)
2. [Operating Model](../organization/OPERATING_MODEL.md)
3. [Governance](../governance/GOVERNANCE.md)
4. [Policy Index](../policies/POLICY_INDEX.md)
5. [Branching and Change Control](../policies/BRANCHING_AND_CHANGE_CONTROL.md)
6. [Security, Privacy and Data Policy](../policies/SECURITY_PRIVACY_AND_DATA_POLICY.md)

## 2. Understand the portfolio

Read the [Project Portfolio](../portfolio/PROJECT_PORTFOLIO.md), then the profile for the project you will join. Learn its purpose, users, scope, exclusions, architecture, epics, known gaps, and evidence requirements.

## 3. Work safely

- Ask for the project owner and your delegated responsibilities.
- Do not assume access to all projects or data.
- Use least privilege and approved credentials.
- Never commit secrets or copy restricted data into unapproved tools.
- Do not purchase services or create paid resources without approval.
- Do not deploy, merge, or release without explicit authorization.
- Do not change `dev` or `main` directly; routine work targets `new`.
- Link every change to a requirement, issue, or approved task.
- Record test results and limitations honestly.

## 4. How to report progress

A useful update contains:
- outcome delivered;
- requirement/story IDs addressed;
- branch/PR/commit;
- tests run and results;
- what remains;
- blockers and risks;
- decisions needed;
- next step and owner.

Use lifecycle states defined in the engineering standards. “Implemented” is not “tested”; “tested” is not “accepted”; “accepted” is not automatically “released”.

## 5. First 30 days (suggested)

### Days 1–5: Orientation
- Read organization charter, policies, and project scope.
- Meet the owner/project lead and confirm responsibilities.
- Obtain only required access and complete security orientation.

### Days 6–10: Product understanding
- Review current backlog, architecture, open decisions, risks, and dependencies.
- Inspect repository history and current branch workflow.
- Identify the source of truth for requirements and test evidence.

### Days 11–20: Supervised contribution
- Select a bounded, approved work item.
- Confirm acceptance criteria and dependencies.
- Work through a branch/PR targeting `new`.
- Add tests and documentation appropriate to the change.

### Days 21–30: Demonstrate ownership
- Deliver a reviewed contribution.
- Present evidence, limitations, and remaining risks.
- Agree on next responsibilities and development goals.

## 6. Questions to ask before starting work

- Who is the accountable project owner?
- Which requirement and acceptance criteria does this work satisfy?
- What data and environments may I access?
- Which branch should my PR target? (Routine target: `new`.)
- What checks and approvals are mandatory?
- Is this work allowed to incur cost or use an external provider?
- What evidence is needed to call it complete?
