import type { Finding } from './types.js';

const SENSITIVE_PORTS = new Set([5432, 3306, 6379, 27017, 9200]);

function normalizePorts(ports: any): Array<{ hostIp?: string; hostPort?: number; containerPort?: number; raw: string }> {
  if (!Array.isArray(ports)) return [];
  const res: Array<{ hostIp?: string; hostPort?: number; containerPort?: number; raw: string }> = [];
  for (const p of ports) {
    if (typeof p === 'number') {
      res.push({ containerPort: p, raw: String(p) });
      continue;
    }
    if (typeof p !== 'string') continue;
    // patterns:
    // "8080:80"
    // "127.0.0.1:8080:80"
    // "5432:5432"
    const parts = p.split(':');
    if (parts.length === 2) {
      const hostPort = Number(parts[0]);
      const containerPort = Number(parts[1]);
      res.push({ hostPort: Number.isFinite(hostPort) ? hostPort : undefined, containerPort: Number.isFinite(containerPort) ? containerPort : undefined, raw: p });
    } else if (parts.length === 3) {
      const hostIp = parts[0];
      const hostPort = Number(parts[1]);
      const containerPort = Number(parts[2]);
      res.push({ hostIp, hostPort: Number.isFinite(hostPort) ? hostPort : undefined, containerPort: Number.isFinite(containerPort) ? containerPort : undefined, raw: p });
    } else {
      res.push({ raw: p });
    }
  }
  return res;
}

export function runRules(compose: any, targetPath: string): Finding[] {
  const findings: Finding[] = [];
  const services: Record<string, any> = compose?.services ?? {};

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

    // Rule: cap_add: [ALL]
    const capAdd: any[] = Array.isArray(svc?.cap_add) ? svc.cap_add : [];
    if (capAdd.some((c) => String(c).toUpperCase() === 'ALL')) {
      findings.push({
        id: 'compose.cap-add-all',
        title: 'Dangerous Linux capabilities (cap_add: ALL)',
        severity: 'high',
        message: `Service '${serviceName}' uses cap_add: [ALL], which is effectively privileged in many cases.`,
        service: serviceName,
        path: `${targetPath}#services.${serviceName}.cap_add`,
        suggestion: 'Remove cap_add: ALL. Add only the specific capabilities required (e.g. NET_BIND_SERVICE) or redesign to avoid it.'
      });
    }

    // Rule: host namespaces (network/pid/ipc)
    if (svc?.network_mode === 'host') {
      findings.push({
        id: 'compose.network-host',
        title: 'Host network namespace (network_mode: host)',
        severity: 'high',
        message: `Service '${serviceName}' uses network_mode: host, bypassing Docker network isolation.`,
        service: serviceName,
        path: `${targetPath}#services.${serviceName}.network_mode`,
        suggestion: 'Avoid host networking. Prefer explicit port mappings or internal networks.'
      });
    }
    if (svc?.pid === 'host') {
      findings.push({
        id: 'compose.pid-host',
        title: 'Host PID namespace (pid: host)',
        severity: 'high',
        message: `Service '${serviceName}' uses pid: host, exposing host process namespace to the container.`,
        service: serviceName,
        path: `${targetPath}#services.${serviceName}.pid`,
        suggestion: 'Avoid pid: host unless you are building low-level host tooling and understand the security implications.'
      });
    }
    if (svc?.ipc === 'host') {
      findings.push({
        id: 'compose.ipc-host',
        title: 'Host IPC namespace (ipc: host)',
        severity: 'high',
        message: `Service '${serviceName}' uses ipc: host, exposing host IPC namespace to the container.`,
        service: serviceName,
        path: `${targetPath}#services.${serviceName}.ipc`,
        suggestion: 'Avoid ipc: host. Prefer explicit shared volumes or redesign if IPC sharing is required.'
      });
    }

    // Rule: unconfined security profiles
    const securityOpt: any[] = Array.isArray(svc?.security_opt) ? svc.security_opt : [];
    const sec = securityOpt.map((x) => String(x).toLowerCase());
    const hasUnconfined = sec.some((x) => x.includes('seccomp') && x.includes('unconfined')) || sec.some((x) => x.includes('apparmor') && x.includes('unconfined')) || sec.some((x) => x.includes('label:disable'));
    if (hasUnconfined) {
      findings.push({
        id: 'compose.security-unconfined',
        title: 'Security profile disabled (unconfined)',
        severity: 'high',
        message: `Service '${serviceName}' disables container security profiles via security_opt (${securityOpt.join(', ')}).`,
        service: serviceName,
        path: `${targetPath}#services.${serviceName}.security_opt`,
        suggestion: 'Avoid unconfined security profiles. Remove the option or use a minimal custom seccomp/apparmor profile.'
      });
    }

    // Rule: docker socket mount
    const volumes: any[] = Array.isArray(svc?.volumes) ? svc.volumes : [];
    for (const v of volumes) {
      if (typeof v !== 'string') continue;
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
      if (v.startsWith('/dev:/dev') || v.startsWith('/dev/:/dev')) {
        findings.push({
          id: 'compose.host-dev-mount',
          title: 'Host /dev mounted into container',
          severity: 'high',
          message: `Service '${serviceName}' mounts host /dev into the container ('${v}'), which can enable device access and privilege escalation.`,
          service: serviceName,
          path: `${targetPath}#services.${serviceName}.volumes`,
          suggestion: 'Avoid mounting /dev. If hardware access is required, map only the specific device(s) needed via devices:.'
        });
      }
    }

    // Rule: dangerous device mappings
    const devices: any[] = Array.isArray(svc?.devices) ? svc.devices : [];
    for (const d of devices) {
      if (typeof d !== 'string') continue;
      const lower = d.toLowerCase();
      if (lower.includes('/dev/mem') || lower.includes('/dev/kmem') || lower.includes('/dev/kmsg')) {
        findings.push({
          id: 'compose.dangerous-device',
          title: 'Dangerous device mapped into container',
          severity: 'high',
          message: `Service '${serviceName}' maps a sensitive device into the container ('${d}').`,
          service: serviceName,
          path: `${targetPath}#services.${serviceName}.devices`,
          suggestion: 'Avoid mapping kernel/memory/log devices into containers. If absolutely required, isolate the host and restrict container privileges.'
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
      if (checkPort == null) continue;
      if (!SENSITIVE_PORTS.has(checkPort)) continue;

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
