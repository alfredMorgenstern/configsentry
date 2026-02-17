# Concept: ConfigSentry (working title)

## One-liner
A developer-first security & ops linting tool for **Docker Compose / container configs** that catches high-impact misconfigurations (secrets, ports, privileged containers, missing healthchecks) and produces **actionable, copy-pastable fixes**.

Packaged as:
- **CLI** (free/paid)
- **GitHub Action** (marketplace distribution)
- later: hosted dashboard (SaaS) for teams

## Why this fits your constraints
- Uses your strengths: Linux, infra, security, system design, Git.
- Avoids direct competition with SHD’s core business (it’s a product/tool, not consulting/managed services).
- Reduces marketing/sales burden via **ecosystem distribution** (GitHub Marketplace, npm, SEO docs).
- Can be built/iterated in evenings; incremental value.

## Target users
- Indie devs & small teams shipping containerized apps.
- DevOps-lite teams who want “guardrails” without heavy platforms.

## Core problem
Most teams ship insecure Compose defaults:
- containers run as root
- privileged / host mounts
- exposed DB ports
- secrets in env files committed
- no healthchecks / restart policies

They often only learn after an incident or a painful production bug.

## Differentiation
- Opinionated, “small checklist that matters” (not a giant compliance scanner).
- Great DX: **one command**, clear severity, fix suggestions.
- Focus on Compose-first (Terraform/K8s later).

## MVP (today)
CLI that:
1) reads `docker-compose.yml` (and `.env` optionally)
2) runs a small set of checks
3) prints a report (human + JSON)
4) exits non-zero if issues found (CI-friendly)

### MVP checks (initial)
- Exposed sensitive ports (5432, 3306, 6379) to 0.0.0.0
- `privileged: true`
- host mounts of `/` or docker socket `/var/run/docker.sock`
- missing `restart:` policy
- missing `healthcheck:`
- container runs as root (no `user:` or `user: 0`)

## Monetization hypothesis (later)
- Free CLI + paid “Pro” rulesets (team policy packs)
- Hosted dashboard for PR trends + policy exceptions
- GitHub App with enriched PR comments

## Distribution
- npm package (fast)
- GitHub Action template repo (marketplace)
- Blog posts: “Top 10 docker-compose footguns” (SEO)

## Risks & mitigations
- Crowded space → keep scope tight, ship DX + Compose focus.
- You dislike outbound sales → lean on marketplace + content SEO.

## Next expansions
- Kubernetes manifests
- Terraform
- Autofix mode (`--fix`) for safe transformations
