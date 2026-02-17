const SENSITIVE_PORTS = new Set([5432, 3306, 6379, 27017, 9200]);
function normalizePorts(ports) {
    if (!Array.isArray(ports))
        return [];
    const res = [];
    for (const p of ports) {
        if (typeof p === 'number') {
            res.push({ containerPort: p, raw: String(p) });
            continue;
        }
        if (typeof p !== 'string')
            continue;
        // patterns:
        // "8080:80"
        // "127.0.0.1:8080:80"
        // "5432:5432"
        const parts = p.split(':');
        if (parts.length === 2) {
            const hostPort = Number(parts[0]);
            const containerPort = Number(parts[1]);
            res.push({ hostPort: Number.isFinite(hostPort) ? hostPort : undefined, containerPort: Number.isFinite(containerPort) ? containerPort : undefined, raw: p });
        }
        else if (parts.length === 3) {
            const hostIp = parts[0];
            const hostPort = Number(parts[1]);
            const containerPort = Number(parts[2]);
            res.push({ hostIp, hostPort: Number.isFinite(hostPort) ? hostPort : undefined, containerPort: Number.isFinite(containerPort) ? containerPort : undefined, raw: p });
        }
        else {
            res.push({ raw: p });
        }
    }
    return res;
}
export function runRules(compose, targetPath) {
    const findings = [];
    const services = compose?.services ?? {};
    for (const [serviceName, svc] of Object.entries(services)) {
        // Rule: privileged
        if (svc?.privileged === true) {
            findings.push({
                id: 'compose.privileged',
                title: 'Privileged container',
                severity: 'high',
                message: `Service '${serviceName}' runs with privileged: true.`,
                service: serviceName,
                path: `${targetPath}#services.${serviceName}.privileged`,
                suggestion: 'Remove privileged: true unless absolutely required; prefer adding only the needed capabilities.'
            });
        }
        // Rule: docker socket mount
        const volumes = Array.isArray(svc?.volumes) ? svc.volumes : [];
        for (const v of volumes) {
            if (typeof v !== 'string')
                continue;
            if (v.includes('/var/run/docker.sock')) {
                findings.push({
                    id: 'compose.docker-socket',
                    title: 'Docker socket mounted',
                    severity: 'high',
                    message: `Service '${serviceName}' mounts /var/run/docker.sock which effectively grants root-on-host.`,
                    service: serviceName,
                    path: `${targetPath}#services.${serviceName}.volumes`,
                    suggestion: 'Avoid mounting the docker socket. If you need it, isolate the runner and treat it as privileged infrastructure.'
                });
            }
            if (v.startsWith('/:') || v.startsWith('/:/')) {
                findings.push({
                    id: 'compose.host-root-mount',
                    title: 'Host root mounted',
                    severity: 'high',
                    message: `Service '${serviceName}' appears to mount the host root filesystem ('${v}').`,
                    service: serviceName,
                    path: `${targetPath}#services.${serviceName}.volumes`,
                    suggestion: 'Avoid mounting /. Mount only specific directories required by the app.'
                });
            }
        }
        // Rule: restart policy
        if (svc?.restart == null) {
            findings.push({
                id: 'compose.missing-restart',
                title: 'Missing restart policy',
                severity: 'medium',
                message: `Service '${serviceName}' has no restart policy.`,
                service: serviceName,
                path: `${targetPath}#services.${serviceName}.restart`,
                suggestion: "Set restart: unless-stopped (or on-failure) to improve resilience."
            });
        }
        // Rule: healthcheck
        if (svc?.healthcheck == null) {
            findings.push({
                id: 'compose.missing-healthcheck',
                title: 'Missing healthcheck',
                severity: 'medium',
                message: `Service '${serviceName}' has no healthcheck.`,
                service: serviceName,
                path: `${targetPath}#services.${serviceName}.healthcheck`,
                suggestion: 'Add a healthcheck so orchestrators can detect broken containers (and dependent services can wait on healthy state).'
            });
        }
        // Rule: runs as root
        const user = svc?.user;
        if (user == null || user === '0' || user === 0 || user === 'root') {
            findings.push({
                id: 'compose.runs-as-root',
                title: 'Container likely runs as root',
                severity: 'high',
                message: `Service '${serviceName}' does not specify a non-root user (user:).`,
                service: serviceName,
                path: `${targetPath}#services.${serviceName}.user`,
                suggestion: 'Set user: "1000:1000" (or a dedicated UID/GID) and ensure the image supports running unprivileged.'
            });
        }
        // Rule: exposed sensitive ports
        const ports = normalizePorts(svc?.ports);
        for (const p of ports) {
            const hostIp = p.hostIp;
            const hostPort = p.hostPort;
            const containerPort = p.containerPort;
            const checkPort = containerPort ?? hostPort;
            if (checkPort == null)
                continue;
            if (!SENSITIVE_PORTS.has(checkPort))
                continue;
            const bindsAll = hostIp == null || hostIp === '0.0.0.0' || hostIp === '';
            if (bindsAll) {
                findings.push({
                    id: 'compose.exposed-sensitive-port',
                    title: 'Sensitive port exposed publicly',
                    severity: 'high',
                    message: `Service '${serviceName}' exposes a commonly sensitive port (${checkPort}) on all interfaces (ports: '${p.raw}').`,
                    service: serviceName,
                    path: `${targetPath}#services.${serviceName}.ports`,
                    suggestion: `Bind to 127.0.0.1 (e.g. '127.0.0.1:${hostPort ?? checkPort}:${containerPort ?? checkPort}') or remove the port and use an internal network.`
                });
            }
        }
    }
    return findings;
}
