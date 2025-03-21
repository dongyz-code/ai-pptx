import { reactive } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { uuid } from '@/utils';
import { theme as defaultTheme, layouts as defaultLayouts, slides as defaultSlides } from '../static';

import type { PPTElement, Slide, SlideTheme } from '@/types';

export interface SlideState {
  /** 演示文稿标题 */
  title: string;
  /** 演示文稿主题 */
  theme: SlideTheme;
  /** 演示文稿数据 */
  slides: Slide[];
  /** 当前页面索引 */
  sliderIndex: number;
}

export const useSlides = defineStore('slider', () => {
  const state = reactive<SlideState>({
    title: '未命名演示文稿',
    theme: defaultTheme,
    slides: defaultSlides,
    sliderIndex: 0,
  });

  const setTitle = (title: string) => {
    state.title = title;
  };

  const setTheme = (theme: SlideTheme) => {
    state.theme = { ...state.theme, ...theme };
  };

  const setSlides = (slides: Slide[]) => {
    state.slides = slides;
  };

  const addSlide = (slide?: Slide) => {
    const id = slide?.id || uuid();
    slide = slide || { id, elements: [] };
    state.slides.push(slide);
    state.sliderIndex = state.slides.length - 1;
  };

  const removeSlide = (index: number) => {
    state.slides.splice(index, 1);
  };

  const addElement = (element: PPTElement | PPTElement[]) => {
    const elements = Array.isArray(element) ? element : [element];
    const slide = state.slides[state.sliderIndex];
    slide.elements.push(...elements);
  };

  const updateElement = (info: { id: string; props: Partial<PPTElement> }) => {
    const { id, props } = info;
    const slide = state.slides[state.sliderIndex];
    const element = slide.elements.find((element) => element.id === id);
    if (element) {
      Object.assign(element, props);
    }
  };

  const setElements = (elements: PPTElement[]) => {
    const slide = state.slides[state.sliderIndex];
    slide.elements = elements;
  };

  const deleteElement = (element_id: string | string[]) => {
    const elementIds = Array.isArray(element_id) ? element_id : [element_id];
    const slide = state.slides[state.sliderIndex];
    slide.elements = slide.elements.filter((element) => !elementIds.includes(element.id));
  };

  const setSlideIndex = (index: number) => {
    state.sliderIndex = index;
  };

  return {
    state,

    setTitle,
    setTheme,
    setSlideIndex,
    setSlides,
    addSlide,
    removeSlide,

    setElements,
    addElement,
    updateElement,
    deleteElement,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSlides, import.meta.hot));
}
