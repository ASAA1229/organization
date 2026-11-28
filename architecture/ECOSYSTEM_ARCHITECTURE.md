# Organization Architecture

## Ecosystem Architecture

![Ecosystem Diagram](../architecture/ECOSYSTEM_ARCHITECTURE.png)

*The diagram (to be added) shows the six repositories, shared services (Identity, API Gateway, Event Bus) and the native client layer.*

## Shared Data Architecture

- **Identity Service** – Keycloak instance managed by `Configuration`.
- **API Gateway** – FastAPI gateway exposing unified contract.
- **Event Bus** – Pub/Sub (Kafka/Redis) used for cross‑repo events.
- **Data Stores** – Separate databases per repo; logical data‑ownership documented in `SHARED_DATA_ARCHITECTURE.md`.
