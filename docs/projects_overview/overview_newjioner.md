# ASAA Organization and Project Overview
## New Team Member Handbook

**Organization:** ASAA  
**GitHub organization:** https://github.com/ASAA1229  
**Canonical documentation repository:** https://github.com/ASAA1229/organization  
**Version:** 1.0  
**Prepared:** 14 November 2026  
**Audience:** New employees, collaborators, contractors, contributors and authorized stakeholders  
**Status:** Comprehensive onboarding baseline. Decisions marked pending remain pending until approved.

---

## 1. Welcome to ASAA

Welcome to ASAA. This handbook explains the organization, its operating model and policies, the four current projects, how they relate, how work is governed, and how new team members are expected to contribute.

ASAA is an evolving technology organization that builds, operates, governs and improves software products, reusable engineering capabilities, automation and technology services. Its four current projects are:

1. **ASAA** - organization governance and enterprise project integration platform.
2. **Portfolio** - multi-profile portfolio and professional presentation product.
3. **JARVIS** - personal AI assistant, developer assistant and automation platform.
4. **Templates** - internal reusable software-template and development platform.

The organization repository is the central reference for organization descriptions, policies, decisions, reports, project summaries and onboarding. Each product's own repository remains the authoritative place for its implementation, project-specific requirements, tests, issues and release evidence.

This handbook is designed to answer ordinary orientation questions. It does not invent legal, commercial, staffing, security or product decisions that have not been approved. Those items are identified as open.

## 2. Organization identity, purpose and direction

### 2.1 Identity

- Organization name: **ASAA**
- GitHub organization: **ASAA1229**
- Organization repository: https://github.com/ASAA1229/organization
- Current project repositories:
  - https://github.com/ASAA1229/ASAA
  - https://github.com/ASAA1229/Portfolio
  - https://github.com/ASAA1229/JARVIS
  - https://github.com/ASAA1229/Templates

Use ASAA as the current organization identity. Do not introduce a former organization or company name into new documentation unless the owner explicitly reintroduces it.

### 2.2 Purpose

ASAA aims to build, operate, govern and continuously improve useful software products and technology services. Its direction combines:
- A clear organization and governance model.
- Independently manageable products with clear ownership and scope.
- Reusable engineering practices, templates and assets.
- AI-assisted development and automation with privacy and human-approval safeguards.
- Traceable requirements, decisions, risks, delivery evidence and project status.
- Professional delivery practices and sustainable growth.
- Cost-aware engineering without sacrificing security, quality or maintainability.

### 2.3 Vision, mission and values

**Vision:** Build an adaptable technology organization where projects can be planned, delivered, monitored, reused, secured and improved through consistent governance and shared capabilities, without forcing every product into one architecture or release cycle.

**Mission:** Deliver reliable software and digital experiences; reduce repeated engineering effort; use AI and automation responsibly; make progress and risks visible; and distinguish planning, implementation, testing, acceptance and release.

**Values:** Trust, accountability, transparency, security and privacy by design, evidence over assumption, explicit ownership and approval, reuse without unnecessary coupling, incremental delivery, cost awareness, human oversight, accessibility, usability, operational readiness and no silent scope expansion.

## 3. Organization structure and operating model

ASAA uses five operating layers:

1. **Organization:** direction, governance, policies, portfolio priorities, risk appetite and organization-level reporting.
2. **Portfolio:** cross-project priorities, capacity, dependencies, outcomes and risks.
3. **Project/product:** scope, requirements, architecture, backlog, delivery, quality, acceptance and release.
4. **Engineering/platform:** shared engineering standards, CI/CD practices, security, tooling and reusable assets.
5. **Delivery/operations:** deployment, monitoring, support, incident handling, backup, recovery and operational handover.

### 3.1 How decisions and work flow

A normal work item moves through this lifecycle:

1. Capture a business, user, operational or technical need.
2. Identify the accountable project and stakeholders.
3. Record project classification, intended outcome, scope and exclusions.
4. Define requirements and acceptance criteria.
5. Decompose work into epics, sub-epics, features, user stories and tasks as appropriate.
6. Identify dependencies, security/privacy concerns, data impact, cost and operational risks.
7. Prioritize and obtain authorization.
8. Implement on the correct branch.
9. Review, test and collect evidence.
10. Obtain acceptance and explicit release authorization where applicable.
11. Monitor the result, record issues and improve it.

### 3.2 Organization coordination versus project execution

The organization repository is for coordination, governance, documentation, portfolio monitoring and reports. Implementation, testing and DevOps execution belong in the relevant project context.

A status report, recommendation, approved planning baseline or onboarding document is not permission to change source code, deploy, merge, buy services or access sensitive data. Obtain explicit authorization for the specific work and project.

