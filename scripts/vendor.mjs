import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'assets/vendor');
await mkdir(out, { recursive: true });
await copyFile(resolve(root, 'node_modules/motion/dist/motion.js'), resolve(out, 'motion.js'));
await copyFile(resolve(root, 'node_modules/lenis/dist/lenis.min.js'), resolve(out, 'lenis.min.js'));
await copyFile(resolve(root, 'node_modules/lenis/dist/lenis.css'), resolve(out, 'lenis.css'));
for (const pkg of ['motion', 'lenis']) {
  const meta = JSON.parse(await readFile(resolve(root, `node_modules/${pkg}/package.json`)));
  const license = await readFile(resolve(root, `node_modules/${pkg}/LICENSE`), 'utf8').catch(() => readFile(resolve(root, `node_modules/${pkg}/LICENSE.md`), 'utf8'));
  await writeFile(resolve(out, `${pkg}-LICENSE.txt`), `${pkg} ${meta.version}\n\n${license}`);
}
console.log('Local Motion and Lenis assets copied with licenses.');
