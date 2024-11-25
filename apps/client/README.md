# AI PPTX 项目-前端

## 技术栈

- Vue3
- TypeScript
- TSX
- PrimeVue
- Vite
- Pinia
- Vue Router
- Tailwind CSS

## Vue3 + TSX 基本语法

- 使用 `defineComponent` 定义组件

## vue 指令

### 被替代的指令

- `v-if` 等价于`<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>`
- `v-for` 等价于 `<div>{list.map((item) => <div>{item}</div>)}</div>`
- `v-on` 等价于 `onClick={() => {}}`

### 继续使用的指令

- `v-show` 等价于 `<div v-show={ok.value}>show</div>`
- `v-model` 等价于 `<Input v-model={value} />`
