<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { roleApi, permissionApi } from '@/api';
import { notify } from '@/plugins';
import type { RoleEntity, CreateRoleDto, PermissionEntity } from '@pkg/types';

const roles = ref<RoleEntity[]>([]);
const permissions = ref<PermissionEntity[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingRole = ref<RoleEntity | null>(null);
const formData = ref<CreateRoleDto>({
  name: '',
  code: '',
  description: '',
  permissionIds: [],
});

const loadRoles = async () => {
  loading.value = true;
  try {
    const res = await roleApi.getList({ page: 1, pageSize: 100 });
    roles.value = res.items;
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '加载失败', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadPermissions = async () => {
  try {
    const res = await permissionApi.getList({ page: 1, pageSize: 100 });
    permissions.value = res.items;
  } catch (error: any) {
    notify({
      severity: 'error',
      summary: '错误',
      detail: error.message || '加载权限失败',
      life: 3000,
    });
  }
};

const openDialog = (role?: RoleEntity) => {
  if (role) {
    editingRole.value = role;
    formData.value = {
      name: role.name,
      code: role.code,
      description: role.description,
      permissionIds: [],
    };
  } else {
    editingRole.value = null;
    formData.value = {
      name: '',
      code: '',
      description: '',
      permissionIds: [],
    };
  }
  dialogVisible.value = true;
};

const handleSave = async () => {
  try {
    if (editingRole.value) {
      await roleApi.update(editingRole.value.id, formData.value);
      notify({ severity: 'success', summary: '成功', detail: '更新成功', life: 3000 });
    } else {
      await roleApi.create(formData.value);
      notify({ severity: 'success', summary: '成功', detail: '创建成功', life: 3000 });
    }
    dialogVisible.value = false;
    loadRoles();
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '保存失败', life: 3000 });
  }
};

const handleDelete = async (id: string) => {
  try {
    await roleApi.delete(id);
    notify({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 });
    loadRoles();
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '删除失败', life: 3000 });
  }
};

onMounted(() => {
  loadRoles();
  loadPermissions();
});
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">角色管理</h1>
      <Button label="新建角色" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <DataTable :value="roles" :loading="loading">
      <Column field="name" header="角色名称" />
      <Column field="code" header="角色编码" />
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
      :header="editingRole ? '编辑角色' : '新建角色'"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-2 block">角色名称</label>
          <InputText v-model="formData.name" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">角色编码</label>
          <InputText v-model="formData.code" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">描述</label>
          <Textarea v-model="formData.description" class="w-full" :rows="3" />
        </div>
        <div>
          <label class="mb-2 block">权限</label>
          <MultiSelect
            v-model="formData.permissionIds"
            :options="permissions"
            optionLabel="name"
            optionValue="id"
            class="w-full"
          />
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <Button label="取消" severity="secondary" @click="dialogVisible = false" />
        <Button label="保存" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>
