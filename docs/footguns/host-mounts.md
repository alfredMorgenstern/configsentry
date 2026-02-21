# Risky host mounts (`/`, `/etc`, `/proc`, `/sys`, `/dev`) — what they imply

Bind-mounting sensitive host paths into containers is often equivalent to “break glass” access.

These mounts can expose host secrets, kernel interfaces, or devices and are a common escape path if the container is compromised.

## High-risk examples

### Host root (`/`)

```yml
volumes:
  - /:/host
```

### Host config (`/etc`)

```yml
volumes:
  - /etc:/host-etc:ro
```

### Kernel/process interfaces (`/proc`, `/sys`)

```yml
volumes:
  - /proc:/host-proc:ro
  - /sys:/host-sys:ro
```

### Devices (`/dev`)

```yml
volumes:
  - /dev:/dev
```

## Safer alternatives

- Mount **only the single file** you need, not whole directories.
- Prefer **read-only** mounts when possible (`:ro`).
- Use purpose-built exporters/APIs for metrics rather than mounting `/proc` and `/sys` into arbitrary app containers.
- If a container truly needs host-level access, isolate it:
  - dedicated host
  - minimal other workloads
  - clear documentation (“this is privileged infrastructure”)

## How ConfigSentry helps

ConfigSentry flags these risky mounts (short + long syntax) so they don’t creep in unnoticed.

Run:

```bash
npx configsentry ./docker-compose.yml
```
