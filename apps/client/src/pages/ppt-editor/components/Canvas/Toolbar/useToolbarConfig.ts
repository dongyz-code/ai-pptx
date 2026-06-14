import { computed } from 'vue';
import { useSelectedElements } from '@/pages/ppt-editor/hooks';
import { useSlides } from '@/pages/ppt-editor/models';
import { MIN_SIZE } from '@/constants';
import type { IconName } from '@/components/ui';
import type { PPTElement, PPTImageElement, PPTTextElement } from '@/types';

export type ToolbarItemType =
  | 'group'
  | 'button'
  | 'toggle'
  | 'input'
  | 'select'
  | 'color'
  | 'menu'
  | 'separator';

export type ToolbarRule = boolean | ((state: ToolbarState) => boolean);

export interface ToolbarItemOption {
  label: string;
  value: string | number | boolean;
}

export interface ToolbarItem {
  id: string;
  type: ToolbarItemType;
  label?: string;
  icon?: IconName;
  command?: string;
  payload?: unknown | ((state: ToolbarState) => unknown);
  valueKey?: string;
  placeholder?: string;
  options?: ToolbarItemOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  width?: number;
  visible?: ToolbarRule;
  enabled?: ToolbarRule;
  children?: ToolbarItem[];
}

export interface ToolbarSchema {
  id: string;
  forTypes: PPTElement['type'][] | 'any' | 'multi';
  items: ToolbarItem[];
}

export interface ToolbarSelection {
  ids: string[];
  types: PPTElement['type'][];
  isMulti: boolean;
  isEmpty: boolean;
}

export interface ToolbarState {
  selection: ToolbarSelection;
  computed: Record<string, unknown>;
  mixedKeys: Set<string>;
}

type CommandHandler = (payload: unknown) => void;

const MIXED = Symbol('mixed');

const FONT_OPTIONS: ToolbarItemOption[] = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Microsoft YaHei', value: 'Microsoft YaHei' },
];

const FILTER_PRESETS: Record<string, PPTImageElement['filters']> = {
  none: {},
  grayscale: { grayscale: '100%' },
  sepia: { sepia: '70%' },
  contrast: { contrast: '140%' },
};

const commonTransformItems: ToolbarItem[] = [
  {
    id: 'layer.menu',
    type: 'menu',
    label: 'Layer',
    icon: 'solar:widget-2-bold',
    children: [
      {
        id: 'layer.front',
        type: 'button',
        label: 'Bring To Front',
        icon: 'mdi:arrow-up-bold',
        command: 'layer.bringToFront',
      },
      {
        id: 'layer.forward',
        type: 'button',
        label: 'Bring Forward',
        icon: 'mdi:arrow-up-bold',
        command: 'layer.bringForward',
      },
      {
        id: 'layer.backward',
        type: 'button',
        label: 'Send Backward',
        icon: 'mdi:arrow-down-bold',
        command: 'layer.sendBackward',
      },
      {
        id: 'layer.back',
        type: 'button',
        label: 'Send To Back',
        icon: 'mdi:arrow-down-bold',
        command: 'layer.sendToBack',
      },
    ],
  },
  { id: 'sep.common.1', type: 'separator' },
  {
    id: 'group.transform',
    type: 'group',
    label: 'Transform',
    children: [
      {
        id: 'pos.x',
        type: 'input',
        label: 'X',
        valueKey: 'left',
        command: 'common.setLeft',
        unit: 'px',
        step: 1,
        width: 62,
      },
      {
        id: 'pos.y',
        type: 'input',
        label: 'Y',
        valueKey: 'top',
        command: 'common.setTop',
        unit: 'px',
        step: 1,
        width: 62,
      },
      {
        id: 'size.w',
        type: 'input',
        label: 'W',
        valueKey: 'width',
        command: 'common.setWidth',
        unit: 'px',
        step: 1,
        width: 70,
      },
      {
        id: 'size.h',
        type: 'input',
        label: 'H',
        valueKey: 'height',
        command: 'common.setHeight',
        unit: 'px',
        step: 1,
        width: 70,
      },
      {
        id: 'transform.rotate',
        type: 'input',
        label: 'R',
        valueKey: 'rotate',
        command: 'common.setRotate',
        unit: '°',
        step: 1,
        width: 62,
      },
      {
        id: 'style.opacity',
        type: 'input',
        label: 'O',
        valueKey: 'opacity',
        command: 'common.setOpacity',
        min: 0,
        max: 1,
        step: 0.05,
        width: 66,
      },
    ],
  },
];

