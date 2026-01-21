/**
 * 渲染器导出
 *
 * 注意：从 v2.0 开始，我们使用通用渲染器 (UniversalRenderer) 替代了单独的渲染器文件
 * 所有 valueType 的配置都在 core/component-map.ts 中管理
 *
 * 如需扩展新的 valueType，只需在 component-map.ts 中添加配置即可
 */

export { getComponentConfig, COMPONENT_MAP } from '../core/component-map';
export type { ComponentConfig } from '../core/component-map';
