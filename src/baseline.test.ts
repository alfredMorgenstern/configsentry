import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprintFinding, applyBaseline } from './baseline.js';

test('baseline suppression works', () => {
  const f1 = { id: 'r1', title: 't', severity: 'low', message: 'm', service: 'svc', path: '/tmp/x#p' };
  const f2 = { id: 'r2', title: 't', severity: 'low', message: 'm', service: 'svc', path: '/tmp/x#p2' };

  const set = new Set([fingerprintFinding(f1 as any)]);
  const { kept, suppressed } = applyBaseline([f1 as any, f2 as any], set);

  assert.equal(kept.length, 1);
  assert.equal(suppressed.length, 1);
  assert.equal(kept[0].id, 'r2');
});
