# ConfigSentry — Post‑MVP Plan

Status context (2026-02-19): MVP shipped (npm + Action + SARIF/Code Scanning). Next is turning it into something people actually adopt.

This plan is ordered by **ROI** (adoption + trust + feedback loops) and avoids big rewrites.

---

## 0) Definition of “MVP complete” (baseline)

- npm package published and `npx configsentry …` works ✅
- GitHub Action works in consumer repos ✅
- SARIF upload appears in GitHub Code Scanning ✅
- Docs are copy/pasteable ✅

---

## 1) Stabilization & trust (1–2 evenings)

### 1.1 Compatibility matrix
- [x] Verify Node versions (18/20/22) locally + in CI
- [x] Confirm Windows/macOS path behavior (basic run) — especially file globs + path separators

### 1.2 Baseline/suppressions UX
- [x] Document baseline workflow end-to-end with a real example repo
- [x] Add a “common onboarding” doc section:
  - start with `fail-on-findings: false`
  - generate baseline
  - flip to `fail-on-findings: true`

### 1.3 Output quality
- [ ] Ensure every rule has: clear message, severity rationale, and a safe “fix” suggestion
- [ ] Add short rule IDs in output (already exists in SARIF; ensure CLI output consistent)

Deliverable: fewer surprises, easier adoption, fewer “why did this fail?” moments.

---

## 2) Distribution & adoption (highest ROI) (1–2 evenings)

### 2.1 A “60-second install” landing section
- [x] Update README top to include:
  - `npx configsentry ./docker-compose.yml`
  - minimal Action snippet
  - Code Scanning snippet

### 2.2 Launch assets
- [ ] Create 1 demo compose file + screenshot/GIF of output
- [ ] Create a short “why you should care” section with 3 real footguns and impact

### 2.3 First public posts (pick 1–2)
- [ ] r/selfhosted post (launch-pack.md adapted)
- [ ] r/docker post
- [ ] GitHub Discussions “Show and tell” style

Deliverable: first external users + issues.

---

## 3) Rule coverage expansion (incremental) (2–5 evenings)

Principle: only add rules that are **high-impact** and have clear fixes.

Suggested next rules (ranked):
- [ ] `read_only: true` missing (recommend where safe)
- [ ] `tmpfs:` suggestion for sensitive paths (optional)
- [ ] `privileged` alternatives guidance (`cap_add` minimal set)
- [ ] host path mounts of `/` or `/etc` or `/proc`/`/sys` patterns (severity HIGH)
- [x] environment variables containing secrets (heuristic; careful to avoid false positives)
- [x] image tags should be pinned (avoid `latest` / missing tags) — reproducibility
- [ ] `depends_on` without healthcheck condition (Compose v2 nuance) — warn gently

Deliverable: more value per run; keep false positives low.

---

## 4) Developer experience (DX) (1–3 evenings)

- [ ] Add `--format` option (human/json/sarif) to simplify flags
- [ ] Add `--quiet` and `--no-color`
- [ ] Add `--output <file>` for SARIF/JSON without shell redirection
- [x] Add `--severity-threshold` (e.g., fail only on HIGH)

Deliverable: easier CI integration in diverse environments.

---

## 5) GitHub Action upgrades (optional) (1–3 evenings)

- [ ] Marketplace listing (metadata + docs)
- [ ] Optional PR annotations (reviewdog or GitHub annotations) *in addition to* SARIF
- [ ] Cache dependencies again, but safely (only when action repo lockfile exists)

Deliverable: more discoverability + better feedback in PRs.

---

## 6) Monetization experiments (only after adoption signals)

Criteria to consider paid tier: consistent users + repeated requests.

Possible “Pro” ideas:
- Policy packs (predefined rule sets)
- Org-wide baselines / reporting
- PR commenting + summary trend dashboards

Deliverable: validate willingness to pay without compromising OSS core.

---

## Operating loop (weekly)

- [ ] One small release per week (even if just docs)
- [ ] Respond to issues within 24–48h
- [ ] Track:
  - npm downloads
  - GitHub stars
  - issues opened / closed
  - false-positive rate (qualitative)

---

## Next concrete action (pick one)

- [ ] Prepare a launch post using `docs/launch-pack.md` + one screenshot/GIF
- [ ] Add 2 high-ROI rules with tests and release
- [ ] Marketplace listing
