import { ref, type Ref } from 'vue';
import { z } from 'zod';
import type { ProFormFieldSchema, ValidationResult } from '../types';

/**
 * Zod Form Validator
 * 提供字段级和表单级校验能力
 */
export interface UseZodValidatorOptions {
  fields: ProFormFieldSchema[];
  formData: Ref<Record<string, any>>;
}

export interface UseZodValidatorReturn {
  errors: Ref<Record<string, string>>;
  validateField: (key: string) => Promise<boolean>;
  validateForm: () => Promise<ValidationResult>;
  clearValidate: (keys?: string[]) => void;
  setFieldError: (key: string, message: string) => void;
}

export function useZodValidator(options: UseZodValidatorOptions): UseZodValidatorReturn {
  const { fields, formData } = options;
  const errors = ref<Record<string, string>>({});

  /**
   * 校验单个字段
   */
  const validateField = async (key: string): Promise<boolean> => {
    const field = fields.find((f) => f.key === key);
    if (!field || !field.schema) {
      // 没有配置 schema，视为通过
      delete errors.value[key];
      return true;
    }

    try {
      await field.schema.parseAsync(formData.value[key]);
      delete errors.value[key];
      return true;
    } catch (error) {
      if (error instanceof z.ZodError && error.issues?.length) {
        errors.value[key] = error.issues[0].message;
      } else {
        errors.value[key] = '校验失败';
      }
      return false;
    }
  };

  /**
   * 校验整个表单
   */
  const validateForm = async (): Promise<ValidationResult> => {
    const validationPromises = fields
      .filter((field) => field.schema && !field.hideInForm)
      .map((field) => validateField(field.key));

    const results = await Promise.all(validationPromises);
    const valid = results.every((result) => result);

    return {
      valid,
      errors: { ...errors.value },
    };
  };

  /**
   * 清除校验错误
   */
  const clearValidate = (keys?: string[]) => {
    if (!keys) {
      errors.value = {};
    } else {
      keys.forEach((key) => {
        delete errors.value[key];
      });
    }
  };

  /**
   * 手动设置字段错误
   */
  const setFieldError = (key: string, message: string) => {
    errors.value[key] = message;
  };

  return {
    errors,
    validateField,
    validateForm,
    clearValidate,
    setFieldError,
  };
}