### 3.3 Organization roles

Potential role categories include Organization Owner, Portfolio Coordinator, Project/Product Owner, Technical or Architecture Lead, Engineering Lead, Security/Privacy Lead, Data Owner, QA/Release Lead, Platform/Operations Lead and Business/Acceptance Owner.

The final organization chart, named role holders, reporting lines, delegated authority, backups and approval limits have not yet been fully ratified. Use the reporting and approval contact explicitly provided during onboarding; do not assume a title grants authority.

## 4. Four-project ecosystem at a glance

| Project | Primary purpose | Main users | Repository |
|---|---|---|---|
| ASAA | Organization/project integration and governance platform; broader operations boundary pending | Owner, administrators, managers, project owners, technical leads and authorized stakeholders | ASAA1229/ASAA |
| Portfolio | Multi-profile portfolio and presentation product | Visitors, profile owners and authorized content administrators | ASAA1229/Portfolio |
| JARVIS | Personal AI, developer assistance and controlled automation | Primarily the owner; authorized device and workflow users as defined | ASAA1229/JARVIS |
| Templates | Internal reusable templates and development platform | ASAA employees, management and authorized developers/designers | ASAA1229/Templates |

These products have different purposes. A shared organization does not mean they must share a database, runtime, credentials, deployment environment or unrestricted user data. Integration must be intentional, documented and authorized.

---

# PART I - PROJECT DETAILS

## 5. Project 1: ASAA

**Repository:** https://github.com/ASAA1229/ASAA  
**Working product description:** Enterprise Project Integration Platform  
**Status:** Product boundary and current implementation maturity require validation against the live repository and evidence.

### 5.1 Purpose and problem

The ASAA software project is intended to provide an organization-level platform for registering and understanding projects and repositories, reviewing branches and documentation, tracking requirements and dependencies, collecting implementation evidence, and producing portfolio summaries and gap reports.

As an organization grows, project information becomes fragmented across repositories, documents, issues, branches, teams and tools. It becomes difficult to determine what exists, who owns it, what is implemented or tested, which requirements are covered, what risks exist and what evidence supports a status claim. The platform should make this information consistent, traceable and actionable.

A broader organizational vision has also discussed workforce, HR, onboarding, payroll, leave, finance, procurement, suppliers, customers and commercial operations. It is not yet confirmed whether every capability belongs inside this ASAA product, should be a separate product/module, or should remain an organizational process. Do not silently treat the entire broad operations vision as approved product scope.

### 5.2 Intended users

- Organization owner and administrators.
- Managers and portfolio coordinators.
- Project and product owners.
- Technical leads and engineering contributors.
- QA, release and operations personnel.
- Auditors, reviewers and authorized business stakeholders.

Exact role names, permission boundaries and approval authority require formal confirmation.

### 5.3 Capability and scope map

The current candidate capability register contains:

1. **Governance and organization administration:** organization profile, divisions, teams, roles, policies, approval matrix and settings.
2. **Identity and access:** authentication, MFA, session management, role/attribute-based access, provisioning and deprovisioning.
3. **People and workforce lifecycle:** people directory, onboarding, offboarding, role changes, skills and access reviews.
4. **Payroll, time, leave and expenses:** time capture, leave workflows, expense claims, payroll review and integrations.
5. **Supplier, procurement and accounts payable:** supplier onboarding, purchase requests, approvals, invoices and reconciliation.
6. **Customer, commercial and accounts receivable:** customer records, proposals, contracts, billing, collections and support obligations.
7. **Project and service delivery:** project registry, POC, requirements, epics, dependencies, milestones, status, evidence and acceptance.
8. **Analytics and reporting:** portfolio dashboards, delivery metrics, risk trends, cost views and audit exports.
9. **Security, privacy and audit:** policy controls, audit events, incident workflow, privacy requests and evidence retention.
10. **CI/CD, release and operations:** repository integration, pipeline status, deployment records, environment inventory and monitoring.
11. **Backup, recovery and continuity:** backup policy, restore tests, recovery objectives and continuity runbooks.
12. **Shared ecosystem and data integration:** API contracts, events, identity integration, data ownership, connectors and synchronization.

**Scope caution:** Items 3-6 are broad capability candidates and require a product-boundary decision. Do not silently treat them as approved implementation scope.

### 5.4 Expected outputs

- Reliable organization, project and repository registry.
- Traceable requirements and delivery structures.
- Cross-project dashboards and reports.
- Clear status definitions and evidence links.
- Dependency, risk and decision registers.
- Controlled access and auditability.
- Approved integration points with other ASAA systems.
- Operational and release visibility.

### 5.5 Architecture and technology

