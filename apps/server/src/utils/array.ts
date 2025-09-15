type ConditionalKeys<T, K> = keyof T;
type ItemA = number | string;
interface ItemB {
  [key: string]: any;
}
/**
 * 数组对象化
 */
export function arrObject<T extends ItemA>(arr: T[]): Record<string, true>;
export function arrObject<T extends ItemB, K extends ConditionalKeys<T, ItemA>>(
  arr: T[],
  key: K | K[]
): Record<string, T>;
export function arrObject<T extends ItemB, K extends ConditionalKeys<T, ItemA>, U extends boolean>(
  arr: T[],
  key: K | K[],
  bool: U
): Record<string, U>;
export function arrObject<T extends ItemB, K extends ConditionalKeys<T, ItemA>, U extends keyof T>(
  arr: T[],
  key: K | K[],
  bool: U
): Record<string, T[U]>;
export function arrObject<T extends Record<string, any>, F extends keyof T, V extends keyof T>(
  arr: T[] | string[] | number[],
  key?: string,
  value?: V | true
) {
  const map = {} as Record<string, T | T[V] | true>;

  if (!arr?.length) {
    return map;
  }

  for (const item of arr) {
    if (typeof item === 'string' || typeof item === 'number') {
      map[item as string] = true;
    } else if (!key) {
      map[item as unknown as string] = true;
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
