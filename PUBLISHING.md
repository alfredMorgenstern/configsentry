# Publishing

This repo is prepared for npm publishing + GitHub release tagging; the remaining work is authentication + pushing tags.

## Prereqs
- npm account that owns the package name `configsentry`
- logged in locally: `npm login`

## Release checklist (quick)

```bash
# 1) tests
npm ci && npm run build && npm test

# 2) bump + commit
# (manual edit package.json OR npm version patch)

# 3) sanity check tarball
npm pack --dry-run

# 4) publish
npm publish

# 5) push tag + confirm GitHub Release workflow
git push origin --follow-tags
```

## Steps
0) Confirm package name availability (optional):
   ```bash
   npm view configsentry version
   ```

1) Ensure tests pass:
   ```bash
   npm ci
   npm run build
   npm test
   ```

2) Login:
   ```bash
   npm login
   npm whoami
   ```

3) Bump version (choose ONE approach):
   - Manual: edit `package.json` version
   - npm-managed:
     ```bash
     npm version patch   # or minor/major
     ```
     This creates a git commit + tag like `v0.0.14`.

4) Dry run the package contents:
   ```bash
   npm pack
   tar -tf configsentry-*.tgz | head
   ```

5) Publish to npm:
   ```bash
   npm publish
   ```
   (`publishConfig` sets access=public)

6) Push git tag + create GitHub Release:
   ```bash
   git push origin --follow-tags
   ```
   The repo has a workflow that creates a GitHub Release on `v*` tags (`.github/workflows/release.yml`).

## Notes
- The CLI entrypoint is `dist/cli.js` and is exposed as `configsentry` via `bin`.
- After publishing, docs should recommend:
  - `npx configsentry ./docker-compose.yml`
  - or `npm i -g configsentry`
