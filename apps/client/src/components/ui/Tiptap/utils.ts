export const getTiptapElement = (htmlStr?: string) => {
  if (!htmlStr) return;
  const dom = new DOMParser().parseFromString(htmlStr, 'text/html').firstChild;
  if (!dom) return;
  return dom as Element;
};
