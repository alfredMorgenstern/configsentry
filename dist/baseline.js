import fs from 'node:fs/promises';
import crypto from 'node:crypto';
export function fingerprintFinding(f) {
    const h = crypto.createHash('sha256');
    // Keep stable + minimal; avoid messages that could change wording.
    h.update(String(f.id));
    h.update('\n');
    h.update(String(f.service ?? ''));
    h.update('\n');
    h.update(String(f.path ?? ''));
    return h.digest('hex');
}
export async function writeBaseline(path, findings) {
    const entries = findings.map((f) => ({
        fingerprint: fingerprintFinding(f),
        id: f.id,
        service: f.service,
        path: f.path,
    }));
    const file = {
        version: 1,
        generatedAt: new Date().toISOString(),
        tool: 'ConfigSentry',
        entries,
    };
    await fs.writeFile(path, JSON.stringify(file, null, 2) + '\n', 'utf8');
}
export async function loadBaseline(path) {
    const raw = await fs.readFile(path, 'utf8');
    const json = JSON.parse(raw);
    const entries = Array.isArray(json?.entries) ? json.entries : [];
    const set = new Set();
    for (const e of entries) {
        if (typeof e?.fingerprint === 'string')
            set.add(e.fingerprint);
    }
    return set;
}
export function applyBaseline(findings, baselineFingerprints) {
    const kept = [];
    const suppressed = [];
    for (const f of findings) {
        const fp = fingerprintFinding(f);
        if (baselineFingerprints.has(fp))
            suppressed.push(f);
        else
            kept.push(f);
    }
    return { kept, suppressed };
}
