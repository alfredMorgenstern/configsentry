// Minimal SARIF 2.1.0 generator for GitHub code scanning.
// Docs: https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
function level(sev) {
    const s = String(sev || '').toLowerCase();
    if (s === 'high' || s === 'critical' || s === 'error')
        return 'error';
    if (s === 'medium' || s === 'warn' || s === 'warning')
        return 'warning';
    return 'note';
}
export function findingsToSarif(findings, opts = {}) {
    const toolName = opts.toolName || 'ConfigSentry';
    const rulesById = new Map();
    for (const f of findings) {
        if (!rulesById.has(f.id)) {
            rulesById.set(f.id, {
                id: f.id,
                name: f.id,
                shortDescription: { text: f.title },
                fullDescription: { text: f.message },
                help: { text: f.suggestion ? `${f.message}\n\nFix: ${f.suggestion}` : f.message },
                defaultConfiguration: { level: level(f.severity) },
            });
        }
    }
    const results = findings.map((f) => {
        const res = {
            ruleId: f.id,
            level: level(f.severity),
            message: { text: f.suggestion ? `${f.message} Fix: ${f.suggestion}` : f.message },
            properties: {
                severity: f.severity,
                service: f.service ?? undefined,
            },
        };
        // Best-effort location: we store a pseudo "where" path today.
        // If it contains "file#pointer", split it; else treat it as a file uri.
        if (f.path) {
            const [file, fragment] = String(f.path).split('#');
            res.locations = [
                {
                    physicalLocation: {
                        artifactLocation: { uri: file },
                        region: fragment ? { snippet: { text: fragment } } : undefined,
                    },
                },
            ];
        }
        return res;
    });
    return {
        version: '2.1.0',
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        runs: [
            {
                tool: {
                    driver: {
                        name: toolName,
                        informationUri: 'https://github.com/alfredMorgenstern/configsentry',
                        rules: Array.from(rulesById.values()),
                    },
                },
                results,
            },
        ],
    };
}
