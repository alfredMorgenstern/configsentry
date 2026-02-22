# Draft: Reddit ops touchpoint (v0.0.25) — baseline onboarding + CI-friendly output

## Suggested subreddits
- r/selfhosted (follow-up comment / small post)
- r/docker
- r/devops (maybe; keep it small)

## Title options
- "Update: ConfigSentry now has baseline onboarding + CI-friendly machine output (SARIF/JSON)"
- "OSS update: incremental adoption (baselines) for docker-compose.yml linter"

## Post body (copy/paste)

Quick update on **ConfigSentry** (open-source linter for `docker-compose.yml` footguns).

Two things that made it much easier to adopt in an existing repo:

1) **Baselines** for incremental rollout
- generate once to capture today’s findings
- then CI only fails on *new* findings

2) CI-friendly machine output
- `--format json|sarif`
- `--output <file>` to write output without shell redirection

### 60-second onboarding (existing repo)
Start non-blocking, generate a baseline, commit it:
```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    write-baseline: .configsentry-baseline.json
    fail-on-findings: false
```

Then run in CI using the baseline (still non-blocking at first):
```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    baseline: .configsentry-baseline.json
    sarif: true
    upload-sarif: true
    fail-on-findings: false
```

After you’ve fixed some issues (or you’re ready), flip to blocking on new findings:
- keep `baseline:`
- set `fail-on-findings: true`

Local run:
```bash
npx configsentry@0.0.25 ./docker-compose.yml
```

If anyone’s willing to share **sanitized real-world compose snippets** (even partial), I’d love to test against them (especially Traefik/NPM label-heavy stacks + multi-service apps).

Repo + docs: (add link)

## First comment (links)
Repo: https://github.com/alfredMorgenstern/configsentry
npm: https://www.npmjs.com/package/configsentry
Baselines doc: https://github.com/alfredMorgenstern/configsentry/blob/master/docs/baselines.md
Release v0.0.25: https://github.com/alfredMorgenstern/configsentry/releases/tag/v0.0.25
