import type { Component, FunctionalComponent } from 'vue';
import type { ProFormFieldProps, ProFormOption } from '../types';

import { computed, isRef, onMounted, ref, shallowRef, toRef } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Cascader from 'primevue/cascadeselect';
import DatePicker from 'primevue/datepicker';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import ToggleSwitch from 'primevue/toggleswitch';
import Slider from 'primevue/slider';

interface FieldResolverCallbacks {
  onUpdateModelValue: (value: any) => void;
  onChange: (value: any) => void;
}

const componentMap = {
  input: InputText,
  textarea: Textarea,
  'input-number': InputNumber,
  select: Select,
  cascader: Cascader,
  date: DatePicker,
  daterange: DatePicker,
  switch: ToggleSwitch,
  checkbox: Checkbox,
  radio: RadioButton,
  slider: Slider,
  text: 'div',
};

export function useProFormField(props: ProFormFieldProps, callbacks: FieldResolverCallbacks) {
  const { onUpdateModelValue, onChange } = callbacks;

  const field = toRef(props, 'field');
  const asyncOptions = shallowRef<ProFormOption[]>([]);
  const isLoading = ref(false);

  async function getAsyncOptions() {
    if (!('options' in field.value)) return;

    if (Array.isArray(field.value.options)) {
      asyncOptions.value = field.value.options;
      return;
    }

    if (isRef(field.value.options)) {
      asyncOptions.value = field.value.options.value;
      return;
    }

    if (typeof field.value.options === 'function') {
      try {
        isLoading.value = true;
        const promise = field.value.options();
        asyncOptions.value = promise instanceof Promise ? await promise : promise;
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  onMounted(getAsyncOptions);

  const FieldComponent = computed<Component | FunctionalComponent | string>(() => {
    if (field.value.type === 'component') {
      return field.value.component;
    }

    if (field.value.type === 'render') {
      return field.value.render;
    }

    return componentMap[field.value.type] || 'div';
  });

  const fieldProps = computed(() => {
    let common: any = {
      modelValue: props.modelValue,
      'onUpdate:modelValue': onUpdateModelValue,
      onChange,
      placeholder: field.value.placeholder,
    };

    if ('props' in field.value) {
      common = { ...common, ...field.value.props };
    }

    switch (field.value.type) {
      case 'daterange':
        common = { ...common, selectionMode: 'range' };
        break;
      case 'select':
      case 'cascader':
      case 'checkbox':
      case 'radio':
        common = { ...common, options: asyncOptions.value, loading: isLoading.value };
        break;
    }

    return common;
  });

  return { Component: FieldComponent, props: fieldProps };
}
