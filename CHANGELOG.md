# Changelog

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
