/**
 * 请求函数, 默认情况下，
 */
import { shallowRef, ref, watch, computed, Ref } from 'vue';
import { pick, debounce, throttle, set } from 'lodash-es';

export type RequestOptions<P extends object, R extends object> = {
  /** manual 如果为 true，则不会自动发起请求，需要手动调用 request 方法， 默认为 false */
  manual: boolean;

  /** immediate 是否立即请求，默认为 true */
  immediate: boolean;

  /** 请求参数 */
  params?: Ref<P>;

  /** deps key  如果传入了deps，则只有 params[dep] 变化时才会重新请求 */
  deps?: string[];

  /** 缓存 key */
  cacheKey?: string;

  /** 缓存时间 */
  cacheTime: number;

  /** 延迟显示 loading 效果的时间，默认为 0 */
  loadingDelay: number;

  /** 最短显示 loading 效果的时间，默认为 0 */
  loadingKeep: number;

  /** 需要节流毫秒数 */
  throttleWait: number;

  /** 需要防抖毫秒数 */
  debounceWait: number;

  /** 错误重试次数 */
  retryCount: number;

  /** 错误重试延迟 */
  retryDelay: number;

  /** 默认数据 */
  initialData?: R;
};

export function useRequest<R extends object, P extends object>(
  api: (p: P) => Promise<R> | R,
  options: Partial<RequestOptions<R, P>> = {}
) {
  const defaultOptions: RequestOptions<R, P> = {
    immediate: true,
    manual: false,
    cacheTime: 60 * 60 * 10,
    loadingDelay: 0,
    loadingKeep: 0,
    throttleWait: 0,
    debounceWait: 0,
    retryCount: 0,
    retryDelay: 0,
  };
  options = Object.assign({}, options, defaultOptions);

  const { manual, immediate, params, deps, cacheKey, cacheTime, initialData } = options;

  const data = shallowRef<P | undefined>(initialData);

  /** 真实的loading */
  const realLoading = ref(false);
  const delayLoading = useDelayLoading(realLoading, {
    delay: options.loadingDelay,
    keep: options.loadingKeep,
  });

  async function run(p?: P) {
    try {
      realLoading.value = true;
      const res = await api(Object.assign({}, params?.value, p));
    } catch (e) {
      console.error(e);
    } finally {
      realLoading.value = false;
    }
  }

  /** 依赖项 */
  const depsData = computed(() => {
    if (!params?.value) {
      return {};
    }

    if (!deps) {
      return params.value;
    }

    return pick(params.value, deps);
  });

  if (manual) {
    watch(depsData, () => run(), {
      immediate: immediate,
    });
  }

  return {
    data,
    loading: delayLoading,
  };
}

function useDelayLoading(loading: Ref<boolean>, option?: { delay?: number; keep?: number }) {
  const { delay = 0, keep = 0 } = option || {};
  const delayLoading = ref(false);

  let showTime: number | null = null;
  let hideTime: number | null = null;

  const start = () => {
    if (hideTime) {
      clearTimeout(hideTime);
      hideTime = null;
    }

    showTime = setTimeout(() => {
      delayLoading.value = true;
    }, delay);
  };

  const end = () => {
    if (showTime) {
      clearTimeout(showTime);
      showTime = null;
    }

    hideTime = setTimeout(() => {
      delayLoading.value = false;
    }, keep);
  };

  watch(loading, (v) => {
    if (v) {
      start();
    } else {
      end();
    }
  });

  return delayLoading;
}