Historical project documentation described a web UI/API and PostgreSQL-backed data direction, including React/Vite and FastAPI/SQLAlchemy. This is historical context, not verified current architecture. Inspect the current repository, active branches, package manifests, migrations, APIs and deployment configuration before making implementation claims or changes.

### 5.6 Work remaining and validation

The following areas must be assessed and tracked. This is not a claim that none has been built; actual state must be evidenced:

- Confirm product boundary, especially HR, payroll, finance, procurement, vendor and customer operations.
- Inventory current modules, APIs, schemas, migrations, UI screens and integrations.
- Reconcile requirements to approved epics, stories, acceptance criteria and tests.
- Verify authentication, authorization, role separation and audit controls.
- Verify data protection, retention, backup and restore.
- Re-run build, unit, integration, E2E and security checks.
- Verify production database, hosting, provider activation and environment configuration.
- Complete user acceptance testing and independent assurance as required.
- Define and test recovery objectives, live monitoring, incident handling and rollback.
- Record operational ownership and release evidence.

A prior assessment reported local API/UI/E2E/security/database evidence but a production NO-GO decision. Provider activation, production database/hosting, UAT, independent assurance, recovery objectives, live monitoring and release readiness were among the gates. This is historical and must be revalidated before being used as today's status.

### 5.7 Guidance for a new contributor

Read the ASAA repository README, POC, requirements, architecture, status and open issues. Confirm the exact assigned module and acceptance criteria. Do not expand the product into every organization capability without a recorded decision. Protect sensitive workforce, financial, customer and supplier data with least privilege and approved environments.

---

## 6. Project 2: Portfolio

**Repository:** https://github.com/ASAA1229/Portfolio  
**Product type:** Multi-profile portfolio and presentation experience  
**Status:** Design direction and feature scope are recorded; current completion, testing and publishing state require revalidation.

### 6.1 Purpose

Portfolio is a presentation product that showcases profile-specific skills, projects, experience, certifications, education, contact information and AI-assisted introductions through a polished, cinematic interface.

It is designed as a multi-profile experience rather than four unrelated websites. The data model and administration approach should support consistent management while preserving each profile's identity, permissions and content boundaries.

### 6.2 Profiles in scope

1. **Abhishek**
2. **Amulya (Ammu)**
3. **Anjini (Bava)**
4. **Sai (Darling)**

Profile content must be accurate and authorized by the relevant profile owner. Consent, visibility and ownership must be respected, especially for resumes, personal images, contact details and AI-generated representations.

### 6.3 Intended users

- Public visitors viewing a portfolio.
- Individual profile owners reviewing their own information.
- Authorized administrators/content managers maintaining content and media.
- Organization owner responsible for product governance.

The public visitor experience must be separated from administrative capabilities. Profile-specific access and edit permissions must be verified.

### 6.4 Experience and design direction

The remembered design direction is a dark, streaming-service-inspired interface with a cinematic presentation. Historical design tokens include dark backgrounds such as #141414 and #18181b, with a red accent such as #E50914.

The planned experience includes profile selection and navigation for Home, Skills, Projects, Experience, Certifications, Education, Contact and AI Intro. These are design requirements, not proof that every page or interaction is complete.

### 6.5 Capability and scope map

1. **Profile architecture:** four profile records, profile routing, profile-specific content and reusable components.
2. **Presentation UI:** responsive layout, navigation, visual consistency, loading/empty/error states and accessibility.
3. **Career content:** skills, projects, experience, certifications, education and contact sections.
4. **Resume/document management:** authorized upload, validation, versioning, download, replacement and privacy.
5. **Image and media management:** upload, validation, storage, galleries, ordering, optimization and deletion.
6. **AI introduction and chat:** provider integration, prompt/context management, safe responses, key handling, usage limits and fallback.
7. **Shared data layer:** consistent profile content management without mixing private data or permissions.
8. **Quality and publishing:** security, performance, accessibility, browser/device testing, hosting, domain, analytics and release support.

### 6.6 Expected outputs

- Four coherent profile experiences.
- Consistent and maintainable visual system.
- Profile-specific career and project content.
- Secure resume and media administration.
- AI-assisted introduction experience with clear limits.
- Responsive, accessible visitor experience.
- Reliable publishing and content-update workflow.

### 6.7 Work remaining and validation

- Verify current source branch, framework, dependencies and deployment configuration.
- Verify profile schema, profile routing and data separation.
- Confirm content accuracy, consent and rights for all four profiles.
- Verify admin authentication, authorization and audit trail.
- Test resume/media upload validation, storage, access, retention and deletion.
- Verify AI provider selection, key storage, rate/cost controls and privacy behavior.
- Complete responsive, accessibility, performance and browser/device testing.
- Validate error states, loading states and content publishing.
- Obtain profile-owner acceptance and release approval.

