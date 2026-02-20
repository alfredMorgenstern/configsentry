# Troubleshooting / FAQ

## Exit codes

ConfigSentry uses these exit codes:

- `0` — no findings (after baseline suppression)
- `2` — findings present
- `1` — error (e.g. invalid YAML)

This is intentional so you can distinguish **policy findings** from **tool failures**.

## “I want SARIF / Code Scanning, but I don’t want CI to fail”

In GitHub Actions:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.18
  with:
    target: .
    sarif: true
    upload-sarif: true
    fail-on-findings: false
```

Also ensure the workflow has:

```yml
permissions:
  contents: read
  security-events: write
```

## “Why is it failing in the Action? My repo has no package-lock.json”

The composite action installs/builds **ConfigSentry inside the action package** (via `github.action_path`).

Your consumer repository does **not** need:
- `package-lock.json`
- `npm ci`
- a Node project at all

If it fails, check the workflow has `actions/checkout@v4` before running the action.

## “How do I lint a directory?”

Both CLI and Action accept a file or a directory as the target.

CLI:

```bash
npx configsentry .
```

Action:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.18
  with:
    target: .
```

## “I have findings, but I want incremental adoption”

Use **baselines**:

- Generate once: `--write-baseline .configsentry-baseline.json`
- Use in CI: `--baseline .configsentry-baseline.json`

Details: [`docs/baselines.md`](baselines.md)

## “I hit a false positive / want a new rule”

Please open an issue with a **sanitized minimal Compose snippet** and what you expected:

https://github.com/alfredMorgenstern/configsentry/issues

Tip: Remove secrets, hostnames, and private image names.
