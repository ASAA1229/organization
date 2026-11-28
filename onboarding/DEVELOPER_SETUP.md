# Developer Setup

## Prerequisites
- **PowerShell 7+** (installed by default on Windows 10+).
- **Node.js 20.x** (for JavaScript repos) – install via `nvm` or the official installer.
- **Python 3.12** (for automation scripts).
- **Docker Desktop** (for containerised services).
- **Git** (latest version).
- **GitHub CLI (`gh`)** – already authenticated via `Token.txt`.

## Steps
1. Clone the `organization` repo and run `git checkout -b new`.
2. Run `npm install` in any JavaScript sub‑repo you work on.
3. Run `python -m venv .venv && .\.venv\Scripts\activate && pip install -r requirements.txt` for Python parts.
4. Start Docker services with `docker compose -f docker-compose.yml up -d` (see each repo's `docker-compose.yml`).
5. Verify the documentation build with `mkdocs serve` (requires `mkdocs`).

## Common failures & resolutions
- **`npm` not found** – add Node to PATH or reinstall.
- **Docker daemon not running** – start Docker Desktop.
- **Python package errors** – ensure the correct Python version is active.
