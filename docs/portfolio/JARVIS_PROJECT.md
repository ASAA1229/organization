# Project Profile — JARVIS

**Repository:** https://github.com/ASAA1229/JARVIS  
**Product direction:** Personal AI assistant, developer assistant, and automation platform, with a longer-term personal AI operating-system vision.

## Purpose and target environment

Assist the owner with voice interaction, software development, desktop workflows, automation, and connected-device workflows. Initial device targets are an MSI Windows 11 laptop and two Android phones.

## Explicit product constraints and preferences

- Custom wake phrase: **“Hey Jarvis”**.
- Ready response: **“Hi sir, I am ready to work.”**
- Hybrid local/cloud architecture.
- Zero ongoing cost as the default constraint unless explicitly changed.
- No continuous cloud audio upload.
- Per-device sessions.
- QR pairing plus authenticator preference.
- High autonomy with safeguards and clear approval gates.
- Payment apps excluded from automation scope.
- Preserve existing implementation and continue incrementally; do not restart from fundamentals.

## Epic register (10 epics)

1. Core runtime and agent architecture
2. Workflow orchestration and DAG
3. Capability catalogue and safe tool execution
4. Windows desktop and developer automation
5. Android and per-device sessions
6. Voice, wake word and audio privacy
7. Local/cloud AI and provider integration
8. Security, trust and human approval
9. CI/CD, Jenkins and Nexus
10. Monitoring, audit, recovery and operations

## Candidate sub-epics (to validate)

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

Prior context reports substantial existing implementation and merged work related to DAG/CI, including PRs #61 and #65. This is not evidence that physical voice wake-up, Android workflows, all automation scenarios, user acceptance, or production operations are complete.

Jenkins/Nexus were previously noted as disabled or inactive. Re-enable only after credentials, infrastructure, security review, tests, rollback, and explicit approval are available.

## Next validation

Inventory the current code and merged PRs; map every epic to existing modules and tests; test on actual target devices; validate local/cloud routing and audio privacy; confirm safety boundaries; document provider cost and failure behavior; verify monitoring and recovery.
