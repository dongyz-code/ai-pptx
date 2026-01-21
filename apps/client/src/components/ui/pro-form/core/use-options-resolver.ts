import { ref, watch, isRef, type Ref } from 'vue';
import type { ProFormOptions, ProFormOption } from '../types';

/**
 * Options Resolver
 * 统一处理 options 的各种形态：
 * - 普通数组
 * - Ref / Computed
 * - 同步函数
 * - 异步函数
 */
export interface UseOptionsResolverReturn {
  options: Ref<ProFormOption[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refresh: () => Promise<void>;
}

export function useOptionsResolver(
  optionsSource?: ProFormOptions
): UseOptionsResolverReturn {
  const options = ref<ProFormOption[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const resolveOptions = async () => {
    if (!optionsSource) {
      options.value = [];
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // 1. 普通数组
      if (Array.isArray(optionsSource)) {
        options.value = optionsSource;
      }
      // 2. Ref / Computed（检查是否有 value 属性）
      else if (isRef(optionsSource)) {
        options.value = optionsSource.value;
      }
      // 3. 函数
      else if (typeof optionsSource === 'function') {
        const result = optionsSource();

        // 3.1 异步函数
        if (result instanceof Promise) {
          options.value = await result;
        }
        // 3.2 同步函数
        else {
          options.value = result;
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      options.value = [];
      console.error('[ProForm] Options resolver error:', e);
    } finally {
      loading.value = false;
    }
  };

  // 初始化
  resolveOptions();

  // 监听 Ref / Computed 变化
  if (isRef(optionsSource)) {
    watch(optionsSource, resolveOptions, { deep: true });
  }

  return {
    options,
    loading,
    error,
    refresh: resolveOptions,
  };
}
