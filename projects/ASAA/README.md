# ASAA Project Profile

## Purpose
The ASAA repository implements the core business workflows for HR, finance, onboarding, timesheets, and payroll. It provides REST APIs and a web UI that expose employee‑related operations to other ecosystem components.

## Responsibilities
- Manage employee lifecycle (hire, terminate, status changes).
- Handle timesheet entry, approval, and payroll processing.
- Expose data through the shared API gateway for consumption by the Windows client, Android/iOS apps, and the JARVIS assistant.

## Current State
- **Implementation:** ~59 % complete (per baseline). Core CRUD APIs for employees and timesheets are functional; payroll calculations are partially implemented.
- **Codebase:** Node.js/Express backend, React frontend, Dockerized services.
- **Tests:** Unit tests for employee endpoints (≈80 % coverage); integration tests pending for payroll.

## Relationships
- Consumes **Identity** services from the Configuration repo for authentication.
- Publishes events to the shared event bus used by JARVIS and Portfolio.
- Shares data models with the **Portfolio** repository for employee‑related media assets.

## Sources
- API definitions in `src/api/openapi.yaml`.
- Backend code in `src/`.
- Documentation drafts in `docs/`.
