# ConfigSentry — Market + Keyword Research (Docker Compose security/ops linter)

*Timebox:* ~45–60 min (Feb 2026)

## 1) Product concept (working definition)
**ConfigSentry**: a fast, CI-friendly linter for `docker-compose.yml` / `compose.yaml` that flags **security + operational misconfigurations** (and optionally auto-fixes safe changes).

**Typical findings** (examples):
- Privilege: `privileged: true`, missing `user`, missing `read_only`, excessive `cap_add`, missing `cap_drop: [ALL]`, missing `security_opt: [no-new-privileges:true]`
- Dangerous mounts: `/var/run/docker.sock` bind-mounts, host filesystem mounts, writable sensitive paths
- Risky networking: `network_mode: host`, overly broad port exposure, missing internal networks
- Image hygiene: `:latest` tag policy, pin-by-digest recommendations
- Ops hygiene: missing `healthcheck`, missing `restart` policy, missing resource limits, missing logging configuration

## 2) Target personas (who will search & buy)

### A. Platform/DevOps engineers (SMB → mid-market)
- **Job-to-be-done:** prevent “compose drift” and production footguns; enforce baseline hardening across many repos.
- **Where they feel pain:** incidents from permissive container settings; inconsistent compose conventions; onboarding new teams.
- **How they buy:** adopt as GitHub Action / CI step; later pay for team policies, reporting, dashboards.

### B. SREs / operations-minded engineers
- **JTBD:** reduce outages caused by missing healthchecks/restart policies/resource limits.
- **Desired output:** actionable “fix this line in compose” feedback; PR annotations; fail CI by severity.

### C. AppSec / DevSecOps engineers
- **JTBD:** shift-left container configuration hardening beyond image scanning.
- **Desired output:** policy-as-code style checks, compliance mapping (CIS-ish), audit trails.

### D. Self-hosters / homelabbers (high volume, lower ARPU)
- **JTBD:** run popular containers safely; avoid common mistakes (`docker.sock`, privileged containers).
- **Distribution:** blog posts, Reddit, “security best practices” content; likely to use a free tier.

## 3) Competitor landscape (direct + adjacent)

### Direct-ish (Compose-specific linting)
1) **Docker Compose Linter (DCLint)** — best-practice + schema validation + formatting
   - Strong: dedicated to Compose files; rules, auto-fix; CI-friendly.
   - Gap/opportunity: not positioned as “security/ops hardening baseline”; room for opinionated security packs.
   - Source: https://github.com/zavoloklom/docker-compose-linter

2) **KICS (Checkmarx)** — IaC misconfiguration scanning including **docker-compose**
   - Strong: broad IaC coverage; many queries; enterprise-friendly story.
   - Gap/opportunity: broad tool may be heavier; Compose-specific UX could be better (compose-native guidance, auto-fixes, focused rules).
   - Source: https://github.com/Checkmarx/kics (supported platforms include docker-compose)

### Adjacent (container & IaC security; users may substitute)
- **Trivy (Aqua Security)** — vuln + misconfig + secret scanning across images/repos/K8s/etc.
  - Substitute angle: teams already run Trivy and may expect it to cover Compose misconfigs.
  - Opportunity: “Compose-first” rules + better remediation specifically for compose.
  - Source: https://github.com/aquasecurity/trivy

- **Checkov (Bridgecrew/Prisma Cloud)** — IaC misconfig scanning (Terraform/K8s/Dockerfile/etc.)
  - Substitute angle: policy-as-code; broad scanning.
  - Opportunity: Compose-specific operational checks (healthchecks, restart policies) and dev workflow integrations.
  - Source: https://github.com/bridgecrewio/checkov

- **Dockle** — container image linter for security best practices (CIS-ish)
  - Substitute angle: “best practice” for containers but **image-focused**, not compose config.
  - Source: https://github.com/goodwithtech/dockle

- **Hadolint** — Dockerfile linter
  - Substitute angle: teams may think “we already lint containers”. Still misses runtime/compose knobs.
  - Source: https://github.com/hadolint/hadolint

- **Docker Bench for Security** — CIS Docker Benchmark script (host/daemon oriented)
  - Substitute angle: compliance posture checks; not dev-time compose linting.
  - Source: https://github.com/docker/docker-bench-security

### “Rules sources” (what defines best practices)
- **OWASP Docker Security Cheat Sheet** — highlights common misconfig risks like docker.sock exposure, privilege, capabilities.
  - Useful for: aligning ConfigSentry checks to a recognizable external baseline.
  - Source: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html

### Demand signals (community discussions)
- Docker socket risk explained (frequently referenced, ongoing pain point):
  - Source: https://stackoverflow.com/questions/40844197/what-is-the-docker-security-risk-of-var-run-docker-sock
