# Shared Data Architecture

This document describes how data is owned, stored and accessed across the ecosystem.

- **Identity data** – Managed exclusively by the `Configuration` service (Keycloak). No other repo writes directly to the identity database.
- **Project‑specific data** – Each repository owns its own database schema (e.g., ASAA → employee & payroll tables; Portfolio → media assets). Cross‑repo access occurs only through the shared API gateway.
- **Event store** – Central Kafka/Redis stream used for audit, notifications and integration events.
- **Data‑ownership matrix** – See `reports/DEPENDENCY_REGISTER.md` for a detailed table.
