import test from 'node:test';
import assert from 'node:assert/strict';

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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
    stderr: res.stderr ?? '',
    exitCode: typeof res.status === 'number' ? res.status : 1,
  };
}

test('supports --output for --format json', () => {
  const out = path.join(os.tmpdir(), `configsentry-test-${Date.now()}.json`);
  try {
    const res = runCli(['--format', 'json', '--output', out, '--target', './example.docker-compose.yml']);
    assert.equal(res.exitCode, 2);
    assert.equal(res.stdout.trim(), '');
    const raw = fs.readFileSync(out, 'utf8');
    const parsed = JSON.parse(raw);
    assert.ok(Array.isArray(parsed.findings));
  } finally {
    try { fs.unlinkSync(out); } catch {}
  }
});

test('rejects --output with pretty output', () => {
  const out = path.join(os.tmpdir(), `configsentry-test-${Date.now()}.txt`);
  const res = runCli(['--output', out, '--target', './example.docker-compose.yml']);
  assert.equal(res.exitCode, 1);
  assert.ok(res.stderr.includes('--output'));
});
