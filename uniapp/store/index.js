// ============================================================
// SaaSPro uni-app Store — 全局状态管理 (Pinia)
// ============================================================

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const token = ref<string>('');

  const isLoggedIn = computed(() => !!user.value && !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  function setAuth(u: AuthUser, t: string) {
    user.value = u;
    token.value = t;
    uni.setStorageSync('saaspro_token', t);
    uni.setStorageSync('saaspro_user', JSON.stringify(u));
  }

  function restoreAuth() {
    const t = uni.getStorageSync('saaspro_token');
    const u = uni.getStorageSync('saaspro_user');
    if (t && u) {
      token.value = t;
      user.value = JSON.parse(u);
    }
  }

  function clearAuth() {
    user.value = null;
    token.value = '';
    uni.removeStorageSync('saaspro_token');
    uni.removeStorageSync('saaspro_user');
  }

  return { user, token, isLoggedIn, isAdmin, setAuth, restoreAuth, clearAuth };
});