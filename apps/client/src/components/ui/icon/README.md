# Icon 组件

基于 `unplugin-icons` 的图标解决方案，支持 Iconify 图标集和本地 SVG 图标。

## 特性

- ✅ **类型安全**：自动生成 TypeScript 类型，提供完整的类型提示
- ✅ **按需加载**：图标按需编译，不会打包未使用的图标
- ✅ **双重来源**：支持 Iconify 图标集（200+ 图标库）和本地 SVG
- ✅ **零配置**：自动处理图标导入和类型声明
- ✅ **开发友好**：错误提示、热更新支持

## 使用方式

### 基础用法

```vue
<script setup lang="ts">
import Icon from '@/components/ui/icon/index.vue';
</script>

<template>
  <!-- 使用 Iconify 图标 -->
  <Icon icon="tabler:error-404" />

  <!-- 使用本地 SVG 图标 -->
  <Icon icon="local:logo" />

  <!-- 自定义大小和颜色 -->
  <Icon icon="weui:arrow-filled" size="24px" color="red" />
  <Icon icon="weui:arrow-outlined" :size="32" />
</template>
```

### Props

| 属性    | 类型               | 默认值           | 说明                         |
| ------- | ------------------ | ---------------- | ---------------------------- |
| `icon`  | `IconName`         | -                | 图标名称（必填，有类型提示） |
| `size`  | `string \| number` | `'1em'`          | 图标大小，数字自动添加 `px`  |
| `color` | `string`           | `'currentColor'` | 图标颜色                     |

## 添加图标

### 添加 Iconify 图标

1. 浏览 [Iconify 图标库](https://icon-sets.iconify.design/)
2. 找到想要的图标，复制图标名称（格式：`collection:icon-name`）
3. 编辑 `run.mjs`，添加到 `iconifyIcons` 数组：

```js
const iconifyIcons = [
  'tabler:error-404',
  'weui:arrow-filled',
  'material-symbols:home', // 添加新图标
];
```

4. 运行生成命令：

```bash
pnpm gen:icons
```

### 添加本地 SVG 图标

1. 将 SVG 文件放入 `src/assets/svg-icons/` 目录
2. 确保 SVG 文件符合以下规范：
   - 移除固定的 `width` 和 `height` 属性
   - 使用 `currentColor` 代替硬编码颜色
   - 清理不必要的元数据

3. 运行生成命令：

```bash
pnpm gen:icons
```

4. 使用时加上 `local:` 前缀：

```vue
<Icon icon="local:your-icon-name" />
```

## 文件结构

```
icon/
├── run.mjs              # 图标生成脚本
├── types.ts             # 自动生成的类型声明
├── iconify-icons.ts     # 自动生成的 Iconify 图标导出
├── local-icons.ts       # 自动生成的本地图标导出
├── index.vue            # Icon 组件
└── README.md            # 文档
```

## 工作原理

1. **图标收集**：`run.mjs` 扫描配置的 Iconify 图标和本地 SVG 文件
2. **生成导出**：为每个图标生成对应的导出语句
3. **类型生成**：自动生成 TypeScript 类型声明文件
4. **组件使用**：Icon 组件动态加载对应的图标组件
5. **编译优化**：`unplugin-icons` 在构建时将图标编译为 Vue 组件

## 最佳实践

### 1. 定期更新类型

每次添加或删除图标后，运行：

```bash
pnpm gen:icons
```

### 2. SVG 优化

使用 [SVGO](https://github.com/svg/svgo) 优化本地 SVG：

```bash
npx svgo src/assets/svg-icons/*.svg
```

### 3. 按需使用

只添加项目实际需要的图标，避免增加不必要的构建体积。

### 4. 命名规范

- Iconify 图标：使用官方名称，如 `tabler:home`
- 本地图标：使用 kebab-case，如 `custom-logo.svg` → `local:custom-logo`

## 常见问题

### Q: 图标不显示？

1. 检查图标名称是否正确（有 TypeScript 类型提示）
2. 确认已运行 `pnpm gen:icons`
3. 检查控制台是否有错误信息

### Q: 如何更改图标颜色？

使用 `color` 属性或 CSS 的 `color` 属性：

```vue
<Icon icon="tabler:home" color="blue" />
<Icon icon="tabler:home" style="color: blue" />
```

### Q: 如何批量导入图标？

编辑 `run.mjs` 的 `iconifyIcons` 数组，一次性添加多个图标后运行生成命令。

## 相关资源

- [Iconify 图标库](https://icon-sets.iconify.design/)
- [unplugin-icons 文档](https://github.com/unplugin/unplugin-icons)
- [@iconify/vue 文档](https://iconify.design/docs/icon-components/vue/)
