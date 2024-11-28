import path from 'path';
import fs from 'fs/promises';
const __dirname = path.resolve();

async function makeIconTypes() {
  const iconDir = path.resolve(__dirname, '../../../../node_modules/primeicons/raw-svg');
  const files = await fs.readdir(iconDir);
  const iconNames = files.map((file) => file.replace('.svg', ''));

  const typeContent = `export type IconName = '${iconNames.join(`' | '`)}';`;
  await fs.writeFile(path.resolve(__dirname, './primeicon.ts'), typeContent);

  console.log('done');
}

makeIconTypes();
