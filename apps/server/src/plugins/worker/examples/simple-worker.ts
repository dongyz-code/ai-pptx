/**
 * @description 简单的 Worker 示例
 * 演示如何导出函数供 WorkerPool 调用
 */

/**
 * 哈希字符串
 */
export function hash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/**
 * 压缩字符串（简单的 RLE 压缩）
 */
export function compress(data: string): string {
  let compressed = '';
  let count = 1;

  for (let i = 0; i < data.length; i++) {
    if (data[i] === data[i + 1]) {
      count++;
    } else {
      compressed += data[i] + (count > 1 ? count : '');
      count = 1;
    }
  }

  return compressed;
}

/**
 * 加密字符串（简单的凯撒密码）
 */
export function encrypt(data: string): string {
  const shift = 3;
  return data
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}
