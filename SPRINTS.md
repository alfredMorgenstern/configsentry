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

Next: ship as a patch release (e.g., v0.0.19 / now prepared as v0.0.20) so action consumers get the improvement.

# 2026-02-21 — CI cross-platform coverage

- Expanded CI matrix to run tests on **ubuntu + macOS + windows** (Node 18/20/22) to catch path/FS edge cases early.

Commit:
- f1da02b ci: test on ubuntu/macos/windows

# 2026-02-21 — Patch release v0.0.21

- Published **configsentry@0.0.21** to npm (latest tag).
- Tagged + pushed **v0.0.21** on GitHub.

Notes:
- `npx` smoke test worked (run from outside the repo dir).
- Minor gotcha: `git push --tags` tried to push historical tags too; prefer pushing the single tag (`git push origin v0.0.21`).

# 2026-02-21 — Docs consistency (v0.0.21)

- Updated docs/README action snippets to reference the latest tag **v0.0.21** (action-usage, baselines, troubleshooting, README quickstart).

Commit:
- 9b85138 docs: bump action examples to v0.0.21

# 2026-02-21 — Post‑MVP: Compatibility matrix documented

- Updated `docs/compatibility.md` and POST‑MVP plan to reflect that CI runs Node **18/20/22** on **ubuntu/macos/windows**.

Commit:
- ca439fd docs: document CI compatibility matrix

# 2026-02-21 — CLI output format flag

- Added `--format <pretty|json|sarif>` (with `--json/--sarif` marked as deprecated in help).

Commit:
- 86b8494 dx(cli): add --format (pretty|json|sarif)

# 2026-02-21 — Regression tests for --format

- Added CLI tests to ensure `--format json` and `--format sarif` output valid JSON/SARIF and keep the expected exit codes.

Commit:
- d6126e4 test(cli): cover --format json/sarif

# 2026-02-21 — Patch release v0.0.22

- Published **configsentry@0.0.22** to npm (latest tag).
- Tagged + pushed **v0.0.22** on GitHub.

Notes:
- In local shells, prefer `--target ... --format json` (otherwise positional args can look like targets if placed after flags).

Docs:
- Updated README examples to prefer `--format` for JSON/SARIF output.

Commits:
- 968b2b1 chore(release): v0.0.22
- d0a255c docs: prefer --format for json/sarif output

# 2026-02-21 — CI hotfix release v0.0.23

Context: CI failures spammed email because `npm test` relied on shell globbing across OS.

- Fixed `npm test` to be **Windows-safe** (explicit dist test file list via `scripts/run-tests.mjs`).
- Published **configsentry@0.0.23** to npm + tagged/pushed **v0.0.23**.
- CI is green across ubuntu/macos/windows again.

Commits:
- 35930bf ci(test): run node --test with explicit dist test files (windows-safe)
- bcbc4e4 chore(release): v0.0.23
