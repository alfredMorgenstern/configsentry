# ConfigSentry (MVP)

Developer-first guardrails for **docker-compose.yml** (security + ops footguns).

## What it does
ConfigSentry reads a Compose file and flags common **high-impact** mistakes:
- privileged containers (`privileged: true`)
- Docker socket mounts (`/var/run/docker.sock`)
- sensitive ports exposed publicly (e.g. `5432:5432` instead of `127.0.0.1:5432:5432`)
- missing `restart:` policy
- missing `healthcheck:`
- likely running as root (missing `user:`)

Designed to be **CI-friendly** (non-zero exit code when findings exist).

## Quickstart

### Run via npx (after npm publish)

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

## Use in GitHub Actions (copy/paste)

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
  security-events: write   # only needed if upload-sarif=true

jobs:
  configsentry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: alfredMorgenstern/configsentry@v0.0.8
        with:
          compose-file: docker-compose.yml
          sarif: true
          upload-sarif: false
```

> Tip: pin to a tag (like `v0.0.8`) for reproducible builds.

## Exit codes
- `0` no findings
- `2` findings present
- `1` error

## Example

```bash
node dist/cli.js ./example.docker-compose.yml
```

## Next steps
- publish as `configsentry` on npm
- GitHub Action wrapper
- SARIF output
- autofix mode (`--fix`) for safe transforms
