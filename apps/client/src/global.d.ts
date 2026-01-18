/** Environment variables */
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_DEV: boolean;
    readonly VITE_PROD: boolean;
    readonly VITE_MODE: 'development' | 'production' | 'test';
  }
}

export {};