Historical context indicates development activity and a period when testing/validation was paused. Source code existing does not mean a feature is tested, accepted or operational. Recheck the live repository and deployment.

### 6.8 Guidance for a new contributor

Understand the shared profile architecture before changing a profile-specific feature. Do not hardcode one profile's content into shared components. Protect personal information and resume/media assets. Do not expose admin operations to public visitors. Obtain the relevant profile owner's approval for content changes.

---

## 7. Project 3: JARVIS

**Repository:** https://github.com/ASAA1229/JARVIS  
**Product type:** Personal AI assistant, developer assistant and automation platform  
**Long-term direction:** Personal AI operating-system-style environment  
**Status:** Significant existing work has been reported; continue from current implementation and verify feature-by-feature rather than restarting from basics.

### 7.1 Purpose

JARVIS is intended to help its owner interact with an AI assistant, perform development tasks, automate desktop workflows, coordinate device interactions and orchestrate approved tools and workflows.

It is a long-term platform direction. Build incrementally with reliable runtime behavior, explicit permissions, privacy protections and safeguards for consequential actions.

### 7.2 Initial target environment

- One MSI laptop running Windows 11.
- Two Android phones.
- Desktop and developer workflows first, with device-aware expansion.
- Local and cloud AI capabilities in a hybrid design.

### 7.3 Explicit product requirements and constraints

- Wake phrase: **"Hey Jarvis"**.
- Ready response: **"Hi sir, I am ready to work."**
- Hybrid local/cloud architecture.
- Zero ongoing cost is the default unless explicitly changed.
- No continuous cloud audio upload.
- Per-device sessions.
- QR pairing plus authenticator preference.
- High autonomy with safeguards and human approval gates.
- Payment applications are excluded from automation scope.
- Preserve existing implementation and progress incrementally.
- Do not restart from fundamentals merely because a new contributor joins.

Any proposed change that weakens these constraints requires explicit owner review.

### 7.4 Capability and scope map

1. **Core runtime and agent architecture:** process lifecycle, configuration, event bus, state, logging and graceful shutdown.
2. **Agent behavior:** system/user prompt schemas, task context, planning, tool selection and memory boundaries.
3. **Workflow orchestration:** DAG definitions, dependencies, scheduling, retries, timeouts, cancellation and checkpoints.
4. **Capability/tool execution:** capability registry, permissions, sandboxing, allowlists, audit and result validation.
5. **Windows desktop automation:** application control, keyboard/mouse, files, terminal, IDE/editor and developer workflows.
6. **Android and device sessions:** device enrollment, QR pairing, authenticator flow, notifications, commands, session isolation and offline behavior.
7. **Voice and audio privacy:** local wake-word detection, capture indicators, speech-to-text, text-to-speech, interruption and privacy controls.
8. **AI providers:** local model selection, cloud fallback, routing, secret management, quotas, cost and privacy controls.
9. **Trust and safety:** risk tiers, confirmations, deny rules, payment-app exclusion, emergency stop and audit.
10. **CI/CD and artifacts:** Jenkins integration, Nexus/artifact handling, pipeline triggers, credentials, approvals and rollback.
11. **Monitoring and operations:** health checks, audit trail, telemetry, backup, recovery, diagnostics and support.

### 7.5 Expected outputs

- Reliable assistant runtime and conversation/task handling.
- Reusable workflow orchestration and tool capabilities.
- Controlled Windows desktop and developer automation.
- Secure device pairing and per-device session management.
- Private and predictable voice interaction.
- Local-first or hybrid AI routing consistent with privacy and cost constraints.
- Approval gates for risky actions.
- Traceable automation logs, monitoring and recovery.

### 7.6 Existing work and work remaining

Prior project context reports substantial existing implementation and merged work related to DAG/CI, including PRs #61 and #65. This is a pointer for repository review, not proof that every dependent feature is complete.

Required verification and remaining work include:
- Inventory current modules, workflows, prompts, tool registry and merged changes.
- Map existing implementation to approved epics and acceptance criteria.
- Verify actual wake-word operation on the target Windows laptop.
- Test both Android devices, pairing, session isolation and recovery.
- Validate audio capture indicators and no-continuous-cloud-audio-upload constraint.
- Verify local/cloud routing, provider failures, secret handling and cost behavior.
- Test each automation capability in a controlled environment.
- Verify payment-app exclusion and approvals for high-risk actions.
- Verify audit logs, emergency stop, monitoring, backup and recovery.
- Validate CI/CD and artifact integrations before enabling them.

Jenkins/Nexus were previously described as disabled or inactive. Do not enable them until credentials, infrastructure, security review, tests, rollback and explicit approval are in place.

### 7.7 Safety boundaries

