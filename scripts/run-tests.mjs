import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const distDir = path.join(root, 'dist');

let entries;
try {
  entries = await fs.readdir(distDir);
} catch {
  console.error(`dist/ not found at ${distDir}. Did you run the build step?`);
  process.exit(1);
}

const testFiles = entries
  .filter((f) => f.endsWith('.test.js'))
  .map((f) => path.join(distDir, f))
  .sort();

if (testFiles.length === 0) {
  console.error('No test files found in dist/ (expected *.test.js).');
  process.exit(1);
}

const res = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit',
});

process.exit(typeof res.status === 'number' ? res.status : 1);
