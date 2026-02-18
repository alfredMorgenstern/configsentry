import fs from 'node:fs/promises';
import path from 'node:path';

const COMPOSE_FILENAMES = new Set([
  'docker-compose.yml',
  'docker-compose.yaml',
  'compose.yml',
  'compose.yaml',
]);

async function isFile(p: string) {
  try {
    return (await fs.stat(p)).isFile();
  } catch {
    return false;
  }
}

async function isDir(p: string) {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

export async function resolveTargets(input: string): Promise<string[]> {
  const abs = path.resolve(input);

  if (await isFile(abs)) return [abs];

  if (await isDir(abs)) {
    const entries = await fs.readdir(abs);
    const hits: string[] = [];
    for (const e of entries) {
      if (COMPOSE_FILENAMES.has(e)) hits.push(path.join(abs, e));
      // Common pattern: docker-compose.prod.yml etc.
      if (/^docker-compose\..+\.ya?ml$/i.test(e)) hits.push(path.join(abs, e));
      if (/^compose\..+\.ya?ml$/i.test(e)) hits.push(path.join(abs, e));
    }
    // de-dupe
    return Array.from(new Set(hits)).sort();
  }

  // Not a file/dir: treat as a path anyway (will fail later with a nice error)
  return [abs];
}
