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
