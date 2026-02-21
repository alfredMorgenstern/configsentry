import test from 'node:test';
import assert from 'node:assert/strict';

import { spawnSync } from 'node:child_process';
import path from 'node:path';

const here = process.cwd();

function runCli(args: string[]) {
  const cliPath = path.join(here, 'dist', 'cli.js');
  const res = spawnSync(process.execPath, [cliPath, ...args], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    stdout: res.stdout ?? '',
    exitCode: typeof res.status === 'number' ? res.status : 1,
  };
}

test('supports --format json', () => {
  const res = runCli(['--format', 'json', '--target', './example.docker-compose.yml']);
  assert.equal(res.exitCode, 2);
  const parsed = JSON.parse(res.stdout);
  assert.ok(Array.isArray(parsed.targetPaths));
  assert.ok(Array.isArray(parsed.findings));
  assert.equal(typeof parsed.suppressedCount, 'number');
});

test('supports --format sarif', () => {
  const res = runCli(['--format', 'sarif', '--target', './example.docker-compose.yml']);
  assert.equal(res.exitCode, 2);
  const parsed = JSON.parse(res.stdout);
  assert.equal(parsed.version, '2.1.0');
  assert.ok(Array.isArray(parsed.runs));
});

test('rejects invalid --format', () => {
  const res = runCli(['--format', 'nope', '--target', './example.docker-compose.yml']);
  assert.equal(res.exitCode, 1);
});
