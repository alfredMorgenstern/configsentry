import test from 'node:test';
import assert from 'node:assert/strict';
import { runRules } from './rules.js';
test('detects privileged container', () => {
    const compose = { services: { app: { privileged: true } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.privileged' && f.service === 'app'));
});
test('detects sensitive port exposed', () => {
    const compose = { services: { db: { ports: ['5432:5432'] } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.exposed-sensitive-port' && f.service === 'db'));
});
test('detects docker socket mount', () => {
    const compose = { services: { runner: { volumes: ['/var/run/docker.sock:/var/run/docker.sock'] } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.docker-socket' && f.service === 'runner'));
});
test('detects cap_add: ALL', () => {
    const compose = { services: { app: { cap_add: ['ALL'] } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.cap-add-all' && f.service === 'app'));
});
test('detects network_mode: host', () => {
    const compose = { services: { app: { network_mode: 'host' } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.network-host' && f.service === 'app'));
});
test('detects pid: host', () => {
    const compose = { services: { app: { pid: 'host' } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.pid-host' && f.service === 'app'));
});
test('detects ipc: host', () => {
    const compose = { services: { app: { ipc: 'host' } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.ipc-host' && f.service === 'app'));
});
test('detects unconfined security_opt', () => {
    const compose = { services: { app: { security_opt: ['seccomp=unconfined'] } } };
    const findings = runRules(compose, 'docker-compose.yml');
    assert.ok(findings.some((f) => f.id === 'compose.security-unconfined' && f.service === 'app'));
});
