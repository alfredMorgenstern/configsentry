# Publishing (when ready)

This repo is intentionally **not published to npm yet**.

## Prereqs
- npm account that owns the package name `configsentry`
- logged in locally: `npm login`

## Steps
1) Ensure tests pass:
   ```bash
   npm ci
   npm run build
   npm test
   ```
2) Make package publishable (currently private):
   - set `"private": false` in `package.json`
3) Dry run:
   ```bash
   npm pack
   ```
4) Publish:
   ```bash
   npm publish --access public
   ```

## Notes
- The CLI entrypoint is `dist/cli.js` and is exposed as `configsentry` via `bin`.
- After publishing, docs should recommend:
  - `npx configsentry ./docker-compose.yml`
  - or `npm i -g configsentry`
