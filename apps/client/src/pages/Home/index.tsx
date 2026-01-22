import { defineComponent, ref } from 'vue';
import { Button } from 'primevue';
import { routerPush } from '@/utils/route';

const Home = defineComponent({
  name: 'Home',
  setup() {
    const goEditor = () => {
      routerPush({ name: 'Editor' });
    };

    const features = [
      {
        icon: 'pi-sparkles',
        title: 'AI 智能生成',
        description: '输入主题，AI 自动生成专业演示文稿',
      },
      {
        icon: 'pi-palette',
        title: '精美模板',
        description: '多种设计风格，一键应用主题',
      },
      {
        icon: 'pi-bolt',
        title: '快速编辑',
        description: '直观的编辑器，实时预览效果',
      },
      {
        icon: 'pi-download',
        title: '多格式导出',
        description: '支持 PPTX、PDF 等多种格式',
      },
    ];

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div class="container mx-auto px-4 py-16">
          <div class="mb-16 text-center">
            <h1 class="mb-6 text-6xl font-bold text-gray-900">
              AI-PPT
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 智能演示</span>
            </h1>
            <p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600">让 AI 帮你创建专业演示文稿，节省时间，提升效率</p>
            <div class="flex justify-center gap-4">
              <Button onClick={goEditor} label="开始创作" icon="pi pi-plus" size="large" class="px-8 py-3 text-lg" />
              <Button
                label="查看示例"
                icon="pi pi-eye"
                severity="secondary"
                outlined
                size="large"
                class="px-8 py-3 text-lg"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div class="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                class="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <i class={`pi ${feature.icon} text-xl text-white`}></i>
                </div>
                <h3 class="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p class="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Preview Section */}
          <div class="mb-16 rounded-2xl bg-white p-8 shadow-2xl">
            <h2 class="mb-6 text-center text-3xl font-bold text-gray-900">简单三步，完成演示</h2>
            <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div class="text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <span class="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-900">输入主题</h3>
                <p class="text-gray-600">告诉 AI 你的演示主题和要点</p>
              </div>
              <div class="text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <span class="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-900">AI 生成</h3>
                <p class="text-gray-600">AI 自动生成专业的演示内容</p>
              </div>
              <div class="text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                  <span class="text-2xl font-bold text-pink-600">3</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-900">编辑导出</h3>
                <p class="text-gray-600">自由编辑并导出为多种格式</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div class="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
            <h2 class="mb-4 text-3xl font-bold">准备好创建你的第一个 AI 演示了吗？</h2>
            <p class="mb-8 text-xl opacity-90">立即开始，体验 AI 驱动的演示创作</p>
            <Button
              onClick={goEditor}
              label="立即开始"
              icon="pi pi-arrow-right"
              size="large"
              severity="secondary"
              class="bg-white px-10 py-4 text-lg text-blue-600 hover:bg-gray-100"
            />
          </div>
        </div>

        {/* Footer */}
        <footer class="border-t border-gray-200 py-8">
          <div class="container mx-auto px-4 text-center text-gray-600">
            <p>© 2026 AI-PPT. 让演示创作更简单.</p>
          </div>
        </footer>
      </div>
    );
  },
});

export default Home;
