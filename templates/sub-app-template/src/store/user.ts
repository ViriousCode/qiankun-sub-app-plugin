// sub-app/src/store/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const permissions = ref<string[]>([]);
  
  // 🚨 子应用也保持一致的结构
  const userInfo = ref({
    userName: '',
    roleId: '',
    roleKey: '',
    avatar: '',
    nickName: ''
  });

  // 设置 Token
  const setToken = (t: string) => {
    token.value = t;
  };

  // 🚨 【核心新增】：接收主应用传来的 userInfo 对象
  const setUserInfo = (info: any) => {
    if (!info) {
      reset();
      return;
    }
    // 使用 Object.assign 或者直接赋值来更新
    userInfo.value = { ...userInfo.value, ...info };
  };

  // 设置权限
  const setPermissions = (perms: string[]) => {
    permissions.value = perms || [];
  };

  // 重置状态
  const reset = () => {
    token.value = '';
    permissions.value = [];
    userInfo.value = {
      userName: '',
      roleId: '',
      roleKey: '',
      avatar: '',
      nickName: ''
    };
  };

  return { 
    token, 
    userInfo, // 导出 userInfo
    permissions, 
    setToken, 
    setUserInfo, 
    setPermissions, 
    reset 
  };
});