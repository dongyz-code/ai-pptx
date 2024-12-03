import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export interface ComponentState {}

export const useComponents = defineStore('component', () => {
  const main = ref({});

  // const
});
