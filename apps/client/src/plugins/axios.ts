import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useUserStore } from '@/models/user';
import { ENV } from '@/constants/env';
import { notify } from './notify';

/**
 * 统一响应格式
 */
export interface ApiResponse<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp?: number;
}

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 错误处理
 */
function handleError(error: AxiosError<ApiResponse>) {
  const userStore = useUserStore();

  // 处理不同的 HTTP 错误状态
  if (error.response) {
    const { status, data } = error.response;
    let errorMessage = data?.message || '请求失败';

    switch (status) {
      case 401:
        errorMessage = '未授权,请重新登录';
        userStore.logout();
        // 跳转到登录页
        window.location.href = '/login';
        break;
      case 403:
        errorMessage = '拒绝访问';
        break;
      case 404:
        errorMessage = '请求的资源不存在';
        break;
      case 500:
        errorMessage = '服务器内部错误';
        break;
      case 502:
        errorMessage = '网关错误';
        break;
      case 503:
        errorMessage = '服务不可用';
        break;
      case 504:
        errorMessage = '网关超时';
        break;
      default:
        errorMessage = data?.message || `请求失败 (${status})`;
    }

    notify({
      severity: 'error',
      summary: errorMessage,
    });
    return Promise.reject(new Error(errorMessage));
  }

  // 网络错误
  let errorMessage = '请求失败';
  if (error.code === 'ECONNABORTED') {
    errorMessage = '请求超时,请稍后重试';
  } else if (error.message === 'Network Error') {
    errorMessage = '网络连接失败,请检查网络';
  } else {
    errorMessage = error.message || '请求失败';
  }
  notify({
    severity: 'error',
    summary: errorMessage,
  });
  return Promise.reject(error);
}

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();

    // 添加 token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 如果返回的是非标准格式(如下载文件等),直接返回
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response;
    }

    // 业务成功
    if (data.code === 200 || data.code === 0) {
      return response;
    }

    // 业务失败
    const errMsg = data.message || '请求失败';
    notify({
      severity: 'error',
      summary: errMsg,
    });
    return Promise.reject(new Error(errMsg));
  },
  (error: AxiosError<ApiResponse>) => {
    return handleError(error);
  }
);

/**
 * 封装的请求方法
 */
export const request = {
  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get<ApiResponse<T>>(url, config).then((res) => res.data.data);
  },

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  },

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  },

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.patch<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  },

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete<ApiResponse<T>>(url, config).then((res) => res.data.data);
  },

  /**
   * 上传文件
   */
  async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return instance
      .post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      })
      .then((res) => res.data.data);
  },

  /**
   * 下载文件
   */
  async download(url: string, filename: string, config?: AxiosRequestConfig): Promise<void> {
    return instance
      .get(url, {
        ...config,
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  },
};

// 导出 axios 实例供特殊场景使用
export { instance as api };
