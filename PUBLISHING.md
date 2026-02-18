# Publishing

This repo is prepared for npm publishing; the remaining work is authentication + `npm publish`.

## Prereqs
- npm account that owns the package name `configsentry`
- logged in locally: `npm login`

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
3) Ensure package is publishable:
   - `package.json` must have `"private": false`
4) Dry run:
   ```bash
   npm pack
   ```
5) Publish:
   ```bash
   npm publish
   ```
   (publishConfig sets access=public)

## Notes
- The CLI entrypoint is `dist/cli.js` and is exposed as `configsentry` via `bin`.
- After publishing, docs should recommend:
  - `npx configsentry ./docker-compose.yml`
  - or `npm i -g configsentry`
