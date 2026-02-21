# Draft: request real-world docker-compose examples (feedback)

## Goal
Get 2–5 real compose snippets to test rules + baseline UX. Low-promo, discussion-first.

## Suggested subreddit
- r/selfhosted (already launched there)
- or r/docker (keep it humble)

## Post title options
- "Looking for real-world docker-compose.yml examples to test a tiny linter (open source)"
- "What’s your most common docker-compose security/ops footgun? (I’m building a linter)"

## Post body (no links; add links in first comment)

I’m working on a small open-source linter for `docker-compose.yml` that flags common security/ops footguns (privileged containers, docker.sock mounts, exposed DB ports, missing restart/healthcheck/user, etc.).

I’m looking for **a few real-world compose examples** (sanitized) to test against:
- multi-service stacks (db + app + reverse proxy)
- long/short volume syntax
- networks + labels + Traefik/Nginx Proxy Manager
- anything you think is “normal in the wild”

If you’re willing to help, you can paste:
- a **small snippet** (just services/volumes/ports) or
- a link to a public gist/repo

Please remove secrets/hostnames.

Questions:
1) What rule would be most valuable for you?
2) What kind of false positives would make you stop using a tool like this?

## First comment (with links)
Repo: https://github.com/alfredMorgenstern/configsentry
Try it: `npx configsentry ./docker-compose.yml`
