<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { permissionApi } from '@/api';
import { notify } from '@/plugins';
import type { PermissionEntity, CreatePermissionDto } from '@pkg/types';

const permissions = ref<PermissionEntity[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingPermission = ref<PermissionEntity | null>(null);
const formData = ref<CreatePermissionDto>({
  name: '',
  code: '',
  description: '',
});

const loadPermissions = async () => {
  loading.value = true;
  try {
    const res = await permissionApi.getList({ page: 1, pageSize: 100 });
    permissions.value = res.items;
  } catch (error) {
    notify({ severity: 'error', summary: '错误', detail: (error as Error).message || '加载失败' });
  } finally {
    loading.value = false;
  }
};

const openDialog = (permission?: PermissionEntity) => {
  if (permission) {
    editingPermission.value = permission;
    formData.value = {
      name: permission.name,
      code: permission.code,
      description: permission.description,
    };
  } else {
    editingPermission.value = null;
    formData.value = {
      name: '',
      code: '',
      description: '',
    };
  }
  dialogVisible.value = true;
};

const handleSave = async () => {
  try {
    if (editingPermission.value) {
      await permissionApi.update(editingPermission.value.id, formData.value);
      notify({ severity: 'success', summary: '成功', detail: '更新成功', life: 3000 });
    } else {
      await permissionApi.create(formData.value);
      notify({ severity: 'success', summary: '成功', detail: '创建成功', life: 3000 });
    }
    dialogVisible.value = false;
    loadPermissions();
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '保存失败', life: 3000 });
  }
};

const handleDelete = async (id: string) => {
  try {
    await permissionApi.delete(id);
    notify({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 });
    loadPermissions();
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '删除失败', life: 3000 });
  }
};

onMounted(() => {
  loadPermissions();
});
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">权限管理</h1>
      <Button label="新建权限" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <DataTable :value="permissions" :loading="loading">
      <Column field="name" header="权限名称" />
      <Column field="code" header="权限编码" />
      <Column field="description" header="描述" />
      <Column header="操作">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button label="编辑" size="small" @click="openDialog(data)" />
            <Button label="删除" size="small" severity="danger" @click="handleDelete(data.id)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="dialogVisible"
      :header="editingPermission ? '编辑权限' : '新建权限'"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-2 block">权限名称</label>
          <InputText v-model="formData.name" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">权限编码</label>
          <InputText v-model="formData.code" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">描述</label>
          <Textarea v-model="formData.description" class="w-full" :rows="3" />
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <Button label="取消" severity="secondary" @click="dialogVisible = false" />
        <Button label="保存" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>
