<template>
  <view class="page">
    <view class="page-header">
      <text class="page-title">选择适合你的方案</text>
      <text class="page-subtitle">14 天免费试用，随时取消</text>
    </view>

    <view class="plans">
      <view :class="['plan-card', selectedTier === 'FREE' ? 'plan-active' : '']" @click="selectedTier = 'FREE'">
        <text class="plan-name">Free</text>
        <text class="plan-price">$0<text class="plan-period">/月</text></text>
        <text class="plan-desc">适合起步阶段的个人用户</text>
        <view class="plan-features">
          <text class="feature" v-for="f in freeFeatures" :key="f">✓ {{ f }}</text>
        </view>
      </view>

      <view :class="['plan-card', selectedTier === 'PRO' ? 'plan-active plan-pro' : '']" @click="selectedTier = 'PRO'">
        <view class="plan-badge">推荐</view>
        <text class="plan-name">Pro</text>
        <text class="plan-price">$19<text class="plan-period">/月</text></text>
        <text class="plan-desc">适合需要自动化工具的专业用户</text>
        <view class="plan-features">
          <text class="feature" v-for="f in proFeatures" :key="f">✓ {{ f }}</text>
        </view>
      </view>

      <view :class="['plan-card', selectedTier === 'STUDIO' ? 'plan-active plan-studio' : '']" @click="selectedTier = 'STUDIO'">
        <text class="plan-name">Enterprise</text>
        <text class="plan-price">$49<text class="plan-period">/月</text></text>
        <text class="plan-desc">适合团队或企业用户</text>
        <view class="plan-features">
          <text class="feature" v-for="f in enterpriseFeatures" :key="f">✓ {{ f }}</text>
        </view>
      </view>
    </view>

    <button class="btn-primary btn-subscribe" @click="handleSubscribe">
      开始 {{ selectedTier }} 方案
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const selectedTier = ref('PRO');

const freeFeatures = ['最多 5 个客户', '基础日历', '手动开票'];
const proFeatures = ['无限客户', '高级排程', '自动开票', 'Stripe 在线收款', '客户门户'];
const enterpriseFeatures = ['Pro 全部功能', '团队协作', '数据分析面板', '自定义品牌', 'API 接入'];

function handleSubscribe() {
  uni.showToast({ title: `请在 Web 端完成 ${selectedTier.value} 方案订阅`, icon: 'none' });
}
</script>

<style scoped>
.page { background: #F0F2F5; min-height: 100vh; padding: 40rpx 32rpx; }
.page-header { text-align: center; margin-bottom: 40rpx; }
.page-title { font-size: 38rpx; font-weight: 800; color: #1F2937; display: block; }
.page-subtitle { font-size: 26rpx; color: #6B7280; display: block; margin-top: 8rpx; }

.plans { display: flex; flex-direction: column; gap: 20rpx; }
.plan-card {
  background: #fff; border-radius: 20rpx; padding: 32rpx 28rpx;
  border: 3rpx solid transparent; position: relative;
}
.plan-active { border-color: #4F46E5; }
.plan-pro { border-color: #10B981; }
.plan-studio { border-color: #7C3AED; }
.plan-badge {
  position: absolute; top: -8rpx; right: 28rpx;
  background: #10B981; color: #fff; font-size: 22rpx;
  padding: 4rpx 16rpx; border-radius: 20rpx;
}
.plan-name { font-size: 28rpx; font-weight: 700; color: #4F46E5; display: block; }
.plan-price { font-size: 56rpx; font-weight: 800; color: #1F2937; display: block; margin-top: 8rpx; }
.plan-period { font-size: 26rpx; font-weight: 400; color: #9CA3AF; }
.plan-desc { font-size: 24rpx; color: #6B7280; display: block; margin-top: 4rpx; }
.plan-features { margin-top: 20rpx; }
.feature { font-size: 26rpx; color: #4B5563; display: block; padding: 6rpx 0; }

.btn-subscribe {
  width: 100%; margin-top: 40rpx; padding: 28rpx 0;
  font-size: 32rpx; border-radius: 16rpx;
}
</style>