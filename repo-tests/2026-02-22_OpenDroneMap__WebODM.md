# Repo test: OpenDroneMap/WebODM

- date: 2026-02-22T12:31:15+01:00
- configsentry: 0.0.27
- clone: https://github.com/OpenDroneMap/WebODM

## Safety
- Repo treated as untrusted. No repo code executed.
- Only reading YAML files + running configsentry binary.

## Compose files found
- ./docker-compose.yml
- ./docker-compose.worker-memory.yml
- ./docker-compose.worker-cpu.yml
- ./docker-compose.ssl.yml
- ./docker-compose.ssl-manual.yml
- ./docker-compose.settings.yml
- ./docker-compose.nodeodm.yml
- ./docker-compose.nodeodm.gpu.nvidia.yml
- ./docker-compose.nodeodm.gpu.intel.yml
- ./docker-compose.nodemicmac.yml
- ./docker-compose.ipv6.yml
- ./docker-compose.dev.yml
- ./docker-compose.build.yml

## Results

### ./docker-compose.yml
- findings: 15 (high:4, medium:7, low:4)
- top rules: compose.missing-healthcheck×4, compose.runs-as-root×4, compose.missing-read-only×4, compose.image-floating-tag×3

High severity examples:
- compose.runs-as-root: Container likely runs as root (db)
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (broker)
- compose.runs-as-root: Container likely runs as root (worker)

### ./docker-compose.worker-memory.yml
- findings: 4 (high:1, medium:2, low:1)
- top rules: compose.missing-restart×1, compose.missing-healthcheck×1, compose.runs-as-root×1, compose.missing-read-only×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (worker)

### ./docker-compose.worker-cpu.yml
- findings: 4 (high:1, medium:2, low:1)
- top rules: compose.missing-restart×1, compose.missing-healthcheck×1, compose.runs-as-root×1, compose.missing-read-only×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (worker)

### ./docker-compose.ssl.yml
- findings: 4 (high:1, medium:2, low:1)
- top rules: compose.missing-restart×1, compose.missing-healthcheck×1, compose.runs-as-root×1, compose.missing-read-only×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)

### ./docker-compose.ssl-manual.yml
- findings: 4 (high:1, medium:2, low:1)
- top rules: compose.missing-restart×1, compose.missing-healthcheck×1, compose.runs-as-root×1, compose.missing-read-only×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)

### ./docker-compose.settings.yml
- findings: 8 (high:2, medium:4, low:2)
- top rules: compose.missing-restart×2, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (worker)

### ./docker-compose.nodeodm.yml
- findings: 7 (high:2, medium:3, low:2)
- top rules: compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.missing-restart×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (node-odm)

### ./docker-compose.nodeodm.gpu.nvidia.yml
- findings: 7 (high:2, medium:3, low:2)
- top rules: compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.missing-restart×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (node-odm)

### ./docker-compose.nodeodm.gpu.intel.yml
- findings: 7 (high:2, medium:3, low:2)
- top rules: compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.missing-restart×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (node-odm)

### ./docker-compose.nodemicmac.yml
- findings: 8 (high:2, medium:4, low:2)
- top rules: compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2, compose.missing-restart×1, compose.image-floating-tag×1

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (node-micmac-1)

### ./docker-compose.ipv6.yml
- findings: 0 (high:0, medium:0, low:0)

### ./docker-compose.dev.yml
- findings: 8 (high:2, medium:4, low:2)
- top rules: compose.missing-restart×2, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2

High severity examples:
- compose.runs-as-root: Container likely runs as root (webapp)
- compose.runs-as-root: Container likely runs as root (worker)

### ./docker-compose.build.yml
- findings: 8 (high:2, medium:4, low:2)
- top rules: compose.missing-restart×2, compose.missing-healthcheck×2, compose.runs-as-root×2, compose.missing-read-only×2

High severity examples:
- compose.runs-as-root: Container likely runs as root (db)
- compose.runs-as-root: Container likely runs as root (webapp)
