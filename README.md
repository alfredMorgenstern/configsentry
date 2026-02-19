# ConfigSentry (MVP)

[![npm version](https://img.shields.io/npm/v/configsentry.svg)](https://www.npmjs.com/package/configsentry)

Developer-first guardrails for **docker-compose.yml** (security + ops footguns).

## 60-second quickstart

### Local (npx)

```bash
npx configsentry ./docker-compose.yml
```

### GitHub Action (minimal)

```yml
- uses: alfredMorgenstern/configsentry@v0.0.18
  with:
    target: .
```

### GitHub Code Scanning (SARIF upload)

```yml
permissions:
  contents: read
  security-events: write

- uses: alfredMorgenstern/configsentry@v0.0.18
  with:
    target: .
    sarif: true
    upload-sarif: true
    fail-on-findings: false
```

## What it does
ConfigSentry reads a Compose file and flags common **high-impact** mistakes:
- privileged containers (`privileged: true`)
- dangerous capabilities (`cap_add: [ALL]`)
- host namespaces (`network_mode: host`, `pid: host`, `ipc: host`)
- unconfined security profiles (`security_opt: ["seccomp=unconfined"]` / `apparmor:unconfined`)
- Docker socket mounts (`/var/run/docker.sock`)
- sensitive ports exposed publicly (e.g. `5432:5432` instead of `127.0.0.1:5432:5432`)
- missing `restart:` policy
- missing `healthcheck:`
- likely running as root (missing `user:`)

Designed to be **CI-friendly** (non-zero exit code when findings exist).

## Quickstart

### Run via npx

```bash
npx configsentry ./docker-compose.yml
```

### Run from source

```bash
npm install
npm run build
node dist/cli.js ./docker-compose.yml
```

### JSON output (CI / tooling)

```bash
node dist/cli.js ./docker-compose.yml --json
```

### SARIF output (GitHub Code Scanning)

```bash
node dist/cli.js ./docker-compose.yml --sarif > configsentry.sarif.json
```

## Baselines (incremental adoption)

Generate a baseline (captures current findings):

```bash
node dist/cli.js ./docker-compose.yml --write-baseline .configsentry-baseline.json
```

Then suppress baseline findings in CI:

```bash
node dist/cli.js ./docker-compose.yml --baseline .configsentry-baseline.json
```

## Docs

- GitHub Action usage examples: [`docs/action-usage.md`](docs/action-usage.md)
- Compatibility & scope: [`docs/compatibility.md`](docs/compatibility.md)
- Launch pack (links + demo assets): [`docs/launch-pack.md`](docs/launch-pack.md)

## Use in GitHub Actions (copy/paste)

More examples: [`docs/action-usage.md`](docs/action-usage.md)

### Option A: run from source

```yml
name: Compose lint
on: [push, pull_request]

jobs:
  configsentry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci
      - run: npm run build
      - run: node dist/cli.js ./docker-compose.yml
```

### Option B: use the ConfigSentry composite action

```yml
name: Compose lint
on: [push, pull_request]

permissions:
  contents: read
  security-events: write   # required if upload-sarif=true (Code Scanning)

jobs:
  configsentry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: alfredMorgenstern/configsentry@v0.0.18
        with:
          target: .
          # optional: baseline: .configsentry-baseline.json
          sarif: true
          upload-sarif: false

      # If you set upload-sarif: true, also ensure the workflow has:
      # permissions:
      #   security-events: write
```

**Note (consumer repos):** your repo does **not** need a `package-lock.json`. The action installs/builds ConfigSentry from the action package itself.

> Tip: pin to a tag (like `v0.0.18`) for reproducible builds.

## Exit codes
- `0` no findings
- `2` findings present
- `1` error

## Example

```bash
node dist/cli.js ./example.docker-compose.yml
```

## Next steps
- GitHub Marketplace listing (Action)
- more rules (policy packs for common stacks)
- PR annotations/comments (optional)
- autofix mode (`--fix`) for safe transforms
