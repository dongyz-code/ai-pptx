import { merge } from 'lodash-es';
import type { ToastServiceMethods, ToastMessageOptions } from 'primevue';

/**
 * Toast 实例
 */
let toastInstance: ToastServiceMethods | null = null;

const defaultOptions: ToastMessageOptions = {
  severity: 'info',
  life: 3000,
};

/**

/**
 * 设置 Toast 实例
 * @param instance Toast 服务实例
 */
export function setToastInstance(instance: ToastServiceMethods) {
  toastInstance = instance;
}

/**
 * 获取 Toast 实例
 */
function getToastInstance(): ToastServiceMethods {
  if (!toastInstance) {
    console.warn('[Notify] Toast instance not initialized.');
    // 返回空操作的实例,避免报错
    return {} as ToastServiceMethods;
  }
  return toastInstance;
}

/**
 * 显示 Toast 消息
 * @param options 消息选项
 */
export function notify(options: ToastMessageOptions = {}) {
  const instance = getToastInstance();
  instance.add(merge({}, defaultOptions, options));
}
