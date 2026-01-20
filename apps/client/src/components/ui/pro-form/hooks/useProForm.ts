import type { EmitFn } from 'vue';
import type { ProFormEmits, ProFormField, ProFormProps } from '../types';
import { useForm } from '@primevue/forms';
import { computed, ref } from 'vue';
import { useResponsiveCols } from './useResponsiveCols';

type ProFormHookProps = {
  props: ProFormProps;
  emit: EmitFn<ProFormEmits>;
};

export function useProForm({ props, emit }: ProFormHookProps) {
  const collapsed = ref<boolean>(props.defaultCollapsed ?? true);
  const { currentCols } = useResponsiveCols();

  const { defineField, handleSubmit: formSubmit, resetForm, errors, values } = useForm({
    resolver: props.schema ? (values) => {
      const result = props.schema!.safeParse(values);
      if (result.success) return { values: result.data };
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      return { errors };
    } : undefined,
  });

  const internalModel = computed<Record<string, any>>({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const visibleFields = computed(() => {
    return props.options.filter((field) => {
      if (field.visible === undefined) return true;
      if (typeof field.visible === 'boolean') return field.visible;
      return field.visible({ model: internalModel.value });
    });
  });

  const needCollapse = computed(() => {
    if (!props.showCollapse) return false;
    const totalSpan = visibleFields.value.reduce((total, field) => {
      return total + Math.min(field.colSpan || 1, currentCols.value);
    }, 0);
    return totalSpan > (props.collapseToRows ?? 1) * currentCols.value;
  });

  const displayFields = computed<ProFormField[]>(() => {
    if (!needCollapse.value || !collapsed.value) return visibleFields.value;
    const maxColsInFirstRow = currentCols.value - 1;
    let currentSpan = 0;
    const result: ProFormField[] = [];
    for (const field of visibleFields.value) {
      const fieldSpan = Math.min(field.colSpan || 1, maxColsInFirstRow);
      if (currentSpan + fieldSpan <= maxColsInFirstRow) {
        result.push(field);
        currentSpan += fieldSpan;
      } else break;
    }
    return result;
  });

  const showCollapseButton = computed(() => needCollapse.value && props.showCollapse);

  function handleFieldChange(key: string, value: any) {
    emit('change', key, value, internalModel.value);
  }

  function toggleCollapse() {
    collapsed.value = !collapsed.value;
    emit('toggle', collapsed.value);
  }

  const handleSubmit = formSubmit((values) => {
    emit('submit', { ...values });
  });

  function handleReset() {
    const resetValues: Record<string, any> = {};
    props.options.forEach((field) => {
      resetValues[field.key] = field.defaultValue ?? undefined;
    });
    internalModel.value = resetValues;
    resetForm();
    emit('reset');
  }

  function getSlotName(field: ProFormField) {
    if (typeof field.slot === 'string') return field.slot;
    if (field.slot === true) return `field-${field.key}`;
    return null;
  }

  function getColSpanStyle(colSpan?: number) {
    if (!colSpan || colSpan === 1) return {};
    const actualSpan = Math.min(colSpan, currentCols.value);
    return { gridColumn: `span ${actualSpan} / span ${actualSpan}` };
  }

  async function validate() {
    if (!props.schema) return;
    const result = props.schema.safeParse(values);
    if (!result.success) throw result.error;
  }

  function clearValidate() {
    Object.keys(errors).forEach(key => delete errors[key]);
  }

  return {
    defineField,
    collapsed,
    internalModel,
    displayFields,
    showCollapseButton,
    currentCols,
    errors,
    handleFieldChange,
    toggleCollapse,
    handleSubmit,
    handleReset,
    getSlotName,
    getColSpanStyle,
    validate,
    clearValidate,
    resetFields: handleReset,
  };
}
