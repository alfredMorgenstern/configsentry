# Docker socket mount ("/var/run/docker.sock") — why it’s risky and what to do instead

Mounting the Docker socket into a container gives that container **near-root control of the host**.

If an attacker gets code execution in the container, they can typically:
- start privileged containers,
- mount the host filesystem,
- read secrets from other containers/volumes,
- effectively escape the container.

## What it looks like (Compose)

```yml
services:
  runner:
    image: docker:cli
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## Safer alternatives

Pick the least-bad option for your use case:

1) **Don’t run Docker-in-Docker at all**
   - Use a CI runner that already has access to Docker (GitHub Actions runner, GitLab runner, etc.).

2) **Use a dedicated, isolated build host**
   - Treat it as privileged infrastructure.
   - Don’t colocate sensitive workloads.

3) **Use rootless build tools** (when possible)
   - e.g. BuildKit rootless or kaniko-style approaches.

4) **Use a proxy/permission layer**
   - Some setups use a socket proxy that restricts which Docker API endpoints are reachable.
   - This reduces blast radius but is not “safe by default”.

## How ConfigSentry helps

ConfigSentry flags Docker socket mounts because they’re one of the most common and most dangerous Compose footguns.

Run:

```bash
npx configsentry ./docker-compose.yml
```

If you hit a false positive, open an issue with a sanitized minimal snippet:
https://github.com/alfredMorgenstern/configsentry/issues
