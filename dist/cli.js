#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadCompose } from './compose.js';
import { runRules } from './rules.js';
import { findingsToSarif } from './sarif.js';
function usage() {
    console.log(`ConfigSentry (MVP)\n\nUsage:\n  configsentry <path-to-docker-compose.yml> [--json] [--sarif]\n\nOutput:\n  --json   machine-readable findings\n  --sarif  SARIF 2.1.0 (for GitHub code scanning)\n\nExit codes:\n  0 = no findings\n  2 = findings present\n  1 = error\n`);
}
async function main() {
    const args = process.argv.slice(2);
    if (args.includes('-v') || args.includes('--version')) {
        try {
            const here = path.dirname(fileURLToPath(import.meta.url));
            const pkgPath = path.resolve(here, '../package.json');
            const raw = await fs.readFile(pkgPath, 'utf8');
            const pkg = JSON.parse(raw);
            console.log(pkg.version || 'unknown');
        }
        catch {
            console.log('unknown');
        }
        process.exit(0);
    }
    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
        usage();
        process.exit(0);
    }
    const json = args.includes('--json');
    const sarif = args.includes('--sarif');
    if (json && sarif) {
        console.error('Error: choose only one output mode: --json or --sarif');
        process.exit(1);
    }
    const target = args.find((a) => !a.startsWith('-'));
    if (!target) {
        usage();
        process.exit(1);
    }
    const targetPath = path.resolve(target);
    const { compose } = await loadCompose(targetPath);
    const findings = runRules(compose, targetPath);
    if (json) {
        console.log(JSON.stringify({ targetPath, findings }, null, 2));
    }
    else if (sarif) {
        console.log(JSON.stringify(findingsToSarif(findings), null, 2));
    }
    else {
        if (findings.length === 0) {
            console.log(`✅ No findings for ${targetPath}`);
        }
        else {
            console.log(`❌ ${findings.length} finding(s) for ${targetPath}\n`);
            for (const f of findings) {
                console.log(`[${f.severity.toUpperCase()}] ${f.title}`);
                console.log(`- service: ${f.service ?? '-'}
- rule: ${f.id}
- where: ${f.path ?? '-'}
- msg: ${f.message}`);
                if (f.suggestion)
                    console.log(`- fix: ${f.suggestion}`);
                console.log('');
            }
        }
    }
    process.exit(findings.length === 0 ? 0 : 2);
}
main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
