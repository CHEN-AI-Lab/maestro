<template>
  <view class="page">
    <view class="welcome">
      <text class="welcome-text">{{ greeting }}</text>
      <text class="welcome-name">{{ userName }}</text>
    </view>

    <!-- Stats Cards -->
    <view class="stats-grid">
      <view class="stat-card stat-clients">
        <text class="stat-value">{{ stats.totalClients }}</text>
        <text class="stat-label">客户总数</text>
      </view>
      <view class="stat-card stat-events">
        <text class="stat-value">{{ stats.upcomingEvents }}</text>
        <text class="stat-label">待完成</text>
      </view>
      <view class="stat-card stat-revenue">
        <text class="stat-value">${{ stats.totalRevenue }}</text>
        <text class="stat-label">本月收入</text>
      </view>
      <view class="stat-card stat-pending">
        <text class="stat-value">{{ stats.pendingInvoices }}</text>
        <text class="stat-label">待收款</text>
      </view>
    </view>

    <!-- Today's Events -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日日程</text>
      </view>
      <view v-if="todayEvents.length === 0" class="empty">
        <text>今日暂无日程安排</text>
      </view>
      <view v-for="event in todayEvents" :key="event.id" class="event-card card">
        <view class="event-time">
          <text class="time-start">{{ formatTime(event.startTime) }}</text>
          <text class="time-end">{{ formatTime(event.endTime) }}</text>
        </view>
        <view class="event-info">
          <text class="event-title">{{ event.title }}</text>
          <text class="event-client">{{ event.client?.name || '未知客户' }}</text>
        </view>
        <view class="event-status">
          <text :class="['tag', 'tag-' + event.status.toLowerCase()]">{{ statusLabel(event.status) }}</text>
        </view>
      </view>
    </view>

    <!-- Quick Actions -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">快捷操作</text>
      </view>
      <view class="actions-grid">
        <view class="action-btn" @click="navigateTo('/pages/clients/clients')">
          <text class="action-icon">👥</text>
          <text class="action-label">添加客户</text>
        </view>
        <view class="action-btn" @click="navigateTo('/pages/calendar/calendar')">
          <text class="action-icon">📅</text>
          <text class="action-label">排程</text>
        </view>
        <view class="action-btn" @click="navigateTo('/pages/invoices/invoices')">
          <text class="action-icon">📄</text>
          <text class="action-label">开发票</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const userName = ref('用户');
const stats = ref({
  totalClients: 0,
  totalEvents: 0,
  upcomingEvents: 0,
  totalRevenue: 0,
  pendingInvoices: 0,
});

const todayEvents = ref([]);

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return '早上好';
  if (h < 18) return '下午好';
  return '晚上好';
});

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function statusLabel(s) {
  const map = { SCHEDULED: '已排程', COMPLETED: '已完成', CANCELLED: '已取消', NO_SHOW: '未出席' };
  return map[s] || s;
}

function navigateTo(url) {
  uni.navigateTo({ url });
}

onMounted(async () => {
  try {
    const res = await uni.request({ url: 'http://localhost:3000/api/dashboard/stats' });
    if (res.statusCode === 200 && res.data) {
      stats.value = res.data as any;
    }
    const eventsRes = await uni.request({
      url: `http://localhost:3000/api/events?start=${new Date().toISOString().split('T')[0]}&end=${new Date().toISOString().split('T')[0]}`,
    });
    if (eventsRes.statusCode === 200 && eventsRes.data) {
      todayEvents.value = eventsRes.data as any;
    }
  } catch (e) {
    // 网络不可用时使用默认值
  }
});
</script>

<style scoped>
.page {
  padding: 24rpx 32rpx;
  background: #F0F2F5;
  min-height: 100vh;
}
.welcome {
  padding: 24rpx 0 32rpx;
}
.welcome-text { font-size: 28rpx; color: #6B7280; display: block; }
.welcome-name { font-size: 40rpx; font-weight: 800; color: #1F2937; display: block; margin-top: 4rpx; }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}
.stat-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
}
.stat-value { font-size: 48rpx; font-weight: 800; display: block; }
.stat-label { font-size: 24rpx; color: #6B7280; display: block; margin-top: 4rpx; }
.stat-clients .stat-value { color: #4F46E5; }
.stat-events .stat-value { color: #3B82F6; }
.stat-revenue .stat-value { color: #10B981; }
.stat-pending .stat-value { color: #F59E0B; }

.section { margin-top: 40rpx; }
.section-header { margin-bottom: 16rpx; }
.section-title { font-size: 32rpx; font-weight: 700; color: #1F2937; }

.event-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.event-time { text-align: center; min-width: 100rpx; }
.time-start { font-size: 30rpx; font-weight: 700; color: #1F2937; display: block; }
.time-end { font-size: 22rpx; color: #9CA3AF; display: block; }
.event-info { flex: 1; }
.event-title { font-size: 28rpx; font-weight: 600; color: #1F2937; display: block; }
.event-client { font-size: 24rpx; color: #6B7280; display: block; }

.actions-grid {
  display: flex;
  gap: 20rpx;
}
.action-btn {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 0;
  text-align: center;
}
.action-icon { font-size: 48rpx; display: block; }
.action-label { font-size: 24rpx; color: #4B5563; display: block; margin-top: 8rpx; }

.empty {
  text-align: center;
  padding: 48rpx 0;
  color: #9CA3AF;
  font-size: 26rpx;
}
</style>