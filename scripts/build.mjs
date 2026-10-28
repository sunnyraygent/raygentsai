import { rm, mkdir, cp, copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
// Absolute URLs (canonical, social previews, sitemap) need the public address; GitHub Pages provides it at deploy time.
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');
if (!siteUrl) console.warn('SITE_URL is not set: absolute page URLs will be left empty in this build.');
await rm(resolve(root, 'dist'), { recursive: true, force: true });
await mkdir(resolve(root, 'dist'), { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js', 'robots.txt', 'sitemap.xml']) await copyFile(resolve(root, name), resolve(root, 'dist', name));
for (const name of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const file = resolve(root, 'dist', name);
  await writeFile(file, (await readFile(file, 'utf8')).replaceAll('%SITE_URL%', siteUrl));
}
await cp(resolve(root, 'assets'), resolve(root, 'dist/assets'), { recursive: true });
console.log(`Static website packaged in dist/${siteUrl ? ` for ${siteUrl}` : ''}.`);
