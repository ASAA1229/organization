# JARVIS Architecture

- **Backend**: Python (FastAPI) for intent processing.
- **Frontend**: React + Vite for web UI.
- **Voice Engine**: Web Speech API / local STT library.
- **Communications**: HTTP/REST to shared API gateway, Kafka for events.
- **Deployment**: Docker containers, optional Windows service wrapper.

*Status*: ~61 % – core pipeline functional, UI integration pending.
