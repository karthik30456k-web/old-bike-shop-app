import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const singleFilePath = path.join(distDir, 'standalone_single_file.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Find linked CSS
  const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="(\.\/assets\/[^"]+)">/);
  if (cssMatch) {
    const cssRelPath = cssMatch[1].replace('./', '');
    const cssFullPath = path.join(distDir, cssRelPath);
    if (fs.existsSync(cssFullPath)) {
      const cssContent = fs.readFileSync(cssFullPath, 'utf-8');
      html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
      console.log('Inlined CSS:', cssRelPath);
    }
  }

  // Find script
  const jsMatch = html.match(/<script type="module" crossorigin src="(\.\/assets\/[^"]+)"><\/script>/);
  if (jsMatch) {
    const jsRelPath = jsMatch[1].replace('./', '');
    const jsFullPath = path.join(distDir, jsRelPath);
    if (fs.existsSync(jsFullPath)) {
      const jsContent = fs.readFileSync(jsFullPath, 'utf-8');
      html = html.replace(jsMatch[0], `<script type="module">\n${jsContent}\n</script>`);
      console.log('Inlined JS:', jsRelPath);
    }
  }

  fs.writeFileSync(singleFilePath, html, 'utf-8');
  console.log('Successfully created standalone single file at:', singleFilePath);
} else {
  console.error('dist/index.html not found! Run npm run build first.');
}