- Self-hosted community discussing compose hardening patterns (`read_only`, `user`, `no-new-privileges`, `cap_drop` etc.):
  - Source: https://www.reddit.com/r/selfhosted/comments/1aoujuu/best_security_practices_for_docker_containers/
  - Source: https://www.reddit.com/r/selfhosted/comments/1oal4sx/docker_compose_security_best_practices_question/

## 4) Positioning (how ConfigSentry wins)

### Core positioning statement
**“The opinionated security + reliability linter for Docker Compose.”**

### Differentiators to emphasize
1) **Compose-first UX**: understands Compose patterns (services, networks, profiles, extensions, anchors) and outputs *copy/paste* fixes.
2) **Security + Ops in one tool**: merges hardening (least privilege) with uptime hygiene (healthcheck, restart, resource limits).
3) **Policy packs**:
   - *Baseline*: safe defaults for most services
   - *Self-hosted*: common homelab stacks
   - *CI runner*: stricter docker.sock / privileged checks
   - *Prod*: resource limits + logging + healthchecks required
4) **Fail-fast CI**: severity thresholds, SARIF/PR annotations, GitHub Action.
5) **Safe auto-fix** for non-breaking improvements (formatting, ordering, adding recommended-but-optional blocks behind flags).

### Potential tagline options
- “Stop Docker Compose footguns before they ship.”
- “Harden your compose files: least privilege + uptime defaults.”
- “Compose linting with security and ops guardrails.”

## 5) Keyword research (clusters + intent)

> Notes: Without direct access to keyword volume tools here, intent is inferred from phrasing and market behavior. Use this list to seed: (1) landing pages, (2) blog posts, (3) Google Search Console discovery, (4) paid search tests.

### Cluster 1 — Compose linting / validation (high intent)
**Primary keywords**
- docker compose linter
- docker-compose linter
- compose file linter
- lint docker compose file
- validate docker compose yaml

**Secondary / variants**
- docker compose validate
- docker compose schema validation
- compose yaml validator
- docker compose best practices linter

**Long-tail (problem phrasing)**
- “how to lint docker-compose.yml in CI”
- “github action docker compose lint”
- “pre-commit hook docker compose lint”

**Intent estimate:** Mostly **tool-seeking** / implementation; strong conversion potential.

### Cluster 2 — Compose security hardening (very high intent)
**Primary keywords**
- docker compose security best practices
- docker-compose security best practices
- harden docker compose
- docker compose least privilege

**Secondary / variants**
- docker compose privileged container
- docker compose cap_drop ALL
- docker compose no-new-privileges
- docker compose read_only root filesystem
- docker compose run as non-root user

**Long-tail**
- “should i mount /var/run/docker.sock in docker compose”
- “is docker.sock mount safe”
- “docker compose security_opt no-new-privileges true”

**Intent estimate:** **solution + guidance**; mix of informational and tool adoption (perfect for content + CTA to ConfigSentry).

### Cluster 3 — Operational reliability / production readiness (mid-high intent)
**Primary keywords**
- docker compose healthcheck
- docker compose restart policy
- docker compose resource limits
- docker compose logging driver

**Secondary / variants**
- docker compose depends_on healthcheck condition
- docker compose deploy resources limits (swarm vs non-swarm confusion)
- docker compose oom_kill_disable / ulimits

**Long-tail**
- “docker compose healthcheck examples postgres/redis/nginx”
- “why docker compose restart always not working”

**Intent estimate:** **ops pain**; strong “linter with rules” angle.

### Cluster 4 — “Dangerous patterns” / footguns (high intent, high shareability)
**Primary keywords**
- docker compose docker sock security
- docker compose privileged security risk
- docker compose network_mode host security

**Secondary**
- docker compose bind mount security
- docker compose expose vs ports security

**Long-tail**
- “docker compose mount docker socket alternatives”
- “docker compose root user security risk”

**Intent estimate:** mostly **informational**, but excellent funnel content.

### Cluster 5 — IaC misconfiguration scanners (competitive comparisons)
**Primary keywords**
- iac misconfiguration scanning
- trivy misconfig docker compose
- kics docker-compose
- checkov docker compose

**Long-tail**
- “trivy vs kics docker compose misconfiguration”
- “best tool to scan docker compose for security”

**Intent estimate:** **evaluation** (later-stage). Great for comparison pages.

## 6) Suggested landing pages (SEO + conversion)

### Core pages
1) **/docker-compose-linter**
   - Target: “docker compose linter”, “docker-compose linter”
   - Content: what it checks, example output, install, CI integrations.

2) **/docker-compose-security**
   - Target: “docker compose security best practices”, “harden docker compose”
   - Content: explain baseline risks + how ConfigSentry enforces them.

