<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="pointer-events-none fixed top-4 left-1/2 z-[9999] -translate-x-1/2"
      @mousedown.stop
    >
      <div
        class="pointer-events-auto flex items-center gap-3 rounded-[12px] border border-black/10 bg-white/95 px-3 py-2 text-[12px] text-[#1a1a2e] shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur"
      >
        <template v-for="item in schema?.items" :key="item.id">
          <ToolbarItemRenderer :item="item" :state="state" @command="onCommand" />
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, PropType, ref } from 'vue';
import { VIcon } from '@/components/ui';
import {
  useToolbarConfig,
  type ToolbarItem,
  type ToolbarState,
  type ToolbarRule,
} from './useToolbarConfig';

const { schema, state, selection, executeCommand } = useToolbarConfig();

const show = computed(() => !!schema.value && !selection.value.isEmpty);

const resolveRule = (rule: ToolbarRule | undefined, toolbarState: ToolbarState) => {
  if (rule === undefined) return true;
  if (typeof rule === 'boolean') return rule;
  return rule(toolbarState);
};

const getValue = (item: ToolbarItem, toolbarState: ToolbarState) => {
  if (!item.valueKey) return undefined;
  return toolbarState.computed[item.valueKey];
};

const isMixed = (item: ToolbarItem, toolbarState: ToolbarState) => {
  if (!item.valueKey) return false;
  return toolbarState.mixedKeys.has(item.valueKey);
};

const onCommand = (commandId?: string, payload?: unknown) => {
  if (!commandId) return;
  executeCommand(commandId, payload);
};

