# Launch Pack (copy/paste)

## 1) 10-line launch post (Reddit / LinkedIn-ish)

> I built **ConfigSentry** — a tiny linter for `docker-compose.yml` that catches high-impact security + ops footguns.
>
> It flags things like:
> - `privileged: true`, `cap_add: [ALL]`
> - `network_mode: host`, `pid: host`, `ipc: host`
> - docker socket mounts, host root mounts, host `/dev` mounts
> - exposed sensitive ports (Postgres/Redis/etc)
> - missing `restart:` / `healthcheck:` / `user:`
>
> Run it in 5 seconds:
> ```bash
> npx configsentry ./docker-compose.yml
> ```
> GitHub Action + SARIF Code Scanning supported.
>
> Repo: https://github.com/alfredMorgenstern/configsentry

## 2) 30-second demo snippet (for screenshots)

Create `docker-compose.yml`:

```yml
services:
  db:
    image: postgres:16
    ports:
      - "5432:5432"           # public bind
  runner:
    image: docker:cli
    privileged: true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /dev:/dev
    cap_add: ["ALL"]
    network_mode: host
```

Then:

```bash
npx configsentry ./docker-compose.yml
```

## 3) One-paragraph positioning

ConfigSentry is a **developer-first Compose guardrail**. It’s not a full security scanner — it’s a fast, CI-friendly check that prevents the handful of misconfigurations that cause the biggest outages and security incidents in self-hosted and small-team deployments.

## 4) CTA options
- “If you want a rule for X, open an issue and I’ll add it.”
- “If this saves you from a footgun, star the repo so others find it.”

## 5) Where to post first (highest ROI)
- r/selfhosted (lots of compose files)
- r/docker
- Hacker News “Show HN” (if you have a clean demo + GIF)
- GitHub Marketplace (Action) listing later
