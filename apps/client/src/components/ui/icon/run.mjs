import fs from 'node:fs';
import path from 'node:path';

const __dirname = import.meta.dirname;

/**
 * Iconify 图标集合
 */
const iconifyIcon = ['tabler:error-404', 'weui:arrow-filled', 'weui:arrow-outlined'];

async function loadIconifyIcon() {
  let str = '';

  iconifyIcon.forEach((icon) => {
    const iconUrl = icon.replace(':', '/');
    str += `export { default as '${icon}' } from '~icons/${iconUrl}';\n`;
  });

  const iconifyPath = path.join(__dirname, './iconify-icons.ts');
  fs.writeFileSync(iconifyPath, str);
}

/**
 * 本地SVG 图标
 */
async function loadLocalSvgIcon() {
  const ICON_PREFIX = 'local:';

  const dirs = path.join(__dirname, '../../../assets/svg-icons');
  const files = fs.readdirSync(dirs);

  let str = ``;

  files.forEach((file) => {
    if (file.endsWith('.svg')) {
      const iconName = file.replace('.svg', '');
      str += `export { default as '${ICON_PREFIX}${iconName}' } from '~icons/local/${iconName}';\n`;
    }
  });

  str += `\n`;
  const localIconPath = path.join(__dirname, './local-icons.ts');
  fs.writeFileSync(localIconPath, str);
}

async function run() {
  await loadIconifyIcon();
  await loadLocalSvgIcon();
}

run().then(() => {
  console.log('done');
});
