# Compatibility & scope

ConfigSentry is a **static linter** for Docker Compose files.

It aims to be:
- **Compose-version tolerant** (works across common v2/v3 style files)
- **Schema-lenient** (unknown keys should not break the run)
- **CI-friendly** (machine output + consistent exit codes)

## Inputs

ConfigSentry accepts either:
- a **file** path (e.g. `./docker-compose.yml`), or
- a **directory** path (ConfigSentry will look for a Compose file in that directory).

Examples:

```bash
npx configsentry ./docker-compose.yml
npx configsentry .
```

## Compose feature coverage (MVP)

### What ConfigSentry looks at

Primarily **service-level** security + operations footguns, such as:
- privilege escalation (`privileged: true`, `cap_add: [ALL]`)
- host namespace sharing (`network_mode: host`, `pid: host`, `ipc: host`)
- risky mounts (`/var/run/docker.sock`, host root mounts, host `/dev`)
- sensitive ports exposed publicly
- basic ops hygiene (`restart:`, `healthcheck:`, `user:`)

### What ConfigSentry intentionally does *not* do (yet)

- Validate the entire Compose schema.
- Enforce a full policy framework (deny/allow lists, org-wide configs).
- Resolve or merge multiple Compose files (e.g. `docker compose -f a -f b`).
- Evaluate runtime environment (this is static analysis, not container runtime scanning).

## Versions

### Node.js
- Intended to run on modern Node.js (Action uses the Node version provided by the runner).

### Docker Compose formats
- Intended to work with typical Compose files used by `docker compose`.

If you find a Compose key that should be supported (or a false positive), please open an issue with a **sanitized** minimal example:
- https://github.com/alfredMorgenstern/configsentry/issues
