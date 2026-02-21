#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadCompose } from './compose.js';
import { runRules } from './rules.js';
import { findingsToSarif } from './sarif.js';
import { resolveTargets } from './scan.js';
import { applyBaseline, loadBaseline, writeBaseline } from './baseline.js';

type OutputMode = 'pretty' | 'json' | 'sarif';

function parseArgs(argv: string[]) {
  const args = argv.slice(2);

  const help = args.includes('-h') || args.includes('--help');
  const version = args.includes('-v') || args.includes('--version');

  const json = args.includes('--json');
  const sarif = args.includes('--sarif');

  const formatIdx = args.indexOf('--format');
  const format = formatIdx >= 0 ? args[formatIdx + 1] : undefined;

  let output: OutputMode = json ? 'json' : sarif ? 'sarif' : 'pretty';
  if (format) {
    if (format === 'pretty' || format === 'json' || format === 'sarif') {
      output = format;
    } else {
      // Keep output as-is; main() will print a clear error.
    }
  }

  const baselineIdx = args.indexOf('--baseline');
  const baselinePath = baselineIdx >= 0 ? args[baselineIdx + 1] : undefined;
  const writeBaselineIdx = args.indexOf('--write-baseline');
  const writeBaselinePath = writeBaselineIdx >= 0 ? args[writeBaselineIdx + 1] : undefined;

  // Prefer explicit flag (matches the GitHub Action input)
  const targetIdx = args.indexOf('--target');
  const targetFromFlag = targetIdx >= 0 ? args[targetIdx + 1] : undefined;

  // Back-compat: first positional arg
  const targetFromPositional = args.find((a) => !a.startsWith('-'));

  const target = targetFromFlag ?? targetFromPositional;

  return { args, help, version, output, format, baselinePath, writeBaselinePath, target };
}

function usage() {
  console.log(`ConfigSentry (MVP)

Usage:
  configsentry <file-or-dir> [--json|--sarif|--format <pretty|json|sarif>] [--baseline <file>] [--write-baseline <file>]
  configsentry --target <file-or-dir> [--json|--sarif|--format <pretty|json|sarif>] [--baseline <file>] [--write-baseline <file>]

Output:
  --json                    machine-readable findings (deprecated; use --format json)
  --sarif                   SARIF 2.1.0 (for GitHub code scanning) (deprecated; use --format sarif)
  --format <pretty|json|sarif>

Baselines:
  --baseline <file>        suppress findings present in a baseline file
  --write-baseline <file>  write baseline file for current findings and exit 0

Exit codes:
  0 = no findings (after baseline suppression)
  2 = findings present
  1 = error
`);
}

async function main() {
  const { args, help, version, output, format, baselinePath, writeBaselinePath, target } = parseArgs(process.argv);

  if (version) {
    try {
      const here = path.dirname(fileURLToPath(import.meta.url));
      const pkgPath = path.resolve(here, '../package.json');
      const raw = await fs.readFile(pkgPath, 'utf8');
      const pkg = JSON.parse(raw);
      console.log(pkg.version || 'unknown');
    } catch {
      console.log('unknown');
    }
    process.exit(0);
  }

  if (args.length === 0 || help) {
    usage();
    process.exit(0);
  }

  if (format && format !== 'pretty' && format !== 'json' && format !== 'sarif') {
    console.error(`Error: invalid --format '${format}'. Expected: pretty | json | sarif`);
    process.exit(1);
  }

  if (args.includes('--json') && args.includes('--sarif')) {
    console.error('Error: choose only one output mode: --json, --sarif, or --format');
    process.exit(1);
  }

  if (format && (args.includes('--json') || args.includes('--sarif'))) {
    console.error('Error: choose only one output mode: --json, --sarif, or --format');
    process.exit(1);
  }

  if (!target) {
    usage();
    process.exit(1);
  }

  const targetPaths = await resolveTargets(target);
  if (targetPaths.length === 0) {
    console.error(`No compose files found in: ${target}`);
    process.exit(1);
  }

  let allFindings = [] as any[];
  for (const targetPath of targetPaths) {
    const { compose } = await loadCompose(targetPath);
    allFindings = allFindings.concat(runRules(compose, targetPath));
  }

  // Baseline suppression
  let suppressed: any[] = [];
  let findings = allFindings;
  if (baselinePath) {
    const set = await loadBaseline(path.resolve(baselinePath));
    const res = applyBaseline(allFindings, set);
    findings = res.kept;
    suppressed = res.suppressed;
  }

  // Baseline generation mode
  if (writeBaselinePath) {
    await writeBaseline(path.resolve(writeBaselinePath), allFindings);
    console.log(`Wrote baseline: ${path.resolve(writeBaselinePath)} (${allFindings.length} finding(s))`);
    process.exit(0);
  }

  if (output === 'json') {
    console.log(JSON.stringify({ targetPaths, findings, suppressedCount: suppressed.length }, null, 2));
  } else if (output === 'sarif') {
    console.log(JSON.stringify(findingsToSarif(findings), null, 2));
  } else {
    const scope = targetPaths.length === 1 ? targetPaths[0] : `${targetPaths.length} file(s)`;

    if (findings.length === 0) {
      console.log(`✅ No findings for ${scope}`);
      if (suppressed.length > 0) {
        console.log(`(suppressed by baseline: ${suppressed.length})`);
      }
    } else {
      console.log(`❌ ${findings.length} finding(s) for ${scope}`);
      if (suppressed.length > 0) {
        console.log(`(suppressed by baseline: ${suppressed.length})`);
      }
      console.log('');
      for (const f of findings) {
        console.log(`[${f.severity.toUpperCase()}] ${f.title}`);
        console.log(`- service: ${f.service ?? '-'}
- rule: ${f.id}
- where: ${f.path ?? '-'}
- msg: ${f.message}`);
        if (f.suggestion) console.log(`- fix: ${f.suggestion}`);
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
