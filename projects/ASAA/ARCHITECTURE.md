# ASAA Architecture

- **Backend**: Node.js (Express) + PostgreSQL.
- **Frontend**: React + Vite.
- **Containerisation**: Docker, Docker Compose.
- **APIs**: OpenAPI 3.0 defined in `src/api/openapi.yaml`.
- **Communications**: HTTP/REST to shared API gateway, Kafka events for async integration.

*Implementation status*: ~59 % – core services running, UI pending.
