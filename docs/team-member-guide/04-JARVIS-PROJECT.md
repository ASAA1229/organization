# 4. Project Guide — JARVIS

**Repository:** https://github.com/ASAA1229/JARVIS  
**Product direction:** Personal AI assistant, developer assistant, and automation platform, with a longer-term personal AI operating-system vision.

## Purpose and target environment
JARVIS assists with voice interaction, software development, desktop workflows, automation, and connected-device workflows. Initial target devices are an MSI Windows 11 laptop and two Android phones.

There is substantial prior work. Contributors must inspect and extend the existing implementation rather than restart from fundamentals or replace working architecture without an approved reason.

## Explicit behavior and constraints
- Wake phrase: **“Hey Jarvis”**.
- Ready response: **“Hi sir, I am ready to work.”**
- Hybrid local/cloud architecture.
- Zero ongoing cost by default unless the owner approves otherwise.
- No continuous cloud audio upload.
- Per-device sessions.
- QR pairing plus authenticator preference.
- High autonomy with safeguards and approval gates.
- Payment apps are excluded from automation scope.
- Preserve existing implementation and proceed incrementally.

## Capability areas
1. Core runtime, agent architecture, configuration, event handling, and state.
2. Workflow orchestration and DAG execution.
3. Capability catalogue, tool permissions, safe execution, and audit.
4. Windows desktop and developer automation.
5. Android enrollment, pairing, sessions, and device workflows.
6. Voice, local wake-word detection, audio capture, speech-to-text, and speech output.
7. Local/cloud AI provider selection, fallback, privacy, and cost controls.
8. Security, trust, risk tiers, confirmations, deny rules, and emergency stop.
9. CI/CD, Jenkins, Nexus, and artifact workflows.
10. Monitoring, diagnostics, audit, backup, recovery, and operations.

## Candidate epic register
1. Core runtime and agent architecture.
2. Workflow orchestration and DAG.
3. Capability catalogue and safe tool execution.
4. Windows desktop and developer automation.
5. Android and per-device sessions.
6. Voice, wake word, and audio privacy.
7. Local/cloud AI and provider integration.
8. Security, trust, and human approval.
9. CI/CD and artifact management (Jenkins/Nexus).
10. Monitoring, audit, recovery, and operations.

## Candidate sub-epics
- Runtime: process lifecycle, configuration, event bus, state, logging, graceful shutdown.
- Agent: system/user prompt schemas, task context, planning, tool selection, memory boundaries.
- Workflow: DAG schema, dependencies, scheduling, retries, timeout, cancellation, checkpoints.
- Tools: capability registry, permissions, sandboxing, allowlists, audit, result validation.
- Windows: application control, keyboard/mouse, files, terminal, IDE/editor, developer workflows.
- Android: device enrollment, pairing, notifications, commands, session isolation, offline behavior.
- Voice: local wake-word detection, capture indicator, speech-to-text, text-to-speech, interruption, privacy controls.
- AI providers: local model selection, cloud fallback, routing, key management, quotas, cost and privacy.
- Trust: risk tiers, confirmation prompts, deny rules, payment exclusion, emergency stop.
- CI/CD: Jenkins integration, Nexus/artifacts, pipeline triggers, credentials, approvals, rollback.
- Operations: health checks, audit trail, telemetry, backup, recovery, diagnostics, support.

## Existing work and evidence cautions
Prior context reports substantial implementation and merged work related to DAG/CI, including PRs #61 and #65. This is a lead for repository inspection, not proof of present completeness. Physical wake-word operation, both Android devices, all automation scenarios, UAT, and production operations must be verified separately.

Jenkins/Nexus were previously noted as disabled or inactive. Do not activate them until credentials, infrastructure, security review, tests, rollback, and explicit approval are available.

## Remaining validation and delivery work
Inventory modules, merged PRs, configuration, and tests; map requirements to code/evidence; validate wake-word behavior and local audio processing on the laptop; validate both Android devices, pairing, session isolation, reconnect, and recovery; verify local/cloud routing, provider failure, cost, and audio privacy; test risk-tier approvals, deny rules, emergency stop, and payment exclusion; confirm CI/artifact prerequisites; verify monitoring, audit, backup, restore, and support.

## Risks and first tasks
JARVIS can act on devices and systems. Incorrect or over-permissioned actions can cause data loss, privacy exposure, or operational harm. Use least privilege, visible action plans, confirmations for consequential actions, execution logs, safe cancellation, and a reliable stop mechanism.

Start with architecture and code inventory. Read agent/prompt schemas, workflow execution, tool permissions, voice pipeline, device pairing, and tests. Never bypass payment exclusion, approval gates, or audio privacy constraints. Do not enable external CI or paid AI services without approval.
