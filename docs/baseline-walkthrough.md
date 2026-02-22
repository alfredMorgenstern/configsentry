# Baseline walkthrough (end-to-end)

This page shows a concrete, end-to-end way to roll ConfigSentry out in an existing repository **without breaking CI on day 1**.

You’ll do this in two phases:
1) generate a baseline (non-blocking)
2) enforce “no regressions” (blocking on *new* findings)

## Prereqs

- Your repo contains one or more Compose files.
- If you use SARIF upload, your workflow needs:

```yml
permissions:
  contents: read
  security-events: write
```

## Phase 1 — Generate a baseline (non-blocking)

Create a workflow (or temporarily add a step) that generates a baseline file.

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    write-baseline: .configsentry-baseline.json
    fail-on-findings: false
```

Run it once on a branch.

Then **commit** the generated `.configsentry-baseline.json` file to your repo:

```bash
git add .configsentry-baseline.json
git commit -m "chore: add ConfigSentry baseline"
```

## Phase 2 — Run in CI using the baseline

Now switch the workflow to use the baseline:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    baseline: .configsentry-baseline.json
    sarif: true
    upload-sarif: true
    fail-on-findings: false
```

At this point, CI should stay green, but you will still see:
- SARIF results in GitHub Code Scanning
- “new findings” in the job output

## Phase 3 — Enforce “no new findings” (recommended)

When you’re ready to prevent regressions:

- keep `baseline: .configsentry-baseline.json`
- set `fail-on-findings: true`

```yml
- uses: alfredMorgenstern/configsentry@v0.0.25
  with:
    target: .
    baseline: .configsentry-baseline.json
    sarif: true
    upload-sarif: true
    fail-on-findings: true
```

This mode blocks CI only when **new** findings appear.

## Notes

- If you improve your Compose config and want to “unlock” checks, regenerate the baseline.
- If ConfigSentry adds new rules, you may need to regenerate baselines in older repos.

## Real example

A minimal consumer repo was used to validate copy/paste workflows:
- https://github.com/alfredMorgenstern/configsentry-consumer-test