const textItems: ToolbarItem[] = [
  {
    id: 'group.text',
    type: 'group',
    label: 'Text',
    children: [
      {
        id: 'text.font',
        type: 'select',
        label: 'Font',
        valueKey: 'fontFamily',
        options: FONT_OPTIONS,
        command: 'text.setFontFamily',
      },
      {
        id: 'text.size',
        type: 'input',
        label: 'Size',
        valueKey: 'fontSize',
        command: 'text.setFontSize',
        step: 1,
        min: 8,
        width: 64,
      },
      {
        id: 'text.bold',
        type: 'toggle',
        label: 'B',
        icon: 'solar:text-bold',
        valueKey: 'bold',
        command: 'text.setBold',
      },
      {
        id: 'text.italic',
        type: 'toggle',
        label: 'I',
        valueKey: 'italic',
        command: 'text.setItalic',
      },
      {
        id: 'text.align',
        type: 'menu',
        label: 'Align',
        children: [
          {
            id: 'text.align.left',
            type: 'button',
            label: 'Left',
            command: 'text.setAlign',
            payload: 'left',
          },
          {
            id: 'text.align.center',
            type: 'button',
            label: 'Center',
            command: 'text.setAlign',
            payload: 'center',
          },
          {
            id: 'text.align.right',
            type: 'button',
            label: 'Right',
            command: 'text.setAlign',
            payload: 'right',
          },
          {
            id: 'text.align.justify',
            type: 'button',
            label: 'Justify',
            command: 'text.setAlign',
            payload: 'justify',
          },
        ],
      },
      {
        id: 'text.color',
        type: 'color',
        label: 'Color',
        valueKey: 'color',
        command: 'text.setColor',
      },
    ],
  },
];

const imageItems: ToolbarItem[] = [
  {
    id: 'group.image',
    type: 'group',
    label: 'Image',
    children: [
      {
        id: 'image.crop',
        type: 'button',
        label: 'Crop',
        icon: 'mdi:vector-union',
        command: 'image.applyCropPreset',
      },
      {
        id: 'image.radius',
        type: 'input',
        label: 'Radius',
        valueKey: 'radius',
        command: 'image.setRadius',
        min: 0,
        step: 1,
        width: 72,
      },
      {
        id: 'image.filter',
        type: 'select',
        label: 'Filter',
        valueKey: 'filterPreset',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Grayscale', value: 'grayscale' },
          { label: 'Sepia', value: 'sepia' },
          { label: 'High Contrast', value: 'contrast' },
          { label: 'Custom', value: 'custom' },
        ],
        command: 'image.setFilterPreset',
      },
    ],
  },
];

const commonSchema: ToolbarSchema = {
  id: 'toolbar.common',
  forTypes: 'any',
  items: [...commonTransformItems],
};

const textSchema: ToolbarSchema = {
  id: 'toolbar.text',
  forTypes: ['text'],
  items: [...textItems, { id: 'sep.text.common', type: 'separator' }, ...commonTransformItems],
};

const imageSchema: ToolbarSchema = {
  id: 'toolbar.image',
  forTypes: ['image'],
  items: [...imageItems, { id: 'sep.image.common', type: 'separator' }, ...commonTransformItems],
};

const multiSchema: ToolbarSchema = {
  id: 'toolbar.multi',
  forTypes: 'multi',
  items: [...commonTransformItems],
};

const schemaRegistry = new Map<string, ToolbarSchema>([
  ['common', commonSchema],
  ['text', textSchema],
  ['image', imageSchema],
  ['multi', multiSchema],
]);

const resolveSchema = (selection: ToolbarSelection) => {
  if (selection.isEmpty) return null;
  if (selection.isMulti) {
    if (selection.types.length === 1) {
      return schemaRegistry.get(selection.types[0]) ?? commonSchema;
    }
    return schemaRegistry.get('multi') ?? commonSchema;
  }
  return schemaRegistry.get(selection.types[0]) ?? commonSchema;
};

const resolveMixedValue = <T>(values: T[]) => {
  if (!values.length) return undefined;
  const first = values[0];
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] !== first) return MIXED;
  }
  return first;
};

const normalizeFontWeight = (value: PPTTextElement['fontWeight']) => {
  if (value === 'bold') return true;
  if (typeof value === 'number') return value >= 600;
  return false;
};

