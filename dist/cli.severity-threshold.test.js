import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const here = process.cwd();
function runCli(args) {
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
test('--severity-threshold filters findings and can make exit code 0', () => {
    const tmp = path.join(os.tmpdir(), `configsentry-threshold-${Date.now()}.yml`);
    const compose = `services:\n  app:\n    image: nginx:alpine\n    user: \"1000:1000\"\n`;
    try {
        fs.writeFileSync(tmp, compose, 'utf8');
        // With medium threshold, we should still get missing restart/healthcheck (MEDIUM).
        const med = runCli(['--format', 'json', '--severity-threshold', 'medium', '--target', tmp]);
        assert.equal(med.exitCode, 2);
        const medParsed = JSON.parse(med.stdout);
        assert.ok(medParsed.findings.length > 0);
        assert.ok(medParsed.findings.every((f) => f.severity === 'medium' || f.severity === 'high'));
        // With high threshold, this file should have no findings (we set user: so no HIGH runs-as-root).
        const high = runCli(['--format', 'json', '--severity-threshold', 'high', '--target', tmp]);
        assert.equal(high.exitCode, 0);
        const highParsed = JSON.parse(high.stdout);
        assert.equal(highParsed.findings.length, 0);
    }
    finally {
        try {
            fs.unlinkSync(tmp);
        }
        catch { }
    }
});
