import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useUserStore } from '@/models/user';
import { router } from '@/router';
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
 * 处理 401 未授权错误，跳转到登录页
 */
function handleUnauthorized() {
  const userStore = useUserStore();

  userStore.logout();
  const currentRoute = router.currentRoute.value;
  const redirectUrl = currentRoute.fullPath;

  if (currentRoute.name !== 'Login')
    router.push({
      name: 'Login',
      query: {
        redirect: redirectUrl,
      },
    });
}

/**
 * 获取错误信息
 */
function getErrorMessage(error: AxiosError<ApiResponse>) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  } else if (error.response && error.response.status) {
    const { status } = error.response;
    switch (status) {
      case 401:
        return '请重新登录';
      case 403:
        return '拒绝访问';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器内部错误';
      case 502:
        return '网关错误';
      case 503:
        return '服务不可用';
      case 504:
        return '网关超时';
    }
  } else if (error.code === 'ECONNABORTED') {
    return '请求超时,请稍后重试';
  } else if (error.message === 'Network Error') {
    return '网络连接失败,请检查网络';
  } else {
    return error.message || '请求失败';
  }
}

/**
 * 错误处理
 */
function handleError(error: AxiosError<ApiResponse>) {
  const message = getErrorMessage(error);

  notify({
    severity: 'error',
    summary: 'Error',
    detail: message,
  });

  if (error.response && error.response.status === 401) {
    handleUnauthorized();
  }

  return Promise.reject(message);
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
