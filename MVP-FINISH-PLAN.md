# ConfigSentry — MVP Finish Plan (last ~15%)

Owner: Marius / Alfred

Target outcome: one clean release where **everything matches**:
- `package.json` version = `0.0.16`
- git tag = `v0.0.16` pointing at the release commit
- npm registry version = `0.0.16`
- GitHub Release exists for `v0.0.16`
- GitHub Code Scanning shows ConfigSentry SARIF results

> Note: remote tags `v0.0.14` and `v0.0.15` already exist historically, so we will **not** rewrite them. We ship the next aligned release as **0.0.16**.

---

## Phase A — Version alignment + release hygiene

- [ ] Confirm current state (for log):
  - [ ] `node -p 'require("./package.json").version'`
  - [ ] `npm view configsentry version`
  - [ ] `git rev-parse --short HEAD`
  - [ ] `git ls-remote --tags origin 'v0.0.1[3-6]'`

- [ ] Set release version to **0.0.16**
  - [ ] Update `package.json` version -> `0.0.16`
  - [ ] Update `CHANGELOG.md`: move “Unreleased” items under `## v0.0.16`

- [ ] Validate locally
  - [ ] `npm test`
  - [ ] `npm pack --dry-run`
    - [ ] Confirm tarball contains runtime only (no `src/`)
    - [ ] Confirm excludes `dist/**/*.test.js`

- [ ] Commit + tag
  - [ ] `git add -A`
  - [ ] `git commit -m 'chore(release): v0.0.16'`
  - [ ] `git tag v0.0.16`

- [ ] Push
  - [ ] `git push origin master`
  - [ ] `git push origin v0.0.16`

**Acceptance criteria:**
- [ ] `v0.0.16` exists on origin and points to the release commit
- [ ] CI is green

---

## Phase B — Publish to npm (using saved token)

- [ ] Ensure npm auth is configured on the machine
  - [ ] Prefer `~/.npmrc` via token (read from `.credentials/npm_token.txt`)
  - [ ] Verify: `npm whoami`

- [ ] Publish
  - [ ] `npm publish`

- [ ] Verify
  - [ ] `npm view configsentry version` returns `0.0.16`
  - [ ] Smoke test from a clean dir:
    - [ ] `npx configsentry ./docker-compose.yml` (use a tiny sample compose)

**Acceptance criteria:**
- [ ] npm registry shows `0.0.16`
- [ ] `npx configsentry …` works

---

## Phase C — GitHub Release + SARIF proof in Code Scanning

- [ ] GitHub Release
  - [ ] Confirm Release workflow ran for `v0.0.16`
  - [ ] Confirm a GitHub Release exists and has auto notes

- [ ] Code Scanning proof
  - [ ] Trigger / run `.github/workflows/code-scanning.yml`
  - [ ] Confirm results appear under **Security → Code scanning**
  - [ ] Confirm SARIF upload step succeeds (`github/codeql-action/upload-sarif@v4`)

**Acceptance criteria:**
- [ ] Code Scanning shows ConfigSentry tool results

---

## Phase D — Final consumer-ready docs polish

- [ ] Ensure docs use the latest tag everywhere (`v0.0.16`)
  - [ ] `README.md`
  - [ ] `docs/action-usage.md`
  - [ ] `.github/workflows/example-consumer.yml`

- [ ] Add a small “Release checklist” snippet to `PUBLISHING.md`
- [ ] Optional: add a minimal copy/paste workflow that includes:
  - [ ] `permissions: security-events: write`
  - [ ] `upload-sarif: true`

**Acceptance criteria:**
- [ ] A user can copy/paste docs into another repo and it works first try

---

## Sprint usage

In each sprint tick:
- pick the next unchecked block that is shortest-to-ship,
- execute it end-to-end,
- then report back with: completed items, remaining items, and any blockers.
