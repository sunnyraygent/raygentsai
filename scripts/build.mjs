import { rm, mkdir, cp, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
await rm(resolve(root, 'dist'), { recursive: true, force: true });
await mkdir(resolve(root, 'dist'), { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js']) await copyFile(resolve(root, name), resolve(root, 'dist', name));
await cp(resolve(root, 'assets'), resolve(root, 'dist/assets'), { recursive: true });
console.log('Static website packaged in dist/.');