JARVIS can interact with devices and tools, so its permissions must be narrower than the user's total system permissions wherever possible. Actions should be classified by risk. Irreversible, financial, security-sensitive or externally consequential actions require explicit approval or must be denied. Payment apps remain excluded. Secrets must never be exposed in prompts, logs or repositories.

### 7.8 Guidance for a new contributor

Start with a code and test inventory. Understand current agent/runtime and workflow design before proposing replacements. Preserve working behavior and established safety constraints. Test device-dependent functionality on actual target devices. Do not activate cloud services, paid providers, Jenkins/Nexus or high-impact automation without authorization.

---

## 8. Project 4: Templates

**Repository:** https://github.com/ASAA1229/Templates  
**Product type:** Internal reusable software-template and development platform  
**Primary audience:** ASAA employees, management and authorized contributors  
**Status:** The owner reports that the basic platform is built. Feature-level implementation, test, security and acceptance evidence must be revalidated.

### 8.1 Purpose

Templates is intended to reduce software delivery time and improve consistency by allowing authorized team members to discover, configure, create, test, version, reuse and distribute software templates and engineering assets.

It should support different kinds of software and different sectors rather than being limited to one website-template category. The platform is intended to serve internal teams first. External agencies, businesses or customers are possible future audiences, not current default access.

### 8.2 Intended users

- Organization management and platform administrators.
- Internal employees and developers.
- UI/UX designers and engineering teams.
- Authorized project teams that need reusable templates.
- Reviewers responsible for template quality and publication.

Access is intended to be employee/management-only. External access must not be enabled by assumption.

### 8.3 Technology direction

Current chosen direction:
- Frontend: React, Vite, TypeScript and JavaScript.
- Backend: Node.js and Express.
- Database: PostgreSQL with Prisma.
- UI: Tailwind CSS and shadcn/ui.
- Architecture: modular monolith direction.

Verify package manifests, runtime versions, migrations, environment configuration and actual source before treating every technology as deployed/current.

### 8.4 Capability and scope map

1. **Platform foundation:** workspace packages/contracts, API, web app, database, migrations, configuration and error handling.
2. **Internal access and governance:** employee/management access, roles, approvals, audit and account lifecycle.
3. **Taxonomy and discovery:** websites, web apps, e-commerce, mobile, desktop, backend/API, enterprise, UI systems, DevOps, AI/data and sector categories; support hybrid sectors and custom divisions.
4. **Template catalog and lifecycle:** metadata, previews, demo templates, ownership, compatibility, draft/review/published/retired lifecycle.
5. **Visual builder and source configuration:** visual editing, advanced configuration, source access, validation and preview.
6. **Workspaces and collaboration:** project creation, version history, branching, collaboration and conflict handling.
7. **AI-assisted creation:** safe scaffolding, context management, review, usage limits and cost/privacy controls.
8. **Distribution and delivery:** ZIP downloads, GitHub repositories, online workspaces and deployment pathways.
9. **QA, security and documentation:** automated validation, isolated build/test, dependency checks, secret scanning and documentation.
10. **Offline Linux/AIX environment snapshot:** offline environment inventory, TXT/JSON reports and CMM ICG/ACQ/ISS context, with no network requirement.
11. **Operations, assets and connectors:** monitoring, asset library, connector registry, audit, backup and support.

### 8.5 Template lifecycle and access principles

- Employees may request access; an administrator approves access.
- Sharing can be individual, team or organization-wide according to permissions.
- Employee-created templates can remain drafts until reviewed and published by an authorized reviewer.
- Certification/validation should use automated checks and isolated build/test, followed by manual approval.
- Predefined and custom compatible stacks should be supported.
- Build environments may be local, server-based or browser-based as approved.
- ZIP export, GitHub integration, online workspaces and deployment should have explicit permission and audit trails.

### 8.6 AI and JARVIS relationship

Templates may include limited JARVIS-related capabilities such as AI assistance, agents, chatbots or monitoring bots. These are mini-features/integrations, not a reason to embed the entire personal JARVIS system into Templates. Each integration must have a defined interface, permissions, data scope and cost/privacy policy.

### 8.7 Offline environment snapshot feature

This feature is intended to capture Linux/AIX environment information without requiring network connectivity. It should:
- Operate offline.
- Produce TXT and JSON reports.
- Support the relevant CMM ICG/ACQ/ISS context.
- Document collection profiles, data fields, limitations and execution prerequisites.
- Avoid sending collected environment data to external services.
- Include validation and safe handling of potentially sensitive system details.

### 8.8 Work remaining and validation

