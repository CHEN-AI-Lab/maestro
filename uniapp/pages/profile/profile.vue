<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/index.js';

const auth = useAuthStore();
const userName = ref('用户');
const userEmail = ref('');

if (auth.user) {
  userName.value = auth.user.name || '用户';
  userEmail.value = auth.user.email || '';
}

function navigateTo(url) {
  uni.navigateTo({ url });
}

function logout() {
  auth.clearAuth();
  uni.reLaunch({ url: '/pages/index/index' });
}
</script>