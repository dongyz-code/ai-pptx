<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userApi, roleApi } from '@/api';
import { notify } from '@/plugins/notify';
import type { UserListItem, CreateUserDto, UserStatus } from '@pkg/types';

const users = ref<UserListItem[]>([]);
const roles = ref<any[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingUser = ref<UserListItem | null>(null);
const formData = ref<CreateUserDto>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  status: 'active' as UserStatus,
  roleIds: [],
});

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' },
  { label: '锁定', value: 'locked' },
];

const loadUsers = async () => {
  loading.value = true;
  try {
    const res = await userApi.getList({ page: 1, pageSize: 100 });
    users.value = res.items;
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '加载失败', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadRoles = async () => {
  try {
    const res = await roleApi.getList({ page: 1, pageSize: 100 });
    roles.value = res.items;
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '加载角色失败', life: 3000 });
  }
};

const openDialog = (user?: UserListItem) => {
  if (user) {
    editingUser.value = user;
    formData.value = {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      status: user.status,
      roleIds: user.roles.map(r => r.id),
    };
  } else {
    editingUser.value = null;
    formData.value = {
      username: '',
      password: '',
      nickname: '',
      email: '',
      status: 'active' as UserStatus,
      roleIds: [],
    };
  }
  dialogVisible.value = true;
};

const handleSave = async () => {
  try {
    if (editingUser.value) {
      await userApi.update(editingUser.value.id, formData.value);
      notify({ severity: 'success', summary: '成功', detail: '更新成功', life: 3000 });
    } else {
      await userApi.create(formData.value);
      notify({ severity: 'success', summary: '成功', detail: '创建成功', life: 3000 });
    }
    dialogVisible.value = false;
    loadUsers();
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '保存失败', life: 3000 });
  }
};

const handleDelete = async (id: string) => {
  try {
    await userApi.delete(id);
    notify({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 });
    loadUsers();
  } catch (error: any) {
    notify({ severity: 'error', summary: '错误', detail: error.message || '删除失败', life: 3000 });
  }
};

onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <Button label="新建用户" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <DataTable :value="users" :loading="loading">
      <Column field="username" header="用户名" />
      <Column field="nickname" header="昵称" />
      <Column field="email" header="邮箱" />
      <Column field="status" header="状态">
        <template #body="{ data }">
          {{ statusOptions.find(s => s.value === data.status)?.label }}
        </template>
      </Column>
      <Column field="roles" header="角色">
        <template #body="{ data }">
          {{ data.roles.map((r: any) => r.name).join(', ') }}
        </template>
      </Column>
      <Column header="操作">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button label="编辑" size="small" @click="openDialog(data)" />
            <Button label="删除" size="small" severity="danger" @click="handleDelete(data.id)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" :header="editingUser ? '编辑用户' : '新建用户'" :style="{ width: '500px' }">
      <div class="space-y-4">
        <div>
          <label class="mb-2 block">用户名</label>
          <InputText v-model="formData.username" class="w-full" />
        </div>
        <div v-if="!editingUser">
          <label class="mb-2 block">密码</label>
          <InputText v-model="formData.password" type="password" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">昵称</label>
          <InputText v-model="formData.nickname" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">邮箱</label>
          <InputText v-model="formData.email" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">状态</label>
          <Dropdown v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
        </div>
        <div>
          <label class="mb-2 block">角色</label>
          <MultiSelect v-model="formData.roleIds" :options="roles" optionLabel="name" optionValue="id" class="w-full" />
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <Button label="取消" severity="secondary" @click="dialogVisible = false" />
        <Button label="保存" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>
