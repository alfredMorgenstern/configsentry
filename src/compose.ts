import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export type ComposeFile = {
  services?: Record<string, any>;
};

export async function loadCompose(filePath: string): Promise<{ compose: ComposeFile; raw: any }> {
  const abs = path.resolve(filePath);
  const text = await fs.readFile(abs, 'utf8');

  // Support multi-document YAML (---). If multiple docs exist, Compose content is typically the first.
  const docs = YAML.parseAllDocuments(text);
  const first = docs[0];
  const doc = first ? first.toJSON() : YAML.parse(text);

  return { compose: doc as ComposeFile, raw: doc };
}
