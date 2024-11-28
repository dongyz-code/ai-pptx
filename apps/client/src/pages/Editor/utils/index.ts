import { KonvaOption } from '../types';

export function getContainer(container: KonvaOption['container']) {
  if (typeof container === 'string') {
    const dom = document.querySelector(container);
    if (!dom) throw new Error(`container ${container} not found`);
    return dom;
  }

  return container;
}
