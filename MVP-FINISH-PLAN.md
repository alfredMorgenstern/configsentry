# ConfigSentry — MVP Finish Plan (last ~15%)

Owner: Marius / Alfred

Target outcome: one clean release where **everything matches**:
- `package.json` version = `0.0.16` (achieved) / latest release currently `0.0.18`
- git tag = `v0.0.16` (achieved) / latest release tag currently `v0.0.18`
- npm registry version = `0.0.16` (achieved) / latest registry version currently `0.0.18`
- GitHub Release exists (achieved)
- GitHub Code Scanning shows ConfigSentry SARIF results (achieved)

> Note: remote tags `v0.0.14` and `v0.0.15` already exist historically, so we will **not** rewrite them. We ship the next aligned release as **0.0.16**.

---

## Phase A — Version alignment + release hygiene

- [x] Confirm current state (for log)
- [x] Set release version to **0.0.16**
- [x] Validate locally (`npm test`, `npm pack --dry-run`)
- [x] Commit + tag (`chore(release): v0.0.16`, tag `v0.0.16`)
- [x] Push (master + tag)

**Acceptance criteria:**
- [x] `v0.0.16` exists on origin and points to the release commit
- [x] CI is green

---

## Phase B — Publish to npm (using saved token)

- [x] Ensure npm auth is configured on the machine (via saved token)
- [x] Publish (`npm publish`)
- [x] Verify:
  - [x] `npm view configsentry version` returns `0.0.16`
  - [x] `npx configsentry ./docker-compose.yml` smoke test works

**Acceptance criteria:**
- [x] npm registry shows `0.0.16`
- [x] `npx configsentry …` works

---

## Phase C — GitHub Release + SARIF proof in Code Scanning

- [x] GitHub Release:
  - [x] Release workflow ran for `v0.0.16`
  - [x] GitHub Release exists (auto notes)

- [x] Code Scanning proof:
  - [x] Workflow ran (`.github/workflows/code-scanning.yml`)
  - [x] Results appear under **Security → Code scanning** (alerts exist)
  - [x] SARIF upload step succeeded

**Acceptance criteria:**
- [x] Code Scanning shows ConfigSentry tool results

---

## Phase D — Final consumer-ready docs polish

- [x] Ensure docs use the latest tag everywhere (at least `v0.0.16`; updated further for subsequent releases)
  - [x] `README.md`
  - [x] `docs/action-usage.md`
  - [x] `.github/workflows/example-consumer.yml`

- [x] Add a small “Release checklist” snippet to `PUBLISHING.md`
- [x] Optional: add a minimal copy/paste workflow that includes:
  - [x] `permissions: security-events: write`
  - [x] `upload-sarif: true`

**Acceptance criteria:**
- [x] A user can copy/paste docs into another repo and it works first try (validated via https://github.com/alfredMorgenstern/configsentry-consumer-test)

---

## Sprint usage

In each sprint tick:
- pick the next unchecked block that is shortest-to-ship,
- execute it end-to-end,
- then report back with: completed items, remaining items, and any blockers.
