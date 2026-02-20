# Sidehustle Sprints — 2026-02-16

## MVP finish plan
See: `MVP-FINISH-PLAN.md` (task checklist + acceptance criteria). Use this in next sprint ticks to close the last ~15%.

Goal for today: pick one app idea with exit potential (fits Kompetenzen, avoids Hauptjob competition, minimizes need for outbound sales/marketing), then build an MVP by evening.

## Sprint Plan (today)

### Sprint 0 — Project setup (now → ~13:00)
- [ ] Pull latest vault changes (done)
- [ ] Read notes: Nebengewerbe-Ziele, Kompetenzen, Defizite, Hauptjob, Projekthistorie (done)
- [ ] Create project folder + docs scaffold (in progress)
- [ ] Decide on 1 concept + MVP scope

### Sprint 1 — Concept & validation-lite (~13:00 → 15:00)
- [ ] Problem statement + target users
- [ ] Why now + differentiation
- [ ] MVP definition (must ship today)
- [ ] Pricing hypothesis + distribution channel
- [ ] Risks (esp. marketing/sales) + mitigations

### Sprint 2 — MVP scaffold (~15:00 → 17:00)
- [ ] Repo scaffold (package.json, tsconfig, lint, tests)
- [ ] Minimal CLI/UI skeleton + example flow

### Sprint 3 — Core feature (~17:00 → 19:30)
- [ ] Implement 1–2 “killer” checks
- [ ] Output format + autofix hints

### Sprint 4 — Packaging (~19:30 → evening)
- [ ] README (install, run, examples)
- [ ] Demo inputs + screenshots/recording notes
- [ ] Next steps backlog

## Working log

- 12:29: Pulled wissen_mmo; new `Marius/` folder exists.
- 12:40: Chose concept: **ConfigSentry** (Compose security/ops linter) + wrote CONCEPT.md.
- 12:55: MVP CLI scaffolded (TypeScript + yaml parser) + example compose file; CLI returns exit code 2 when findings exist (CI-friendly).
- 12:58: Added minimal unit tests for key rules; `npm test` green.
- 17:03: Re-ran tests; still green.

# 2026-02-19 — Release alignment sprint

- Released **v0.0.16**:
  - npm published: `configsentry@0.0.16` (npx smoke test ok)
  - git tag pushed: `v0.0.16`
  - GitHub Release created: https://github.com/alfredMorgenstern/configsentry/releases/tag/v0.0.16
  - Code Scanning workflow ran successfully for tag + master.

Next: confirm Code Scanning results are visible in GitHub UI, and consider rotating npm token (it was pasted via Telegram).

# 2026-02-19 — Launch

- Reddit launch post (r/selfhosted, flair: Docker Management):
  https://www.reddit.com/r/selfhosted/comments/1r98qiw/configsentry_a_tiny_linter_for_dockercomposeyml/

# 2026-02-20 — MVP finish checklist closeout

- Marked Phase D doc tasks as done in `MVP-FINISH-PLAN.md`:
  - `PUBLISHING.md` contains a quick Release checklist
  - `docs/action-usage.md` contains a minimal Code Scanning workflow snippet with:
    - `permissions: security-events: write`
    - `upload-sarif: true`

Remaining: (seems) none in MVP-FINISH-PLAN.md — needs a quick re-scan/confirmation.

# 2026-02-20 — Action/CLI DX alignment

- Added `--target <file-or-dir>` support to the CLI (positional arg still works).
- Updated the composite action to call the CLI using `--target`.

Commits:
- 8d6f419 dx: support --target flag in CLI
- 7a37dbb build: update dist for --target support
- c9670b1 dx(action): use --target flag when invoking CLI

Next: ship as a patch release (e.g., v0.0.19) so action consumers get the improvement.
