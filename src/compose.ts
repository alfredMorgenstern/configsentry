import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export type ComposeFile = {
  services?: Record<string, any>;
};

export async function loadCompose(filePath: string): Promise<{ compose: ComposeFile; raw: any }> {
  const abs = path.resolve(filePath);
  const text = await fs.readFile(abs, 'utf8');
  const doc = YAML.parse(text);
  return { compose: doc as ComposeFile, raw: doc };
}
