import type { Component } from 'vue';
import type { ValueType } from '../types';

// PrimeVue 组件导入
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import TreeSelect from 'primevue/treeselect';
import DatePicker from 'primevue/datepicker';
import ToggleSwitch from 'primevue/toggleswitch';

/**
 * ValueType 与 PrimeVue 组件的映射配置
 * 新增 valueType 只需在此处添加配置即可
 */
export interface ComponentConfig {
  component: Component;
  needsOptions?: boolean; // 是否需要 options
  isGroup?: boolean; // 是否是组合组件（如 radio group, checkbox group）
  defaultProps?: Record<string, any>; // 默认 props
}

export const COMPONENT_MAP: Record<ValueType, ComponentConfig> = {
  text: {
    component: InputText,
  },
  textarea: {
    component: Textarea,
  },
  number: {
    component: InputNumber,
  },
  password: {
    component: Password,
    defaultProps: {
      feedback: false,
    },
  },
  select: {
    component: Select,
    needsOptions: true,
    defaultProps: {
      optionLabel: 'label',
      optionValue: 'value',
    },
  },
  multiSelect: {
    component: MultiSelect,
    needsOptions: true,
    defaultProps: {
      optionLabel: 'label',
      optionValue: 'value',
    },
  },
  radio: {
    component: RadioButton,
    needsOptions: true,
    isGroup: true,
  },
  checkbox: {
    component: Checkbox,
    defaultProps: {
      binary: true,
    },
  },
  checkboxGroup: {
    component: Checkbox,
    needsOptions: true,
    isGroup: true,
  },
  treeSelect: {
    component: TreeSelect,
    needsOptions: true,
  },
  date: {
    component: DatePicker,
  },
  dateRange: {
    component: DatePicker,
    defaultProps: {
      selectionMode: 'range',
    },
  },
  switch: {
    component: ToggleSwitch,
  },
};

/**
 * 获取组件配置
 */
export function getComponentConfig(valueType: ValueType): ComponentConfig {
  const config = COMPONENT_MAP[valueType];
  if (!config) {
    console.warn(`[ProForm] Unknown valueType: ${valueType}, fallback to text`);
    return COMPONENT_MAP.text;
  }
  return config;
}
