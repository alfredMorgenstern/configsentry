# Baselines (incremental adoption)

ConfigSentry supports **baselines** so you can adopt it incrementally:

- First run: generate a baseline that captures *today’s* findings.
- Ongoing CI: suppress findings that are already in the baseline.
- When you improve the Compose config: regenerate the baseline (or delete it if you want to go “strict”).

This is especially useful when introducing ConfigSentry to an existing repo without breaking CI.

## How it works

A baseline file stores a snapshot of findings.

When you run ConfigSentry with `--baseline <file>`, it will:
- suppress findings that match entries in the baseline
- still report **new** findings
- use the usual exit codes (0 / 2 / 1) *after* suppression

## Local usage

Generate a baseline:

```bash
npx configsentry ./docker-compose.yml --write-baseline .configsentry-baseline.json
```

Use a baseline:

```bash
npx configsentry ./docker-compose.yml --baseline .configsentry-baseline.json
```

## GitHub Action usage

### Generate baseline once

Run this on a branch and commit the generated file:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    write-baseline: .configsentry-baseline.json
    fail-on-findings: false
```

### Use baseline in CI

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    baseline: .configsentry-baseline.json
    sarif: true
    upload-sarif: true
    fail-on-findings: false
```

## Recommended onboarding (existing repo)

Goal: get signal immediately, without breaking CI on day 1.

1) **Start in non-blocking mode**, generate a baseline, and commit it:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    write-baseline: .configsentry-baseline.json
    fail-on-findings: false
```

2) **Enable ongoing scanning** using the baseline (still non-blocking at first):

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    baseline: .configsentry-baseline.json
    sarif: true
    upload-sarif: true
    fail-on-findings: false
```

3) After you’ve fixed some issues (or you’re ready to enforce it), flip to **blocking** mode:
- keep `baseline:` (to avoid old issues breaking builds)
- set `fail-on-findings: true` (to block on *new* findings)

## Walkthrough

If you want a concrete, end-to-end rollout recipe, see:
- [`docs/baseline-walkthrough.md`](baseline-walkthrough.md)

## Tips

- Keep the baseline file **in the repo** so it’s reviewed like code.
- If ConfigSentry changes its rules, you might need to regenerate the baseline.
- If you want strict mode: remove `baseline:` and set `fail-on-findings: true`.
