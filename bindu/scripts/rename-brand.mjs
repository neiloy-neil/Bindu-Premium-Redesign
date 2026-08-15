import fs from 'fs/promises';
import path from 'path';

const searchDirs = [
  'app',
  'components',
  'lib',
  'store',
  'prisma',
  'types',
  'scripts'
];

const fileFiles = [
  'package.json',
  'README.md',
  'tailwind.config.ts',
  'next.config.mjs'
];

const patterns = [
  { match: /Bindu Premium/g, replace: 'Bindu Premium' },
  { match: /BinduPremium/g, replace: 'BinduPremium' },
  { match: /Bindu Premium/g, replace: 'Bindu Premium' },
  { match: /BINDU PREMIUM/g, replace: 'BINDU PREMIUM' },
  { match: /bindupremium/g, replace: 'bindupremium' },
  { match: /Bindu/g, replace: 'Bindu' },
  { match: /BINDU/g, replace: 'BINDU' },
  { match: /bindu/g, replace: 'bindu' },
  { match: /Bindu Premium/gi, replace: 'Bindu Premium' },
  { match: /Bindu Premium/g, replace: 'bindu-premium' }
];

async function replaceInFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) return;

    let content = await fs.readFile(filePath, 'utf8');
    let original = content;

    for (const pattern of patterns) {
      content = content.replace(pattern.match, pattern.replace);
    }

    if (content !== original) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
}

async function walk(dir) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        if (!['node_modules', '.git', '.next', '.vercel'].includes(file.name)) {
          await walk(fullPath);
        }
      } else {
        const ext = path.extname(file.name);
        if (['.ts', '.tsx', '.js', '.jsx', '.css', '.md', '.json', '.mjs', '.prisma'].includes(ext)) {
          await replaceInFile(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error walking ${dir}:`, err);
  }
}

async function run() {
  const rootDir = process.cwd();
  console.log(`Starting replacement in ${rootDir}...`);
  
  for (const dir of searchDirs) {
    const fullPath = path.join(rootDir, dir);
    try {
      await fs.access(fullPath);
      await walk(fullPath);
    } catch {
      console.log(`Skipping ${fullPath}, does not exist.`);
    }
  }

  for (const file of fileFiles) {
    const fullPath = path.join(rootDir, file);
    try {
      await fs.access(fullPath);
      await replaceInFile(fullPath);
    } catch {
      console.log(`Skipping ${fullPath}, does not exist.`);
    }
  }
  
  console.log('Done.');
}

run();
