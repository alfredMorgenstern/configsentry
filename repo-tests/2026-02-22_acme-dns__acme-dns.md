# Repo test: acme-dns/acme-dns

- date: 2026-02-22T12:31:32+01:00
- configsentry: 0.0.27
- clone: https://github.com/acme-dns/acme-dns

## Safety
- Repo treated as untrusted. No repo code executed.
- Only reading YAML files + running configsentry binary.

## Compose files found
- ./test/e2e/docker-compose.yml
- ./docker-compose.yml

## Results

### ./test/e2e/docker-compose.yml
- findings: 8 (high:2, medium:4, low:2)
- top rules: compose.missing-restart×2, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2

High severity examples:
- compose.runs-as-root: Container likely runs as root (acme-dns)
- compose.runs-as-root: Container likely runs as root (tester)

### ./docker-compose.yml
- findings: 5 (high:1, medium:3, low:1)
- top rules: compose.missing-restart×1, compose.missing-healthcheck×1, compose.runs-as-root×1, compose.missing-read-only×1, compose.image-floating-tag×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (acmedns)
