# Exposed database ports (e.g. `5432:5432`) — why it’s risky and safer defaults

A classic Compose footgun is exposing a database port on **all interfaces**.

Example:

```yml
services:
  db:
    image: postgres:16
    ports:
      - "5432:5432"
```

This binds to `0.0.0.0` by default, which can make the database reachable from:
- your LAN
- the internet (if you’re on a VPS or have port forwarding)
- other networks you didn’t think about

## Safer patterns

### 1) Bind to localhost

Only expose to the host machine:

```yml
ports:
  - "127.0.0.1:5432:5432"
```

### 2) Don’t publish the port at all

If only other containers need access:

```yml
services:
  db:
    image: postgres:16
    # no ports:
    networks:
      - internal

networks:
  internal:
    internal: true
```

### 3) Put the DB behind a reverse proxy / tunnel (when remote access is needed)

Prefer:
- VPN (WireGuard)
- SSH tunnel
- authenticated DB proxy

…over exposing the DB port directly.

## How ConfigSentry helps

ConfigSentry flags common sensitive ports (Postgres, MySQL, Redis, MongoDB, Elasticsearch) when they’re bound to all interfaces.

Run:

```bash
npx configsentry ./docker-compose.yml
```

If you need a port exposed, bind to `127.0.0.1` or document why it’s safe.
