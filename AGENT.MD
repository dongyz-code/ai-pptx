# AI PPTX Agent Guide

> 本文件用于指导人类与 AI 编码助手在本仓库内高效协作。

## 1. 项目概述

- 项目类型：Monorepo 全栈项目
- 产品目标：在线 PPT 编辑器（支持元素编辑、页面管理、导入导出），并逐步接入 AI 能力
- 目录结构：
  - `apps/client`：前端应用（Vue3）
  - `apps/server`：后端服务（NestJS）
  - `packages/types`：跨端共享类型

## 2. 技术栈与约定

### 前端（`apps/client`）

- 核心：Vue 3、TypeScript、Vite、TSX
- UI：PrimeVue
- 定位交互：`@floating-ui/vue`
- 工具库：`lodash-es`、`dayjs`
- 状态管理：Pinia
- 路由：Vue Router
- 图标：v-icon(可用图标集：https://icon-sets.iconify.design) 需先在`icon/run.mjs`定义，在执行 `pnpm icon`
- 其他：Tailwind CSS、Tiptap、pptxgenjs

### 后端（`apps/server`）

- 核心：NestJS（TypeScript，ESM）
- 数据访问：TypeORM
- 缓存与基础设施：Redis
- 日志：nestjs-pino
