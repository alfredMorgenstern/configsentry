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

```bash
npm install
npm run build
node dist/cli.js ./docker-compose.yml
```

### JSON output (CI / tooling)

```bash
node dist/cli.js ./docker-compose.yml --json
```

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
