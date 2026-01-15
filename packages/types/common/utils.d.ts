/**
 * 获取对象类型中指定路径的类型
 */
export type GetTypeByPath<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? GetTypeByPath<T[Key], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * 获取对象类型的所有路径
 */
export type Paths<T extends object> = {
  [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${Paths<T[K]>}` | K : K) : never;
}[keyof T];
