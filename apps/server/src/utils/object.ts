export function getKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function getValues<T extends object>(obj: T) {
  return Object.values(obj) as T[keyof T][];
}

export function getEntries<T extends object>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
