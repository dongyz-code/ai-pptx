import { Extension } from '@tiptap/core';

type FontSizeOptions = {
  types: string[];
  getStyle: (fontSize: string) => string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions(): FontSizeOptions {
    return {
      types: ['textStyle'],
      getStyle: (fontSize: string) => `font-size: ${fontSize};`,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return { style: this.options.getStyle(attributes.fontSize) };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize) => {
        return ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        };
      },
      unsetFontSize: () => {
        return ({ chain }) => {
          return chain().unsetMark('textStyle').run();
        };
      },
    };
  },
});
