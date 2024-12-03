export function getContainer(container: string | Element | HTMLElement) {
  if (typeof container === 'string') {
    const dom = document.querySelector(container);
    if (!dom) {
      throw new Error(`container ${container} not found`);
    }
    return dom;
  }

  return container as HTMLElement;
}
