import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import type { Finding } from './types.js';

export type BaselineEntry = {
  fingerprint: string;
  id: string;
  service?: string;
  path?: string;
};

export type BaselineFile = {
  version: 1;
  generatedAt: string;
  tool: string;
  entries: BaselineEntry[];
};

export function fingerprintFinding(f: Finding): string {
  const h = crypto.createHash('sha256');
  // Keep stable + minimal; avoid messages that could change wording.
  h.update(String(f.id));
  h.update('\n');
  h.update(String(f.service ?? ''));
  h.update('\n');
  h.update(String(f.path ?? ''));
  return h.digest('hex');
}

export async function writeBaseline(path: string, findings: Finding[]) {
  const entries: BaselineEntry[] = findings.map((f) => ({
    fingerprint: fingerprintFinding(f),
    id: f.id,
    service: f.service,
    path: f.path,
  }));

  const file: BaselineFile = {
    version: 1,
    generatedAt: new Date().toISOString(),
    tool: 'ConfigSentry',
    entries,
  };

  await fs.writeFile(path, JSON.stringify(file, null, 2) + '\n', 'utf8');
}

export async function loadBaseline(path: string): Promise<Set<string>> {
  const raw = await fs.readFile(path, 'utf8');
  const json = JSON.parse(raw);
  const entries: any[] = Array.isArray(json?.entries) ? json.entries : [];
  const set = new Set<string>();
  for (const e of entries) {
    if (typeof e?.fingerprint === 'string') set.add(e.fingerprint);
  }
  return set;
}

export function applyBaseline(findings: Finding[], baselineFingerprints: Set<string>) {
  const kept: Finding[] = [];
  const suppressed: Finding[] = [];
  for (const f of findings) {
    const fp = fingerprintFinding(f);
    if (baselineFingerprints.has(fp)) suppressed.push(f);
    else kept.push(f);
  }
  return { kept, suppressed };
}
