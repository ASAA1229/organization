# Security, Privacy and Data Governance Policy

**Status:** Baseline principles; detailed project-specific controls and legal requirements need validation.

## 1. Core principles

- Least privilege and need-to-know access
- Secure defaults and defense in depth
- Data minimization and purpose limitation
- Encryption in transit and at rest where applicable
- Secret management; never commit credentials, tokens, private keys, or personal secrets
- Auditability for privileged and consequential actions
- Separation of development, test, and production data
- Secure dependency and supply-chain management
- Defined retention, deletion, backup, and recovery practices
- Privacy review before introducing new personal or sensitive data processing

## 2. Data classification (proposed common taxonomy)

| Class | Examples | Handling |
|---|---|---|
| Public | Approved public marketing or documentation | May be published after review |
| Internal | Non-public operational documentation | Organization access only |
| Confidential | Client data, business plans, non-public project data | Restricted role-based access |
| Restricted | Credentials, sensitive personal data, security incident details | Strong access controls, minimized copies, audited handling |

The owner must approve the final taxonomy and project-specific mappings.

## 3. Access lifecycle

Grant access for a defined role and purpose. Review privileged access periodically. Remove or suspend access promptly when a person leaves or changes role. Shared accounts are discouraged; individual accountability is required where supported.

## 4. AI and external processing

Before sending organization, client, source-code, or personal data to an AI or third-party service, verify the data classification, provider terms, retention/training settings, location, access controls, and approval. Do not continuously stream private audio or sensitive content to cloud services without an explicit approved design and user consent.

## 5. Incident handling

Record discovery time, affected systems/data, severity, containment, owner, communications, evidence preservation, root cause, corrective actions, and closure approval. Escalate suspected credential exposure, unauthorized access, personal-data exposure, data loss, or unsafe automation immediately.

## 6. Open validation

Confirm legal jurisdiction and applicable privacy obligations, retention periods, data residency needs, incident notification obligations, approved providers, and named data/security owners.
