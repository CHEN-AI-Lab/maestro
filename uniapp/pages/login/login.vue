<template>
  <view class="page">
    <view class="header">
      <text class="header-icon">🔐</text>
      <text class="header-title">登录 SaaSPro</text>
    </view>

    <view class="form">
      <view class="input-group">
        <text class="label">邮箱</text>
        <input class="input" v-model="email" type="text" placeholder="请输入邮箱地址" />
      </view>
      <view class="input-group">
        <text class="label">密码</text>
        <input class="input" v-model="password" type="password" placeholder="请输入密码" />
      </view>
      <button class="btn-primary btn-full" @click="handleLogin">登录</button>

      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">或</text>
        <view class="divider-line"></view>
      </view>

      <button class="btn-oauth btn-google" @click="loginGoogle">
        <text>Google 登录</text>
      </button>
      <button class="btn-oauth btn-github" @click="loginGithub">
        <text>GitHub 登录</text>
      </button>

      <view class="footer">
        <text>还没有账号？<text class="link">注册</text></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/index.js';

const email = ref('');
const password = ref('');
const auth = useAuthStore();

async function handleLogin() {
  if (!email.value || !password.value) {
    uni.showToast({ title: '请输入邮箱和密码', icon: 'none' });
    return;
  }
  try {
    const res = await uni.request({
      url: 'http://localhost:3000/api/auth/callback/credentials',
      method: 'POST',
      data: { email: email.value, password: password.value },
    });
    // 简化：假设成功
    auth.setAuth({ id: '1', name: '用户', email: email.value, role: 'ADMIN' }, 'token_demo');
    uni.switchTab({ url: '/pages/dashboard/dashboard' });
  } catch (e) {
    uni.showToast({ title: '登录失败，请检查网络或凭证', icon: 'none' });
  }
}

function loginGoogle() {
  uni.showToast({ title: '请在 Web 端完成 Google 登录', icon: 'none' });
}

function loginGithub() {
  uni.showToast({ title: '请在 Web 端完成 GitHub 登录', icon: 'none' });
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F0F2F5;
  padding: 80rpx 40rpx;
}
.header { text-align: center; margin-bottom: 60rpx; }
.header-icon { font-size: 80rpx; display: block; }
.header-title { font-size: 40rpx; font-weight: 800; color: #1F2937; display: block; margin-top: 16rpx; }
.form { background: #fff; border-radius: 20rpx; padding: 48rpx 32rpx; }
.input-group { margin-bottom: 32rpx; }
.label { font-size: 26rpx; color: #6B7280; display: block; margin-bottom: 10rpx; }
.input {
  width: 100%;
  height: 88rpx;
  background: #F9FAFB;
  border: 2rpx solid #E5E7EB;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
}
.btn-full { width: 100%; padding: 28rpx 0; font-size: 32rpx; }
.divider { display: flex; align-items: center; margin: 36rpx 0; }
.divider-line { flex: 1; height: 2rpx; background: #E5E7EB; }
.divider-text { margin: 0 24rpx; color: #9CA3AF; font-size: 26rpx; }
.btn-oauth {
  width: 100%;
  padding: 24rpx 0;
  border-radius: 12rpx;
  border: 2rpx solid #E5E7EB;
  background: #fff;
  font-size: 28rpx;
  margin-bottom: 16rpx;
}
.btn-google { border-color: #DB4437; color: #DB4437; }
.btn-github { border-color: #333; color: #333; }
.footer { text-align: center; margin-top: 36rpx; font-size: 26rpx; color: #6B7280; }
.link { color: #4F46E5; }
</style>