- Run current repository inventory and verify the actual running application.
- Verify build, unit/integration tests, migrations and runtime behavior.
- Confirm employee/management-only access and the role/approval matrix.
- Validate catalog taxonomy, demo templates and template lifecycle.
- Verify visual editor, advanced configuration and source editing.
- Verify versioning, collaboration and conflict handling.
- Verify ZIP export, GitHub integration, workspace provisioning and deployment paths.
- Verify isolated build/test, security scanning and manual publication approval.
- Validate AI/JARVIS mini-feature boundaries, secrets, privacy and cost controls.
- Test offline Linux/AIX environment snapshot behavior and TXT/JSON outputs.
- Verify monitoring, backup, audit and support processes.

Historical local development context includes workspaces named @asaa/contracts, @asaa/api and @asaa/web, with the API using tsx watch and the web app using Vite. A prior Vite port 5173 conflict was recorded and later the dev server reported ready on 127.0.0.1. These are historical troubleshooting notes, not evidence of current runtime health.

### 8.9 Guidance for a new contributor

Understand the existing platform before adding another template category or builder workflow. Preserve internal-only access. Use the approved template lifecycle. Do not publish templates, connect external services, deploy generated applications or incur costs without required approval.

---

# PART II - SHARED POLICIES AND HOW TO WORK

## 9. Repository and branch standards

The organization-wide standard branch names are:

| Branch | Purpose |
|---|---|
| main | Production/release line |
| dev | Integration line |
| new | Routine feature and planned change work |
| fix | Focused defect correction |
| test | Testing and validation |

Routine work targets new. Do not use main or dev as routine work branches. Promotion from new to dev, and from dev to main, requires a separately reviewed and explicitly authorized pull request.

This is the documented policy. It does not prove GitHub branch protection or rulesets are enabled in every repository. Verify actual repository settings. Do not bypass required review or protection.

## 10. Change authorization and approvals

Before changing a project:
1. Confirm the project, requested outcome and scope.
2. Obtain explicit authorization from the appropriate owner.
3. Read current project documentation and inspect repository state.
4. Identify dependencies, security/privacy impact, data sensitivity, cost and rollback impact.
5. Use the correct branch and follow the contribution process.
6. Keep changes focused and reviewable.
7. Run relevant checks and record evidence.
8. Obtain approval before merging, promoting, deploying, releasing or publishing.

A planning discussion, recommendation, status report or approved requirements baseline does not automatically authorize implementation, testing, repository changes, paid subscriptions, external-provider activation, production deployment, merge, release, personal-data publication or consequential automation.

## 11. Cost and procurement principle

Zero ongoing cost is the default constraint until the owner explicitly changes it. Before proposing any paid tool, AI provider, hosting, infrastructure or subscription, document:
- Business/technical purpose.
- One-time and recurring cost, currency and expected usage.
- Free or lower-cost alternatives.
- Data, privacy and security implications.
- Limits, renewal terms and exit plan.

Do not activate a paid service or incur a cost without explicit approval.

## 12. Requirements, backlog and traceability

The Master Requirements Baseline v1.0 was approved on 14 November 2026 as a planning and governance baseline only. It does not authorize implementation, testing, repository changes, deployment, paid services, merges or releases.

The discovery program is recorded as five rounds, 50 sets and 1,000 questions, followed by 12 consolidation stages at framework/planning level. Exact question-level reconciliation and traceability remain open.

Use this work-item hierarchy where appropriate:

**Organization / Project -> Epic -> Sub-epic -> Feature -> User Story -> Tasks -> Acceptance Criteria -> Dependencies -> Status -> Evidence**

Every meaningful work item should identify its owner, priority, scope, dependencies, acceptance criteria, test approach, status and evidence. Candidate epic or sub-epic lists in project profiles are planning structures and must be validated before being treated as approved implementation backlog.

## 13. Work status definitions

Use explicit lifecycle states. Do not collapse all progress into "done".

- **Not assessed:** no reliable assessment has been performed.
- **Planned:** accepted for planning, not started.
- **Ready:** scope, owner, acceptance criteria and dependencies are sufficiently clear.
- **In development:** implementation is underway.
- **Implemented-unverified:** code/configuration exists but required verification is incomplete.
- **Testing:** verification is underway.
- **Tested:** defined tests passed in the stated environment and scope.
- **Integration in progress:** integration work is underway.
- **Integrated:** required integration has been verified.
- **Partially complete:** some acceptance criteria are met and others remain.
- **Blocked:** progress depends on a recorded blocker or decision.
- **Accepted:** authorized stakeholder has accepted the result.
- **Released/operational:** deployed or made available with operational evidence.
- **Deprecated:** no longer supported or intended for use.

Evidence should identify the commit/build, environment, test or review performed, result, date, scope and limitations. Code existing does not mean tested; tested does not mean accepted; accepted does not automatically mean released.