const ToolbarItemRenderer = defineComponent({
  name: 'ToolbarItemRenderer',
  props: {
    item: {
      type: Object as PropType<ToolbarItem>,
      required: true,
    },
    state: {
      type: Object as PropType<ToolbarState>,
      required: true,
    },
  },
  emits: ['command'],
  setup(props, { emit }) {
    const menuOpen = ref(false);

    const handleCommand = (payload?: unknown) => {
      if (!props.item.command) return;
      const finalPayload =
        typeof props.item.payload === 'function'
          ? props.item.payload(props.state)
          : (payload ?? props.item.payload);
      emit('command', props.item.command, finalPayload);
    };

    return () => {
      const item = props.item;
      const toolbarState = props.state;
      const visible = resolveRule(item.visible, toolbarState);
      if (!visible) return null;

      const enabled = resolveRule(item.enabled, toolbarState);
      const value = getValue(item, toolbarState);
      const mixed = isMixed(item, toolbarState);

      if (item.type === 'separator') {
        return h('div', { class: 'h-5 w-px bg-black/10' });
      }

      if (item.type === 'group') {
        return h('div', { class: 'flex items-center gap-2' }, [
          item.label
            ? h(
                'span',
                {
                  class: 'text-[10px] font-semibold tracking-[0.12em] text-black/35 uppercase',
                },
                item.label
              )
            : null,
          h(
            'div',
            { class: 'flex items-center gap-2' },
            item.children?.map((child) =>
              h(ToolbarItemRenderer, {
                key: child.id,
                item: child,
                state: toolbarState,
                onCommand: (id: string, payload: unknown) => emit('command', id, payload),
              })
            )
          ),
        ]);
      }

      if (item.type === 'menu') {
        return h('div', { class: 'relative' }, [
          h(
            'button',
            {
              class: [
                'flex items-center gap-1.5 rounded-[8px] border border-black/10 bg-white px-2.5 py-1 text-[12px] text-black/70 transition hover:border-black/20 hover:text-black',
                !enabled ? 'cursor-not-allowed opacity-40' : '',
              ],
              disabled: !enabled,
              onClick: () => {
                if (!enabled) return;
                menuOpen.value = !menuOpen.value;
              },
            },
            [
              item.icon ? h(VIcon, { icon: item.icon }) : null,
              h('span', item.label),
              h('span', { class: 'text-[10px]' }, 'v'),
            ]
          ),
          menuOpen.value
            ? h(
                'div',
                {
                  class:
                    'absolute left-0 mt-2 min-w-[140px] rounded-[10px] border border-black/10 bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)]',
                },
                [
                  h(
                    'div',
                    { class: 'flex flex-col gap-1' },
                    item.children?.map((child) =>
                      h(ToolbarItemRenderer, {
                        key: child.id,
                        item: child,
                        state: toolbarState,
                        onCommand: (id: string, payload: unknown) => {
                          emit('command', id, payload);
                          menuOpen.value = false;
                        },
                      })
                    )
                  ),
                ]
              )
            : null,
        ]);
      }

      if (item.type === 'button') {
        return h(
          'button',
          {
            class: [
              'flex items-center gap-1.5 rounded-[8px] border border-black/10 bg-white px-2.5 py-1 text-[12px] text-black/70 transition hover:border-black/20 hover:text-black',
              !enabled ? 'cursor-not-allowed opacity-40' : '',
            ],
            disabled: !enabled,
            onClick: () => handleCommand(),
          },
          [item.icon ? h(VIcon, { icon: item.icon }) : null, h('span', item.label)]
        );
      }

      if (item.type === 'toggle') {
        const active = Boolean(value);
        return h(
          'button',
          {
            class: [
              'flex h-7 items-center justify-center rounded-[8px] border px-2.5 text-[12px] transition',
              active
                ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                : 'border-black/10 bg-white text-black/60 hover:border-black/20',
              mixed ? 'border-dashed' : '',
              !enabled ? 'cursor-not-allowed opacity-40' : '',
            ],
            disabled: !enabled,
            onClick: () => handleCommand(!active),
          },
          [item.icon ? h(VIcon, { icon: item.icon }) : null, !item.icon ? item.label : null]
        );
      }

      if (item.type === 'select') {
        const valueText = mixed ? '' : (value ?? '');
        return h('label', { class: 'flex items-center gap-2' }, [
          item.label ? h('span', { class: 'text-[11px] text-black/45' }, item.label) : null,
          h(
            'select',
            {
              class:
                'h-7 rounded-[8px] border border-black/10 bg-white px-2 text-[12px] text-[#1a1a2e] transition outline-none focus:border-indigo-500',
              value: valueText as string | number,
              disabled: !enabled,
              onChange: (event: Event) => handleCommand((event.target as HTMLSelectElement).value),
            },
            [
              mixed ? h('option', { value: '', disabled: true }, '-') : null,
              ...(item.options?.map((option) =>
                h(
                  'option',
                  { key: String(option.value), value: option.value as string | number },
                  option.label
                )
              ) ?? []),
            ]
          ),
        ]);
      }

      if (item.type === 'color') {
        const valueText = mixed ? '#000000' : (value as string | undefined);
        return h('label', { class: 'flex items-center gap-2' }, [
          item.label ? h('span', { class: 'text-[11px] text-black/45' }, item.label) : null,
          h('input', {
            class: 'h-7 w-8 rounded-[8px] border border-black/10 bg-white px-1.5',
            type: 'color',
            value: valueText || '#000000',
            disabled: !enabled,
            onInput: (event: Event) => handleCommand((event.target as HTMLInputElement).value),
          }),
        ]);
      }

      if (item.type === 'input') {
        const valueText = mixed ? '' : (value ?? '');
        return h('label', { class: 'flex items-center gap-2' }, [
          item.label ? h('span', { class: 'text-[11px] text-black/45' }, item.label) : null,
          h('div', { class: 'relative' }, [
            h('input', {
              class:
                'h-7 rounded-[8px] border border-black/10 bg-white px-2 text-[12px] text-[#1a1a2e] transition outline-none focus:border-indigo-500',
              style: item.width ? { width: `${item.width}px` } : undefined,
              type: 'number',
              min: item.min,
              max: item.max,
              step: item.step,
              placeholder: mixed ? '-' : item.placeholder,
              value: valueText as string | number,
              disabled: !enabled,
              onChange: (event: Event) => handleCommand((event.target as HTMLInputElement).value),
            }),
            item.unit
              ? h(
                  'span',
                  {
                    class:
                      'pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-black/35',
                  },
                  item.unit
                )
              : null,
          ]),
        ]);
      }

      return null;
    };
  },
});
</script>

<style lang="postcss">
.toolbar-shadow {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
}
</style>
