import fs from 'node:fs';
import path from 'node:path';

const __dirname = import.meta.dirname;

/**
 * Iconify 图标集合
 * 使用格式: 'collection:icon-name'
 * 可用集合: https://icon-sets.iconify.design/
 */
const iconifyIcons = ['tabler:error-404', 'weui:arrow-filled', 'weui:arrow-outlined'];

/**
 * 生成 Iconify 图标导出文件
 */
async function loadIconifyIcon() {
  const exports = [];
  const types = [];

  iconifyIcons.forEach((icon) => {
    const iconUrl = icon.replace(':', '/');
    exports.push(`  '${icon}': async () => (await import('~icons/${iconUrl}')).default,`);
    types.push(`  '${icon}': Component;`);
  });

  const content = `export default {
${exports.join('\n')}
};
`;
  const iconifyPath = path.join(__dirname, './iconify-icons.ts');

  fs.writeFileSync(iconifyPath, content);
  console.log(`✓ 生成 ${iconifyIcons.length} 个 Iconify 图标`);

  return types;
}

/**
 * 生成本地 SVG 图标导出文件
 */
async function loadLocalSvgIcon() {
  const ICON_PREFIX = 'local:';
  const svgDir = path.join(__dirname, '../../../assets/svg-icons');

  // 确保目录存在
  if (!fs.existsSync(svgDir)) {
    fs.mkdirSync(svgDir, { recursive: true });
    console.log(`✓ 创建目录: ${svgDir}`);
  }

  const files = fs.readdirSync(svgDir);
  const svgFiles = files.filter((file) => file.endsWith('.svg'));

  const exports = [];
  const types = [];

  svgFiles.forEach((file) => {
    const iconName = file.replace('.svg', '');
    const fullIconName = `${ICON_PREFIX}${iconName}`;
    exports.push(`  '${fullIconName}': async () => (await import('~icons/local/${iconName}')).default,`);
    types.push(`  '${fullIconName}': Component;`);
  });

  const content =
    svgFiles.length > 0
      ? `export default {
${exports.join('\n')}
};
`
      : `export default {};\n`;

  const localIconPath = path.join(__dirname, './local-icons.ts');

  fs.writeFileSync(localIconPath, content);
  console.log(`✓ 生成 ${svgFiles.length} 个本地 SVG 图标`);

  return types;
}

/**
 * 生成类型声明文件
 */
async function generateTypeDeclarations(iconifyTypes, localTypes) {
  const allTypes = [...iconifyTypes, ...localTypes];

  const typeContent = `import type { Component } from 'vue';

/**
 * 图标类型映射
 * 自动生成 - 请勿手动修改
 */
export interface IconTypes {
${allTypes.join('\n')}
}

export type IconName = keyof IconTypes;
`;

  const typePath = path.join(__dirname, './types.ts');
  fs.writeFileSync(typePath, typeContent);
  console.log(`✓ 生成类型声明文件`);
}

async function run() {
  try {
    console.log('开始生成图标文件...\n');

    const iconifyTypes = await loadIconifyIcon();
    const localTypes = await loadLocalSvgIcon();
    await generateTypeDeclarations(iconifyTypes, localTypes);

    console.log('\n✨ 图标文件生成完成！');
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

run();
