# Draft X/Twitter posts (ConfigSentry)

> Goal: short, non-cringe, proof-backed. Link to landing + repo-tests.

## Post 1 — Proof in the wild
I ran a tiny Compose linter (ConfigSentry) against a few public repos (no code executed; only YAML scanned) and the most common footguns were:

- running containers as root (missing `user:`)
- missing healthchecks/restart policies
- unpinned images (`:latest` / missing tag)
- occasional `docker.sock` mounts
- hardcoded secrets in `environment:` (often in demos)

Proof: https://configsentry.morgenstern.work/ (repo-tests linked)

## Post 2 — 60s install + CI gating
If you want a 60-second guardrail for `docker-compose.yml`:

`npx configsentry ./docker-compose.yml`

In CI you can gate only on high severity:
`--severity-threshold high`

Baselines let you adopt incrementally without breaking builds.
https://configsentry.morgenstern.work/compose-linter.html

## Post 3 — GitHub Code Scanning (SARIF)
You can surface Compose misconfigs in GitHub Security → Code scanning using SARIF.

ConfigSentry does SARIF upload via a GitHub Action (permissions: `security-events: write`).

Quick guide: https://configsentry.morgenstern.work/github-code-scanning-compose-sarif.html

## Post 4 — One-liner value prop
Stop Docker Compose footguns before they ship.

ConfigSentry is a Compose-first linter for security + ops misconfigurations (root containers, docker.sock, exposed DB ports, unpinned images, missing healthchecks…)

Try: `npx configsentry ./docker-compose.yml`
https://configsentry.morgenstern.work/
