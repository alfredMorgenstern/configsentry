# Draft: r/selfhosted launch post — ConfigSentry

Title ideas:
- "ConfigSentry: a tiny linter for docker-compose.yml (GitHub Action + Code Scanning SARIF)"
- "I built a guardrail linter for docker-compose.yml footguns (privileged, docker.sock, exposed DB ports…)"

Post (copy/paste):

---

I built **ConfigSentry** — a tiny linter for `docker-compose.yml` that catches high-impact security + ops footguns.

It flags things like:
- `privileged: true`, `cap_add: [ALL]`
- `network_mode: host`, `pid: host`, `ipc: host`
- docker socket mounts, host root mounts, host `/dev` mounts
- exposed sensitive ports (Postgres/Redis/etc)
- missing `restart:` / `healthcheck:` / `user:`

Run it in 5 seconds:
```bash
npx configsentry ./docker-compose.yml
```

If you want it in CI: there’s a **GitHub Action** and it can upload SARIF to **GitHub Code Scanning**.

Repo: https://github.com/alfredMorgenstern/configsentry
npm: https://www.npmjs.com/package/configsentry

If there’s a rule you’d like to see (or if you hit false positives), open an issue and I’ll adjust.