## 14. Definition of Ready and Definition of Done

### Definition of Ready

A work item should have:
- Clear problem and intended outcome.
- Project and stakeholders identified.
- Scope and exclusions.
- Acceptance criteria.
- Dependencies, assumptions and risks.
- Data, security and privacy impact.
- Cost impact.
- Technical approach where needed.
- Owner and approval path.
- Verification approach.

If critical details are missing, mark the work item clarification required instead of guessing.

### Definition of Done

A work item is done only when:
- Acceptance criteria are met.
- Code, configuration and documentation are reviewed.
- Relevant tests pass.
- Security and privacy checks are completed.
- Required integration is verified.
- Evidence is linked to the commit/build and environment.
- Limitations are documented.
- The authorized acceptance owner accepts the result.
- Release/operational requirements are satisfied if release is intended.

## 15. Security, privacy and data handling

All team members must:
- Use least-privilege access.
- Never commit passwords, API keys, tokens, private certificates or other secrets.
- Use approved environments and approved data only.
- Avoid copying employee, profile, client, device or business data into unapproved systems.
- Treat uploads, generated code, templates and external inputs as untrusted.
- Avoid exposing sensitive information in logs, prompts, screenshots or reports.
- Protect personal and client information according to approved purpose and access rules.
- Report suspected exposure, unauthorized access, data loss or unsafe behavior immediately.

Project-specific reminders:
- ASAA: protect workforce, financial, supplier, customer and organization records.
- Portfolio: protect profile consent, personal data, resumes and media.
- JARVIS: preserve audio privacy, device isolation, payment-app exclusion and approval gates.
- Templates: enforce internal access, isolated validation and safe handling of generated source and secrets.

## 16. Project classification and commercial treatment

ASAA uses two conceptual project categories:

- **Personal:** only when the owner explicitly labels the project personal. Such work is unpaid and limited to close friends or family.
- **Professional:** the default for all other work, including work not explicitly classified as personal. Treat it as paid/commercial unless a specific exception is approved.

Do not infer that a project is personal based on who benefits from it. Record classification and any approved exception.

## 17. Communication and reporting expectations

A useful work update should state:
- What changed.
- What was verified and how.
- What remains.
- Blockers and risks.
- Decisions needed.
- Next action and owner.

Clearly distinguish verified facts, owner-reported context, assumptions, proposals and unknowns. Never report historical status as current without revalidation.

Weekly project updates and monthly portfolio reviews have been proposed, but the reporting cadence is pending owner approval. Maintain release-readiness and incident reports when those events occur.

## 18. Incident and escalation expectations

Escalate immediately if you suspect:
- Security or privacy incident.
- Unauthorized access or credential exposure.
- Data loss or corruption.
- Financial or legal exposure.
- Production outage.
- Unsafe or unauthorized automation.
- Release or deployment bypassing required approval.

For ordinary blockers, record impact, owner, due date, mitigation and the decision required.

## 19. New team member onboarding path

### Before receiving access

- Confirm your role, project assignment, reporting line and approver.
- Complete required confidentiality, security and policy onboarding.
- Receive only minimum repository, system and environment access required.
- Understand how to report incidents and urgent blockers.
- Confirm whether you may view production or sensitive data; do not assume access.

### First working days

- Read this handbook.
- Read the organization charter, operating model and policy index.
- Read your assigned project's README, POC, requirements, architecture, status and open issues.
- Review branch and change-control policy.
- Set up the development environment using project instructions.
- Run existing checks without changing unrelated code.
- Identify project owner, technical reviewer, dependencies and test commands.

### Before the first change

- Confirm the work item and acceptance criteria.
- Confirm explicit authorization and correct branch.
- Review secrets, data, privacy, security and cost implications.
- Record baseline behavior and relevant tests.
- Make a small, reviewable change.
- Report test results and link evidence.
- Do not merge or deploy unless explicitly authorized.

### Ongoing expectations

- Keep project documentation and status evidence current when authorized.
- Ask early when scope or acceptance criteria are unclear.
- Share knowledge and document decisions.
- Avoid unnecessary duplication and cross-project coupling.
- Never purchase, publish, merge, deploy, enable external services or perform high-impact actions without approval.

## 20. Future projects, repositories and organization growth

ASAA is expected to grow. This handbook is a living document, not a one-time description of only four projects.

When a new project or repository is introduced:

