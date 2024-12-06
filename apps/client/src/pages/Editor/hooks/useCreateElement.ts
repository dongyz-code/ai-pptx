import { useSlides } from '../models';
import { uuid } from '@/utils';

import type { PPTElement, PPTTextElement } from '@/types';

export const useCreateElement = () => {
  const slideStore = useSlides();

  const createElement = (element: PPTElement) => {
    slideStore.addElement(element);
  };

  const createTextElement = (defaultText: string = '请输入文字') => {
    const element: PPTTextElement = {
      id: uuid(),
      type: 'text',
      content: defaultText,
      defaultFontName: '宋体',
      defaultColor: '#000000',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      rotate: 0,
    };
    createElement(element);
  };

  return {
    createTextElement,
  };
};
