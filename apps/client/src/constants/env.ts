/**
 * 环境变量配置
 */
export const ENV = {
  /** API 基础地址 */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',

  /** 是否开发环境 */
  IS_DEV: import.meta.env.DEV,

  /** 是否生产环境 */
  IS_PROD: import.meta.env.PROD,

  /** 应用模式 */
  MODE: import.meta.env.MODE as 'development' | 'production' | 'test',
} as const;
