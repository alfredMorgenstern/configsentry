import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
export async function loadCompose(filePath) {
    const abs = path.resolve(filePath);
    const text = await fs.readFile(abs, 'utf8');
    const doc = YAML.parse(text);
    return { compose: doc, raw: doc };
}