1. Register the project in the organization portfolio.
2. Assign a unique project name, purpose, owner and repository.
3. Classify it as Personal or Professional using the explicit rule in this handbook.
4. Define users, business problem, outcomes, scope and exclusions.
5. Identify whether it is an independent product, shared platform capability, internal tool or client engagement.
6. Define architecture, data ownership, integrations and security boundaries.
7. Record technology direction without assuming every project must use the same stack.
8. Create a project profile with purpose, scope, users, capabilities, epics, risks, dependencies, status and remaining work.
9. Apply the standard branch names: main, dev, new, fix and test.
10. Define requirements, acceptance criteria, test approach and evidence expectations.
11. Confirm cost, hosting, provider and operational requirements before activation.
12. Add the project to this overview and the portfolio register.
13. Update architecture, risks, dependencies, decisions and reports where affected.
14. Provide a project-specific onboarding guide before assigning contributors.

### 20.1 Recommended project profile template

Every future project should be described using:
- Project name and short description.
- Repository URL and canonical documentation.
- Product owner and technical owner.
- Purpose and problem statement.
- Intended users and stakeholders.
- Business outcomes and success measures.
- In-scope and out-of-scope capabilities.
- Functional and non-functional requirements.
- Architecture and technology direction.
- Data classification and ownership.
- Security, privacy and compliance considerations.
- Integrations and dependencies.
- Epic and sub-epic register.
- Current implementation state with evidence.
- Testing, acceptance and release state.
- Remaining work and known blockers.
- Risks and mitigations.
- Cost and operational model.
- Contribution instructions and first tasks.
- Open decisions and validation items.

### 20.2 Repository organization

Use the ASAA1229 GitHub organization as the canonical home for organization projects. Give each project a clear repository and avoid duplicate repositories without an ownership and migration decision. Cross-project shared code should have a clear owner and versioning/integration strategy.

## 21. Current organization-level open decisions

The following are deliberately not invented and must be confirmed by the organization owner or appropriate authority:

- Legal entity, jurisdiction, registration status and formal company structure.
- Final organization chart, named role holders, reporting lines and approval limits.
- External-facing mission, vision and service descriptions.
- Commercial terms, contracting, invoicing, tax, client acceptance and support policies.
- Policy owners, formal ratification, effective dates and review periods.
- Data classification, retention, deletion and privacy-request procedures.
- Incident severity, response targets and notification requirements.
- Final product boundary for HR, payroll, finance, procurement, supplier and customer capabilities in ASAA.
- Current implementation, test, deployment and acceptance evidence for all four projects.
- Branch protection and ruleset enforcement across repositories.
- Exact reconciliation of the 1,000 discovery questions into approved, traceable requirements.
- Named owners and measurable acceptance criteria for approved work.
- Shared identity, API, event, secrets, monitoring, artifact and backup architecture decisions.
- Reporting cadence and organization KPIs.

If an open item materially affects your assigned task, pause and ask the owner. Do not fill the gap with an assumption.

## 22. Canonical organization documentation map

Use this repository as the organization-level starting point:

- README.md - entry point and document map.
- docs/organization/CHARTER.md - identity, purpose, principles and boundaries.
- docs/organization/OPERATING_MODEL.md - operating layers, portfolio lifecycle and roles.
- docs/governance/GOVERNANCE.md - governance and decision approach.
- docs/policies/POLICY_INDEX.md - policy directory.
- docs/policies/BRANCHING_AND_CHANGE_CONTROL.md - branch and change rules.
- docs/policies/SECURITY_PRIVACY_AND_DATA_POLICY.md - security and data principles.
- docs/engineering/ENGINEERING_STANDARDS.md - engineering lifecycle and quality standards.
- docs/requirements/MASTER_REQUIREMENTS_BASELINE.md - approved planning baseline.
- docs/portfolio/ - project profiles.
- docs/architecture/ECOSYSTEM_ARCHITECTURE.md - cross-project architecture principles.
- docs/team-member-guide/ - detailed topic-based team guide.
- reports/ - organization status, decisions, risks, dependencies and validation registers.
- docs/projects_overview/overview_newjioner.md - consolidated overview for new team members.
- docs/projects_overview/overview_newjioner.doc - Word-compatible version of this overview.

Project-specific repositories remain authoritative for current source code, tests, issues, project POC, implementation status and release evidence.

## 23. Final message to every new team member

You are joining an organization with four distinct but related technology projects and a growing set of shared standards. Learn the purpose and boundaries of the project you are assigned to, preserve existing work, communicate clearly, protect data and credentials, and make progress verifiable.

You are encouraged to identify gaps, suggest improvements and ask questions. The expectation is not that every policy or product decision is already complete. The expectation is that unknowns are visible, decisions are recorded, and no one silently converts an assumption into an approved requirement.

**Welcome to ASAA.**

---

**Document maintenance:** The organization owner or explicitly delegated documentation owner should update this handbook when projects, repositories, scope, policies, architecture, owners or status materially change. Update the Markdown and Word-compatible copies together. Record the change date and summarize significant changes in the repository decision/change history.
