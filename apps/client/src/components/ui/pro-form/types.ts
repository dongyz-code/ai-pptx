import type { Component, ComputedRef, Ref, VNode } from 'vue';
import type { z } from 'zod';
import type { InputTextProps } from 'primevue/inputtext';
import type { TextareaProps } from 'primevue/textarea';
import type { InputNumberProps } from 'primevue/inputnumber';
import type { SelectProps } from 'primevue/select';
import type { CascadeSelectProps } from 'primevue/cascadeselect';
import type { DatePickerProps } from 'primevue/datepicker';
import type { ToggleSwitchProps } from 'primevue/toggleswitch';
import type { CheckboxProps } from 'primevue/checkbox';
import type { RadioButtonProps } from 'primevue/radiobutton';
import type { SliderProps } from 'primevue/slider';

export interface ProFormOption {
  label: string;
  value: any;
  disabled?: boolean;
  children?: ProFormOption[];
  [key: string]: any;
}

export type ProFormOptions =
  | ProFormOption[]
  | Ref<ProFormOption[]>
  | ComputedRef<ProFormOption[]>
  | (() => ProFormOption[])
  | (() => Promise<ProFormOption[]>);

interface ProFormFieldBase {
  key: string;
  label: string;
  placeholder?: string;
  colSpan?: number;
  visible?: boolean | ((ctx: { model: Record<string, any> }) => boolean);
  slot?: string | boolean;
  defaultValue?: any;
  schema?: z.ZodType<any>;
}

export type InputField = ProFormFieldBase & {
  type: 'input';
  props?: Partial<InputTextProps>;
};

export type TextareaField = ProFormFieldBase & {
  type: 'textarea';
  props?: Partial<TextareaProps>;
};

export type InputNumberField = ProFormFieldBase & {
  type: 'input-number';
  props?: Partial<InputNumberProps>;
};

export type SelectField = ProFormFieldBase & {
  type: 'select';
  options: ProFormOptions;
  props?: Partial<SelectProps>;
};

export type CascaderField = ProFormFieldBase & {
  type: 'cascader';
  options: ProFormOptions;
  props?: Partial<CascadeSelectProps>;
};

export type DateField = ProFormFieldBase & {
  type: 'date';
  props?: Partial<DatePickerProps>;
};

export type DateRangeField = ProFormFieldBase & {
  type: 'daterange';
  props?: Partial<DatePickerProps>;
};

export type SwitchField = ProFormFieldBase & {
  type: 'switch';
  props?: Partial<ToggleSwitchProps>;
};

export type CheckboxField = ProFormFieldBase & {
  type: 'checkbox';
  options: ProFormOptions;
  props?: Partial<CheckboxProps>;
};

export type RadioField = ProFormFieldBase & {
  type: 'radio';
  options: ProFormOptions;
  props?: Partial<RadioButtonProps>;
};

export type SliderField = ProFormFieldBase & {
  type: 'slider';
  props?: Partial<SliderProps>;
};

export type ComponentField = ProFormFieldBase & {
  type: 'component';
  component: Component;
};

export type RenderField = ProFormFieldBase & {
  type: 'render';
  render: (props: any) => VNode;
};

export type StaticField = ProFormFieldBase & {
  type: 'text';
};

export type ProFormField =
  | InputField
  | TextareaField
  | InputNumberField
  | SelectField
  | CascaderField
  | DateField
  | DateRangeField
  | SwitchField
  | CheckboxField
  | RadioField
  | SliderField
  | StaticField
  | ComponentField
  | RenderField;

export interface ProFormProps {
  modelValue: Record<string, any>;
  options: ProFormField[];
  schema?: z.ZodObject<any>;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'top' | 'right';
  collapseToRows?: number;
  defaultCollapsed?: boolean;
  showCollapse?: boolean;
  submitText?: string;
  resetText?: string;
  formProps?: Record<string, any>;
}

export interface ProFormEmits {
  'update:modelValue': [value: Record<string, any>];
  submit: [values: Record<string, any>];
  reset: [];
  change: [key: string, value: any, model: Record<string, any>];
  toggle: [collapsed: boolean];
}

export interface ProFormExpose {
  validate: () => Promise<void>;
  clearValidate: () => void;
  resetFields: () => void;
}

export interface ProFormFieldProps {
  field: ProFormField;
  modelValue: any;
}