3) **/github-action-docker-compose-lint**
   - Target: “github action docker compose lint”
   - Content: copy/paste workflow, SARIF annotations.

4) **/rules** (or “policy packs”)
   - Target: long-tail queries about specific flags (`no-new-privileges`, `cap_drop`, `read_only`, etc.).

### Comparison / alternative pages
- **/alternatives/dclint** (vs Docker Compose Linter)
- **/alternatives/kics**
- **/alternatives/trivy-misconfig**

*Goal:* capture evaluator intent without needing paid ads.

## 7) Blog/content map (topic clusters → posts)

### Cluster A: “Compose security baseline” (top funnel → high share)
- “Docker Compose security best practices (least privilege checklist)”
- “Why mounting /var/run/docker.sock is effectively root access (and safer alternatives)”
  - cite OWASP + StackOverflow discussion
- “Harden a compose service: user, read_only, cap_drop, no-new-privileges (with examples)”

### Cluster B: “Production readiness” (mid funnel)
- “Healthchecks in Docker Compose: patterns, gotchas, and examples”
- “Restart policies in Docker Compose: when to use always vs on-failure”
- “Resource limits in Docker Compose: what actually works (and what’s Swarm-only)”

### Cluster C: “CI integration” (bottom funnel)
- “Add Compose linting to GitHub Actions in 3 minutes (SARIF + PR comments)”
- “Pre-commit hooks for compose: prevent broken configs before pushing”

### Cluster D: “Tool comparisons” (evaluation)
- “DCLint vs ConfigSentry: formatting vs security/ops guardrails”
- “KICS/Trivy/Checkov vs a compose-first linter: when each tool fits”

## 8) Next experiments (fast validation plan)

### Experiment 1 — SEO smoke test (1 week)
- Publish 2 landing pages + 2 blog posts:
  - docker compose linter (tool intent)
  - docker compose security best practices (guidance intent)
- Add lightweight newsletter/CTA: “Get a free compose hardening report.”
- Measure: impressions/clicks (GSC), time on page, CTA conversion.

### Experiment 2 — GitHub distribution loop (1–2 weeks)
- Ship **ConfigSentry GitHub Action** + **pre-commit** template.
- Add “badges” + sample SARIF screenshots.
- Measure: stars, installs, action marketplace clicks, issue traffic.

### Experiment 3 — ‘Free scanner’ lead magnet (2 weeks)
- A simple web form / CLI mode that outputs a **shareable report**:
  - “10 findings, 3 critical” + copy/paste diffs.
- Measure: scans/day, email capture rate, repeat usage.

### Experiment 4 — Community feedback (ongoing)
- Post a “compose hardening checklist” to r/selfhosted / r/docker (do not spam; provide real value).
- Ask: “What checks would you want in an automated linter?”
- Measure: qualitative signal; vocabulary for keywords.

### Experiment 5 — Pricing probe (after basic traction)
- Free: local CLI + basic CI fail
- Pro: policy packs + PR annotations + org-wide dashboards + baseline drift reports
- Measure: waitlist signups; willingness-to-pay responses.

## 9) Practical takeaways for ConfigSentry MVP scope

**Highest-leverage rules for first release** (most searched + highest risk):
- Flag `privileged: true`
- Flag docker socket mounts (`/var/run/docker.sock`)
- Flag `network_mode: host`
- Recommend `user:` (non-root) when absent
- Recommend `read_only: true` when absent (with an allowlist for services needing writes)
- Recommend `security_opt: [no-new-privileges:true]`
- Recommend `cap_drop: [ALL]` and explicit `cap_add` when needed
- Recommend `healthcheck` and `restart` policy

**Output formats that unlock adoption**:
- Human-friendly CLI + exit codes
- SARIF (for GitHub code scanning UI)
- JSON (for pipelines)

---

## Sources / links (collected)
- Docker Compose Linter (DCLint): https://github.com/zavoloklom/docker-compose-linter
- KICS (docker-compose supported platform): https://github.com/Checkmarx/kics
- Trivy overview: https://github.com/aquasecurity/trivy
- Checkov overview: https://github.com/bridgecrewio/checkov
- Dockle: https://github.com/goodwithtech/dockle
- Hadolint: https://github.com/hadolint/hadolint
- Docker Bench for Security: https://github.com/docker/docker-bench-security
- OWASP Docker Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Docker socket risk discussion: https://stackoverflow.com/questions/40844197/what-is-the-docker-security-risk-of-var-run-docker-sock
- Reddit discussions (compose/container security best practices):
  - https://www.reddit.com/r/selfhosted/comments/1aoujuu/best_security_practices_for_docker_containers/
  - https://www.reddit.com/r/selfhosted/comments/1oal4sx/docker_compose_security_best_practices_question/
