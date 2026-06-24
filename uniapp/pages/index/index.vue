<template>
  <view class="page">
    <view class="hero">
      <text class="hero-icon">🚀</text>
      <text class="hero-title">SaaSPro</text>
      <text class="hero-subtitle">通用业务管理平台</text>
      <text class="hero-desc">客户管理 · 日程安排 · 自动开票 · 在线收款</text>
    </view>

    <view class="features">
      <view class="feature-card" v-for="f in features" :key="f.title">
        <text class="feature-icon">{{ f.icon }}</text>
        <text class="feature-title">{{ f.title }}</text>
        <text class="feature-desc">{{ f.desc }}</text>
      </view>
    </view>

    <view class="cta">
      <button class="btn-primary" @click="goDashboard">开始使用</button>
      <text class="cta-login" @click="goLogin">已有账号？立即登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/index.js';

const auth = useAuthStore();
auth.restoreAuth();

const features = ref([
  { icon: '👥', title: '客户管理', desc: '客户档案、联系人、标签分组一目了然' },
  { icon: '📅', title: '日程安排', desc: '拖拽排程，冲突检测，日历视图' },
  { icon: '💰', title: '自动开票', desc: '按需生成发票，省时省力' },
  { icon: '💳', title: '在线收款', desc: 'Stripe 集成，客户一键支付' },
]);

function goDashboard() {
  if (auth.isLoggedIn) {
    uni.switchTab({ url: '/pages/dashboard/dashboard' });
  } else {
    uni.navigateTo({ url: '/pages/login/login' });
  }
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/login' });
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  padding: 80rpx 40rpx 60rpx;
}
.hero {
  text-align: center;
  padding: 60rpx 0 80rpx;
}
.hero-icon { font-size: 100rpx; display: block; }
.hero-title { font-size: 64rpx; font-weight: 800; color: #fff; display: block; margin-top: 20rpx; }
.hero-subtitle { font-size: 32rpx; color: rgba(255,255,255,0.85); display: block; margin-top: 12rpx; }
.hero-desc { font-size: 26rpx; color: rgba(255,255,255,0.65); display: block; margin-top: 8rpx; }
.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}
.feature-card {
  background: rgba(255,255,255,0.15);
  border-radius: 16rpx;
  padding: 28rpx 20rpx;
}
.feature-icon { font-size: 44rpx; display: block; }
.feature-title { font-size: 28rpx; font-weight: 700; color: #fff; display: block; margin-top: 8rpx; }
.feature-desc { font-size: 22rpx; color: rgba(255,255,255,0.7); display: block; margin-top: 4rpx; }
.cta { margin-top: 60rpx; text-align: center; }
.cta .btn-primary {
  display: block;
  width: 100%;
  background: #fff;
  color: #4F46E5;
  font-size: 32rpx;
  padding: 28rpx 0;
  border-radius: 16rpx;
  font-weight: 700;
}
.cta-login {
  display: block;
  margin-top: 24rpx;
  color: rgba(255,255,255,0.7);
  font-size: 26rpx;
}
</style>