export function arrObject<T extends string | number>(arr?: T[]): Record<T, true>;
export function arrObject<T, F extends keyof T>(arr: T[], key: F, value: true): Record<F, true>;
export function arrObject<T, F extends keyof T>(arr: T[], key: F): Record<F, T>;
export function arrObject<T extends Record<string, any>, F extends keyof T, V extends keyof T>(
  arr: T[],
  key: F,
  value: V
): Record<F, T[V]>;
export function arrObject<T extends Record<string, any>, F extends keyof T, V extends keyof T>(
  arr?: T[] | string[] | number[],
  key?: F,
  value?: V | true
) {
  const map = {} as Record<string, T | T[V] | true>;

  if (!arr?.length) {
    return map;
  }

  for (const item of arr) {
    if (typeof item === 'string' || typeof item === 'number') {
      map[item] = true;
    } else if (!key) {
      //
    } else if (value === true) {
      map[item[key]] = true;
    } else if (typeof value === 'string') {
      map[item[key]] = item[value];
    } else {
      map[item[key]] = item;
    }
  }
  return map;
}
