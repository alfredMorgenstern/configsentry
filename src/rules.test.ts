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

test('supports long syntax bind mounts', () => {
  const compose = {
    services: {
      app: {
        volumes: [
          { type: 'bind', source: '/etc', target: '/host-etc' },
          { type: 'bind', source: '/dev', target: '/host-dev' },
        ],
      },
    },
  };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.host-etc-mount' && f.service === 'app'));
  assert.ok(findings.some((f) => f.id === 'compose.host-dev-mount' && f.service === 'app'));
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

test('detects host /dev mount', () => {
  const compose = { services: { app: { volumes: ['/dev:/dev'] } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.host-dev-mount' && f.service === 'app'));
});

test('detects sensitive host mounts (/etc, /proc, /sys)', () => {
  const compose = {
    services: {
      app: {
        volumes: ['/etc:/host-etc:ro', '/proc:/host-proc:ro', '/sys:/host-sys:ro'],
      },
    },
  };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.host-etc-mount' && f.service === 'app'));
  assert.ok(findings.some((f) => f.id === 'compose.host-proc-mount' && f.service === 'app'));
  assert.ok(findings.some((f) => f.id === 'compose.host-sys-mount' && f.service === 'app'));
});

test('detects dangerous device mapping', () => {
  const compose = { services: { app: { devices: ['/dev/kmsg:/dev/kmsg'] } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.dangerous-device' && f.service === 'app'));
});

test('suggests read_only hardening', () => {
  const compose = { services: { app: { image: 'nginx:alpine' } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.missing-read-only' && f.service === 'app'));
});

test('warns about depends_on without healthcheck gating', () => {
  const compose = {
    services: {
      web: { depends_on: ['db'] },
      db: { image: 'postgres:16' },
    },
  };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.depends-on-without-health' && f.service === 'web'));
});

test('does not warn depends_on when service_healthy is used and deps have healthchecks', () => {
  const compose = {
    services: {
      web: { depends_on: { db: { condition: 'service_healthy' } } },
      db: { image: 'postgres:16', healthcheck: { test: ['CMD', 'true'] } },
    },
  };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(!findings.some((f) => f.id === 'compose.depends-on-without-health' && f.service === 'web'));
});

test('does not warn about read_only when set', () => {
  const compose = { services: { app: { read_only: true } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(!findings.some((f) => f.id === 'compose.missing-read-only' && f.service === 'app'));
});

test('flags missing image tag', () => {
  const compose = { services: { app: { image: 'nginx' } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.image-floating-tag' && f.service === 'app'));
});

test('flags latest image tag', () => {
  const compose = { services: { app: { image: 'nginx:latest' } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.image-floating-tag' && f.service === 'app'));
});

test('does not flag pinned digest image', () => {
  const compose = { services: { app: { image: 'nginx@sha256:deadbeef' } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(!findings.some((f) => f.id === 'compose.image-floating-tag' && f.service === 'app'));
});

test('does not flag explicit version tag', () => {
  const compose = { services: { app: { image: 'ghcr.io/acme/app:1.2.3' } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(!findings.some((f) => f.id === 'compose.image-floating-tag' && f.service === 'app'));
});

test('flags hardcoded secret in environment (object syntax)', () => {
  const compose = { services: { app: { environment: { POSTGRES_PASSWORD: 'supersecret' } } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.hardcoded-secret' && f.service === 'app' && f.severity === 'high'));
});

test('does not flag env var reference ${VAR}', () => {
  const compose = { services: { app: { environment: { POSTGRES_PASSWORD: '${POSTGRES_PASSWORD}' } } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(!findings.some((f) => f.id === 'compose.hardcoded-secret' && f.service === 'app'));
});

test('flags placeholder secret as medium', () => {
  const compose = { services: { app: { environment: ['API_KEY=changeme'] } } };
  const findings = runRules(compose, 'docker-compose.yml');
  assert.ok(findings.some((f) => f.id === 'compose.hardcoded-secret' && f.service === 'app' && f.severity === 'medium'));
});
