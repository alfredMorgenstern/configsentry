# Launch Pack (copy/paste)

## 1) Filter-safe launch post (Reddit)

(When Reddit filters are trigger-happy: keep the **post itself discussion-first**, then drop links in the **first comment**.)

### Ultra-low-promo variant (for strict subs like r/docker)

**Post body (no tool name, no links):**

I keep seeing the same few Docker Compose mistakes cause real headaches (security + reliability).

Examples:
- `privileged`, docker socket mounts
- host namespaces (`network_mode: host`, `pid: host`)
- binding DB ports to `0.0.0.0`
- missing healthchecks/restart policies
- running as root
- mounting host `/etc`, `/proc`, `/sys`

What are the Compose “footguns” you’ve actually been burned by, and what would you want a simple checker to flag (or *not* flag)?

**If someone asks for the tool:** reply with links in a comment (repo + npm + docs).

### Suggested titles (pick one)
- "Tiny linter for docker-compose.yml footguns (privileged, docker.sock, host mounts)"
- "What are your worst docker-compose.yml footguns? I built a tiny linter to catch mine"
- "Compose guardrails: catching high-impact security/ops mistakes before they ship"

**Post body draft:**

> I built **ConfigSentry** — a tiny linter for `docker-compose.yml` that catches high-impact security + ops footguns.
>
> Examples it flags:
> - `privileged: true`, `cap_add: [ALL]`
> - `network_mode: host`, `pid: host`, `ipc: host`
> - docker socket mounts, host root mounts, host `/dev` mounts
> - sensitive host mounts (`/etc`, `/proc`, `/sys`)
> - exposed sensitive ports (Postgres/Redis/etc)
> - missing `restart:` / `healthcheck:` / `user:`
>
> Quick try:
> ```bash
> npx configsentry ./docker-compose.yml
> ```
>
> What other Compose “footguns” have bitten you in production/self-hosted setups?

**First comment (links) draft:**

> Repo: https://github.com/alfredMorgenstern/configsentry
> npm: https://www.npmjs.com/package/configsentry
> Action + Code Scanning SARIF docs: https://github.com/alfredMorgenstern/configsentry/blob/master/docs/action-usage.md

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
- r/docker (usually less filter-happy than r/selfhosted)
- r/selfhosted (lots of compose files, but filters can be aggressive)
- r/devops (if positioned as “guardrails in CI”)
- Hacker News “Show HN” (if you have a clean demo + GIF)
- GitHub Marketplace (Action) listing later

## 6) Modmail / appeal template (when removed)

Subject: Post removed by filters — OSS Compose linter

Body:
> Hi mods — my post about an open-source tool (ConfigSentry) got removed by Reddit’s spam filters.
> It’s a small linter for docker-compose.yml that flags high-impact footguns (privileged, docker socket mounts, sensitive host mounts, exposed DB ports).
> I’m not selling anything; just sharing the repo and asking for feedback.
> Could you approve the post if it fits the sub rules? Thanks!
