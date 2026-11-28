# Operating Model

The ASAA1229 organization operates under a **light‑weight product‑centric model** with six autonomous repositories that share common infrastructure (identity, API gateway, event bus). Decisions are recorded in the `governance/DECISIONS.md` register. Teams are cross‑functional, each owning a repository and its associated services.

Key points:
- **Product ownership** – each repo has a designated owner (see `reports/DEPENDENCY_REGISTER.md`).
- **Shared services** – Identity (Keycloak), API gateway, monitoring, audit are managed centrally in the `Configuration` repo.
- **Release cadence** – continuous integration with gated PRs; releases are coordinated through the `organization` governance dashboard.
