# Repo test: yeasy/docker_practice

- date: 2026-02-22T12:31:05+01:00
- configsentry: 0.0.27
- clone: https://github.com/yeasy/docker_practice

## Safety
- Repo treated as untrusted. No repo code executed.
- Only reading YAML files + running configsentry binary.

## Compose files found
- ./docker-compose.yml
- ./19_cases/ci/drone/docker-compose.yml
- ./14_etcd/demo/cluster/docker-compose.yml
- ./10_compose/demo/wordpress/docker-compose.yml
- ./10_compose/demo/django/docker-compose.yml
- ./10_compose/demo/app/docker-compose.yml
- ./06_repository/demo/docker-compose.yml

## Results

### ./docker-compose.yml
- findings: 22 (high:5, medium:12, low:5)
- top rules: compose.missing-restart×5, compose.missing-healthcheck×5, compose.runs-as-root×5, compose.missing-read-only×5, compose.image-floating-tag×2

High severity examples:
- compose.runs-as-root: Container likely runs as root (gitbook-build)
- compose.runs-as-root: Container likely runs as root (gitbook-server)
- compose.runs-as-root: Container likely runs as root (gitbook-offline)
- compose.runs-as-root: Container likely runs as root (vuepress-offline)
- compose.runs-as-root: Container likely runs as root (development)

### ./19_cases/ci/drone/docker-compose.yml
- findings: 7 (high:3, medium:2, low:2)
- top rules: compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.docker-socket×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (drone-server)
- compose.docker-socket: Docker socket mounted (drone-agent)
- compose.runs-as-root: Container likely runs as root (drone-agent)

### ./14_etcd/demo/cluster/docker-compose.yml
- findings: 12 (high:3, medium:6, low:3)
- top rules: compose.missing-restart×3, compose.missing-healthcheck×3, compose.runs-as-root×3, compose.missing-read-only×3

High severity examples:
- compose.runs-as-root: Container likely runs as root (node1)
- compose.runs-as-root: Container likely runs as root (node2)
- compose.runs-as-root: Container likely runs as root (node3)

### ./10_compose/demo/wordpress/docker-compose.yml
- findings: 10 (high:5, medium:3, low:2)
- top rules: compose.hardcoded-secret×3, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.image-floating-tag×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (db)
- compose.hardcoded-secret: Possible hardcoded secret in compose environment (db)
- compose.hardcoded-secret: Possible hardcoded secret in compose environment (db)
- compose.runs-as-root: Container likely runs as root (wordpress)
- compose.hardcoded-secret: Possible hardcoded secret in compose environment (wordpress)

### ./10_compose/demo/django/docker-compose.yml
- findings: 10 (high:3, medium:5, low:2)
- top rules: compose.missing-restart×2, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.hardcoded-secret×1, compose.image-floating-tag×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (db)
- compose.hardcoded-secret: Possible hardcoded secret in compose environment (db)
- compose.runs-as-root: Container likely runs as root (web)

### ./10_compose/demo/app/docker-compose.yml
- findings: 8 (high:2, medium:4, low:2)
- top rules: compose.missing-restart×2, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2

High severity examples:
- compose.runs-as-root: Container likely runs as root (web)
- compose.runs-as-root: Container likely runs as root (redis)

### ./06_repository/demo/docker-compose.yml
- findings: 4 (high:1, medium:2, low:1)
- top rules: compose.missing-restart×1, compose.missing-healthcheck×1, compose.runs-as-root×1, compose.missing-read-only×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (registry)
