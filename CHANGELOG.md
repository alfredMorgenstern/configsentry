# Changelog

## v0.0.29
- Rules: improve depends_on warning message (includes dependency list)

## v0.0.28
- Rules: gentle warning for depends_on without healthcheck gating (`compose.depends-on-without-health`)

## v0.0.27
- Rules: detect likely hardcoded secrets in `environment:` (HIGH/MEDIUM)
- Rules: flag unpinned image tags (missing tag / :latest)

## v0.0.26
- CLI: add `--severity-threshold <low|medium|high>` to report/fail only at/above a severity
- DX: add `npm run demo` / `npm run demo:json` for running the demo file from the repo
- Docs: baseline onboarding walkthrough + refreshed demo output examples

## v0.0.20
- Rules: suggest hardening via `read_only: true` (LOW severity)

## v0.0.19
- Rules: flag sensitive host bind mounts in volumes (`/etc`, `/proc`, `/sys`) (short + long syntax)
- CLI: support `--target <file-or-dir>` (positional arg still supported)
- Action: invoke CLI via `--target` to match input naming
- Docs: prefer `--target` in CLI examples

## v0.0.18
- Action: run install/build from `github.action_path` (no dependency on consumer repo lockfiles)

## v0.0.17
- Action: remove npm caching config so consumer repos without lockfiles don’t fail

## v0.0.16
- Packaging: shrink published tarball (exclude `src/` + `dist/**/*.test.js`)
- Build: clean `dist/` before compiling (prevents stale files shipping)

## v0.0.13
- Rules: detect host `/dev` mounts
- Rules: detect dangerous device mappings (`/dev/kmsg`, `/dev/mem`, `/dev/kmem`)
- Docs: add launch pack (copy/paste post + demo + positioning)

## v0.0.12
- Rules: detect `cap_add: [ALL]`
- Rules: detect host namespaces (`network_mode: host`, `pid: host`, `ipc: host`)
- Rules: detect unconfined security profiles via `security_opt` (`seccomp=unconfined`, `apparmor=unconfined`, `label:disable`)

## v0.0.11
- Docs: add npm version badge + make npx quickstart primary

## v0.0.10
- Packaging: `npm pkg fix` cleanup (repository.url normalization)

## v0.0.9
- Packaging: make npm publish possible (no longer `private`)
- Docs: composite action example + Code Scanning SARIF permission note

## v0.0.1
- Initial MVP
- CLI output (human + JSON)
- SARIF output (`--sarif`)
- Composite GitHub Action (`action.yml`)
- GitHub Pages landing