const getFilterPreset = (filters: PPTImageElement['filters']) => {
  if (!filters || Object.keys(filters).length === 0) return 'none';
  const entries = Object.entries(FILTER_PRESETS);
  for (const [key, preset] of entries) {
    const presetKeys = Object.keys(preset || {});
    if (!presetKeys.length) continue;
    let matched = true;
    for (const presetKey of presetKeys) {
      if (filters?.[presetKey as keyof PPTImageElement['filters']] !== preset[presetKey as never]) {
        matched = false;
        break;
      }
    }
    if (matched) return key;
  }
  return 'custom';
};

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const clamp = (value: number, min?: number, max?: number) => {
  let v = value;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);
  return v;
};

export function useToolbarConfig() {
  const { selectedElements } = useSelectedElements();
  const slidesStore = useSlides();

  const selection = computed<ToolbarSelection>(() => {
    const ids = selectedElements.value.map((el) => el.id);
    const typeSet = new Set<PPTElement['type']>();
    for (const el of selectedElements.value) {
      typeSet.add(el.type);
    }
    return {
      ids,
      types: Array.from(typeSet),
      isMulti: ids.length > 1,
      isEmpty: ids.length === 0,
    };
  });

  const toolbarState = computed<ToolbarState>(() => {
    const elements = selectedElements.value;
    const mixedKeys = new Set<string>();
    const computedValues: Record<string, unknown> = {};

    const setValue = (key: string, value: unknown) => {
      if (value === MIXED) {
        mixedKeys.add(key);
        computedValues[key] = null;
      } else {
        computedValues[key] = value;
      }
    };

    setValue('left', resolveMixedValue(elements.map((el) => el.left)));
    setValue('top', resolveMixedValue(elements.map((el) => el.top)));
    setValue('width', resolveMixedValue(elements.map((el) => el.width)));
    setValue('height', resolveMixedValue(elements.map((el) => el.height)));
    setValue('rotate', resolveMixedValue(elements.map((el) => el.rotate)));
    setValue(
      'opacity',
      resolveMixedValue(
        elements.map((el) => {
          const value = (el as { opacity?: number }).opacity;
          return typeof value === 'number' ? value : 1;
        })
      )
    );

    const textElements = elements.filter((el) => el.type === 'text') as PPTTextElement[];
    if (textElements.length) {
      setValue('fontFamily', resolveMixedValue(textElements.map((el) => el.defaultFontName || '')));
      setValue('fontSize', resolveMixedValue(textElements.map((el) => el.fontSize ?? 16)));
      setValue(
        'bold',
        resolveMixedValue(textElements.map((el) => normalizeFontWeight(el.fontWeight)))
      );
      setValue('italic', resolveMixedValue(textElements.map((el) => el.fontStyle === 'italic')));
      setValue('textAlign', resolveMixedValue(textElements.map((el) => el.textAlign ?? 'left')));
      setValue('color', resolveMixedValue(textElements.map((el) => el.defaultColor || '#000000')));
    }

    const imageElements = elements.filter((el) => el.type === 'image') as PPTImageElement[];
    if (imageElements.length) {
      setValue('radius', resolveMixedValue(imageElements.map((el) => el.radius ?? 0)));
      setValue(
        'filterPreset',
        resolveMixedValue(imageElements.map((el) => getFilterPreset(el.filters)))
      );
    }

    return {
      selection: selection.value,
      computed: computedValues,
      mixedKeys,
    };
  });

  const commandHandlers: Record<string, CommandHandler> = {
    'common.setLeft': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateElementsByKey('left', value);
    },
    'common.setTop': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateElementsByKey('top', value);
    },
    'common.setWidth': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateElementsBySize('width', value);
    },
    'common.setHeight': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateElementsBySize('height', value);
    },
    'common.setRotate': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateElementsByKey('rotate', value);
    },
    'common.setOpacity': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateElementsByKey('opacity', clamp(value, 0, 1));
    },
    'text.setFontFamily': (payload) => {
      if (typeof payload !== 'string') return;
      updateTextElements({ defaultFontName: payload });
    },
    'text.setFontSize': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateTextElements({ fontSize: Math.max(8, value) });
    },
    'text.setBold': (payload) => {
      const value = Boolean(payload);
      updateTextElements({ fontWeight: value ? 'bold' : 'normal' });
    },
    'text.setItalic': (payload) => {
      const value = Boolean(payload);
      updateTextElements({ fontStyle: value ? 'italic' : 'normal' });
    },
    'text.setAlign': (payload) => {
      if (typeof payload !== 'string') return;
      updateTextElements({ textAlign: payload as PPTTextElement['textAlign'] });
    },
    'text.setColor': (payload) => {
      if (typeof payload !== 'string') return;
      updateTextElements({ defaultColor: payload });
    },
    'image.setRadius': (payload) => {
      const value = toNumber(payload);
      if (value === null) return;
      updateImageElements({ radius: Math.max(0, value) });
    },
    'image.setFilterPreset': (payload) => {
      if (typeof payload !== 'string') return;
      if (payload === 'custom') return;
      const preset = FILTER_PRESETS[payload] ?? {};
      updateImageElements({ filters: { ...preset } });
    },
    'image.applyCropPreset': () => {
      updateImageElements({
        clip: {
          range: [
            [10, 10],
            [90, 90],
          ],
          shape: 'rect',
        },
      });
    },
    'layer.bringToFront': () => reorderByLayer('front'),
    'layer.sendToBack': () => reorderByLayer('back'),
    'layer.bringForward': () => reorderByLayer('forward'),
    'layer.sendBackward': () => reorderByLayer('backward'),
  };

  const executeCommand = (commandId?: string, payload?: unknown) => {
    if (!commandId) return;
    const handler = commandHandlers[commandId];
    if (handler) handler(payload);
  };

  const updateElements = (updates: { id: string; props: Partial<PPTElement> }[]) => {
    slidesStore.updateElements(updates);
  };

  const updateElementsByKey = (key: string, value: unknown) => {
    const updates = selectedElements.value.map((el) => ({
      id: el.id,
      props: { [key]: value } as Partial<PPTElement>,
    }));
    updateElements(updates);
  };

  const updateElementsBySize = (key: 'width' | 'height', value: number) => {
    const updates = selectedElements.value.map((el) => {
      const minSize = MIN_SIZE[el.type] ?? 20;
      const next = Math.max(minSize, value);
      const patch: Partial<PPTElement> = { [key]: next } as Partial<PPTElement>;

      if ('fixedRatio' in el && el.fixedRatio && el.width > 0 && el.height > 0) {
        if (key === 'width') {
          patch.height = Math.max(minSize, (next * el.height) / el.width);
        } else {
          patch.width = Math.max(minSize, (next * el.width) / el.height);
        }
      }

      return { id: el.id, props: patch };
    });
    updateElements(updates);
  };

  const updateTextElements = (patch: Partial<PPTTextElement>) => {
    const updates = selectedElements.value
      .filter((el) => el.type === 'text')
      .map((el) => ({ id: el.id, props: patch as Partial<PPTElement> }));
    updateElements(updates);
  };

  const updateImageElements = (patch: Partial<PPTImageElement>) => {
    const updates = selectedElements.value
      .filter((el) => el.type === 'image')
      .map((el) => ({ id: el.id, props: patch as Partial<PPTElement> }));
    updateElements(updates);
  };

  const reorderByLayer = (direction: 'front' | 'back' | 'forward' | 'backward') => {
    const ids = selection.value.ids;
    if (!ids.length) return;
    const selectedSet = new Set(ids);
    const slide = slidesStore.state.slides[slidesStore.state.sliderIndex];
    const list = slide.elements.slice();

    if (direction === 'front') {
      const remaining = list.filter((el) => !selectedSet.has(el.id));
      const selected = list.filter((el) => selectedSet.has(el.id));
      slidesStore.setElements([...remaining, ...selected]);
      return;
    }

    if (direction === 'back') {
      const remaining = list.filter((el) => !selectedSet.has(el.id));
      const selected = list.filter((el) => selectedSet.has(el.id));
      slidesStore.setElements([...selected, ...remaining]);
      return;
    }

    if (direction === 'forward') {
      for (let i = list.length - 2; i >= 0; i -= 1) {
        if (selectedSet.has(list[i].id) && !selectedSet.has(list[i + 1].id)) {
          [list[i], list[i + 1]] = [list[i + 1], list[i]];
        }
      }
      slidesStore.setElements(list);
      return;
    }

    for (let i = 1; i < list.length; i += 1) {
      if (selectedSet.has(list[i].id) && !selectedSet.has(list[i - 1].id)) {
        [list[i], list[i - 1]] = [list[i - 1], list[i]];
      }
    }
    slidesStore.setElements(list);
  };

  const schema = computed(() => resolveSchema(selection.value));

  return {
    schema,
    state: toolbarState,
    selection,
    executeCommand,
  };
}
