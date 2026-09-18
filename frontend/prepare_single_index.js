import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, 'dist', 'standalone_single_file.html');
const outDir = path.join(__dirname, 'tiiny_single_file');
const destPath = path.join(outDir, 'index.html');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPath);
  console.log('Created tiiny_single_file/index.html');
} else {
  console.error('Source file not found:', srcPath);
}
