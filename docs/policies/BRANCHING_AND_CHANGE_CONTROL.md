# Branching and Change Control Policy

**Status:** Required workflow; GitHub enforcement configuration is not yet verified for every repository.

## 1. Standard branch set

Every ASAA project repository is expected to maintain:
- `main` — production/release baseline
- `dev` — integration baseline
- `new` — default target for routine feature, documentation, and planned work
- `fix` — focused defect correction work
- `test` — test/audit work where the project uses a dedicated test branch

## 2. Target-branch rule

**All routine work and pull requests target `new`.** Do not target `dev` or `main directly.

The `dev` and `main` branches are protected by policy:
- no routine direct commits;
- no routine PRs targeting them;
- no bypass of review/checks;
- no merge without explicit authorization.

## 3. Promotion flow

1. Work branch → `new`: normal reviewed contribution.
2. `new` → `dev`: explicit integration/promotion PR after required checks and review.
3. `dev` → `main`: explicit release PR after acceptance, release readiness, rollback planning, and owner authorization.

The `fix` and `test` branches are used according to the project workflow, but their changes must ultimately enter through the approved `new` integration path unless an explicitly approved incident procedure says otherwise.

## 4. Pull request requirements

Include purpose, linked requirement/issue, scope, affected components, risk, test evidence, security/privacy impact, data/schema impact, rollback notes, and documentation updates. Mark unverified items honestly.

## 5. Enforcement checklist

For each repository, verify GitHub rulesets/branch protection:
- require pull requests for `dev` and `main`;
- require appropriate approvals;
- require relevant status checks;
- restrict force pushes and deletion;
- restrict bypass permissions;
- require conversation resolution where appropriate;
- confirm administrators are subject to intended rules.

**Current evidence:** this repository initially had only `main`; branch `new` was created for this documentation work. Actual protection settings have not been inspected or enabled as part of this change. Do not represent policy text as proof of technical enforcement.


## Organization-wide promotion verification — 2026-11-20

The enforced target flow is: task/working branches → `new`; only `new` → `dev`; only `dev` → `main`. Do not open direct PRs from working branches to `dev`/`main), or from `new` directly to `main`. All six repositories have the five standard branch names. However, the 2026-11-20 audit observed all 30 standard branch records with `protected: false`; branch-protection configuration remains pending application and verification. Native rulesets may not fully enforce source/target branch relationships, so add a required CI policy check. No merge or promotion was performed by the documentation refresh.
