import type { Component, ComputedRef, Ref, VNode } from 'vue';
import type { z } from 'zod';

// ==================== ValueType 枚举 ====================
export type ValueType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'password'
  | 'select'
  | 'multiSelect'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'treeSelect'
  | 'date'
  | 'dateRange'
  | 'switch';

// ==================== Label 布局 ====================
export type LabelPosition = 'top' | 'left';

// ==================== Options 类型 ====================
export interface ProFormOption {
  label: string;
  value: any;
  disabled?: boolean;
  children?: ProFormOption[]; // 用于 TreeSelect
  [key: string]: any;
}

export type ProFormOptions =
  | ProFormOption[]
  | Ref<ProFormOption[]>
  | ComputedRef<ProFormOption[]>
  | (() => ProFormOption[])
  | (() => Promise<ProFormOption[]>);

// ==================== 字段配置 ====================
export interface ProFormFieldSchema {
  key: string;
  label?: string;
  tooltip?: string | VNode;
  placeholder?: string;
  valueType: ValueType;
  value?: any;
  props?: Record<string, any>;
  options?: ProFormOptions;
  schema?: z.ZodType<any>;
  hideInForm?: boolean;
  fluid?: boolean; // 是否让表单控件占满容器宽度，默认 true
  colProps?: {
    span?: number; // 占据的栅格数，默认 24（独占一行）
    xs?: number; // <576px 响应式栅格
    sm?: number; // ≥576px 响应式栅格
    md?: number; // ≥768px 响应式栅格
    lg?: number; // ≥992px 响应式栅格
    xl?: number; // ≥1200px 响应式栅格
  };
}

// ==================== 表单配置 ====================
export interface ProFormProps {
  schema: ProFormFieldSchema[];
  modelValue?: Record<string, any>;
  labelPosition?: LabelPosition; // label 位置：top（上面）或 left（左边）
  labelWidth?: string; // label 宽度（仅在 labelPosition='left' 时生效）
  grid?: boolean;
  gridProps?: {
    gutter?: number;
    cols?: number;
  };
  readonly?: boolean;
  disabled?: boolean;
}

// ==================== 校验相关 ====================
export interface FieldError {
  key: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ==================== 渲染器相关 ====================
export interface FieldRendererProps {
  field: ProFormFieldSchema;
  modelValue: any;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
}

export type FieldRenderer = Component;

// ==================== 表单实例方法 ====================
export interface ProFormInstance {
  validate: () => Promise<ValidationResult>;
  validateField: (key: string) => Promise<boolean>;
  clearValidate: (keys?: string[]) => void;
  resetFields: () => void;
  getFieldValue: (key: string) => any;
  setFieldValue: (key: string, value: any) => void;
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
}

// ==================== 事件类型 ====================
export interface ProFormEmits {
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'submit', values: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'valuesChange', changedValues: Record<string, any>, allValues: Record<string, any>): void;
}
