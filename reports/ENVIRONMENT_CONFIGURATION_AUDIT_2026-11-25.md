# ASAA1229 Environment Configuration Audit

**Date:** 2026-11-25  
**Scope:** Six ASAA1229 repositories, branch new  
**Result:** Example-file inventory completed; live local environment values and service connectivity not verified.

## Inventory

| Repository | Example files found | Assessment |
|---|---|---|
| ASAA | root .env.example; apps/ap-api/.env.example | Covers Vite OIDC/API settings, API JWT/JWKS, Keycloak identity sync, database URL and ecosystem integration variables. Most optional values are intentionally commented until configured. |
| JARVIS | root .env.example | Covers owner control token, local Ollama, Piper, local paths, optional website gateway, optional cloud adapters, ASAA events and optional OIDC. Cloud keys are blank and cloud routing is disabled by default. |
| Templates | apps/api/.env.example; development, staging, production and test environment examples | Covers PostgreSQL URLs, web origin, session/cookie settings, template generation, Git, local AI, connectors, ASAA events and optional OIDC. |
| Portfolio | root .env.example | Covers JARVIS gateway, site origin, optional OpenAI key, admin password/session secret, optional OIDC, ASAA events, AI limits and demo login. |
| Configuration | identity/.env.example | Covers Keycloak bootstrap admin password and local demo account values. |
| organization | No runtime .env.example found | This is currently a governance/documentation repository; do not add unused runtime secrets without an actual application/service requirement. |

## Change made

Templates apps/api/.env.example now explicitly lists blank JENKINS_TOKEN and NEXUS_TOKEN variables because the connector documentation says those values are read from the process environment at call time. They remain blank; no credentials were supplied or invented.

## Configuration rules

- Copy examples to ignored local environment files; never commit actual .env files.
- Keep passwords, API keys, client secrets, tokens and private service URLs out of examples and logs.
- Use clear safe placeholders where a value is structurally required (for example a PostgreSQL URL with USER/PASSWORD placeholders).
- Mark unavailable credentials as NOT_YET_AVAILABLE in operational tracking; do not fill them with invented values.
- Ask the owner only when a concrete task needs a real value or account action.
- Keep paid/cloud API keys blank and disabled under the ₹0 constraint.
- Use local PostgreSQL where a project supports relational persistence. MongoDB is available locally, but add MongoDB variables only to projects whose implemented design actually needs document storage; do not introduce unused database coupling.
- The owner-approved shared data architecture does not mean every project must connect directly to both databases. Use shared APIs/services by default.

## Not yet verified

1. Whether PostgreSQL and MongoDB services are currently running and reachable on the owner's laptop.
2. The owner's actual database names, usernames, passwords and connection URLs.
3. Whether each project's runtime config parser accepts every documented optional variable.
4. Whether local environment files exist and are correctly ignored by Git.
5. Which integrations will need real credentials when activated.

These are not immediate blockers for documentation or mock-based work. Request values only when a concrete local integration or test cannot proceed without them.
