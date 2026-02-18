# GitHub Action usage

This repository ships a **composite action** (see `action.yml`) so you can run ConfigSentry without installing it globally.

## Minimal workflow (no SARIF upload)

```yml
name: ConfigSentry
on: [push, pull_request]

permissions:
  contents: read

jobs:
  configsentry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: alfredMorgenstern/configsentry@v0.0.9
        with:
          target: .
          sarif: true
          upload-sarif: false
          fail-on-findings: true
```

## Upload SARIF to GitHub Code Scanning

To upload SARIF, you must grant `security-events: write`.

```yml
name: ConfigSentry (Code Scanning)
on: [push, pull_request]

permissions:
  contents: read
  security-events: write

jobs:
  configsentry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: alfredMorgenstern/configsentry@v0.0.9
        with:
          target: .
          sarif: true
          upload-sarif: true
          fail-on-findings: false   # optional, prevents CI from failing while still surfacing alerts
```

## Baselines (incremental adoption)

Generate a baseline once:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.9
  with:
    target: .
    write-baseline: .configsentry-baseline.json
    fail-on-findings: false
```

Then use it in CI:

```yml
- uses: alfredMorgenstern/configsentry@v0.0.9
  with:
    target: .
    baseline: .configsentry-baseline.json
    sarif: true
    upload-sarif: true
```
