<template>
  <view class="page">
    <view class="profile-header card">
      <view class="avatar">{{ client.name?.charAt(0) }}</view>
      <text class="name">{{ client.name }}</text>
      <text class="tags">{{ client.tags?.join(', ') || '未设置标签' }}</text>
    </view>

    <view class="info-section card">
      <view class="info-row">
        <text class="info-label">邮箱</text>
        <text class="info-value">{{ client.email || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">电话</text>
        <text class="info-value">{{ client.phone || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">备注</text>
        <text class="info-value">{{ client.notes || '-' }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">事件记录</text>
      <view v-if="events.length === 0" class="empty-small">
        <text>暂无事件记录</text>
      </view>
      <view v-for="e in events" :key="e.id" class="event-item">
        <view class="event-left">
          <text class="event-date">{{ formatDate(e.startTime) }}</text>
          <text class="event-time">{{ formatTime(e.startTime) }} - {{ formatTime(e.endTime) }}</text>
        </view>
        <view class="event-right">
          <text class="event-title">{{ e.title }}</text>
          <text :class="['tag', 'tag-' + (e.status || 'scheduled').toLowerCase()]">{{ statusLabel(e.status) }}</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="btn-primary" @click="editClient">编辑信息</button>
      <button class="btn-danger" @click="confirmDelete">删除客户</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const client = ref({ name: '', email: '', phone: '', tags: [], notes: '' });
const events = ref([]);

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : ''; }
function formatTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
}
function statusLabel(s) {
  const map = { SCHEDULED: '已排程', COMPLETED: '已完成', CANCELLED: '已取消', NO_SHOW: '未出席' };
  return map[s] || s;
}

async function loadClient(id) {
  try {
    const res = await uni.request({ url: `http://localhost:3000/api/clients/${id}` });
    if (res.statusCode === 200 && res.data) client.value = res.data as any;
  } catch (e) {}
}

async function loadEvents(id) {
  try {
    const res = await uni.request({ url: `http://localhost:3000/api/events?clientId=${id}` });
    if (res.statusCode === 200 && res.data) events.value = res.data as any;
  } catch (e) {}
}

function editClient() {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' });
}

function confirmDelete() {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除客户「${client.value.name}」吗？此操作不可恢复。`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await uni.request({
            url: `http://localhost:3000/api/clients/${client.value.id}`,
            method: 'DELETE',
          });
          uni.showToast({ title: '已删除' });
          setTimeout(() => uni.navigateBack(), 1000);
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' });
        }
      }
    },
  });
}

onMounted(() => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  const id = (page as any).options?.id || (page as any).$page?.options?.id;
  if (id) {
    loadClient(id);
    loadEvents(id);
  }
});
</script>

<style scoped>
.page { background: #F0F2F5; min-height: 100vh; padding: 24rpx 32rpx 120rpx; }
.profile-header { text-align: center; padding: 48rpx 0; }
.avatar {
  width: 120rpx; height: 120rpx; border-radius: 50%; margin: 0 auto 20rpx;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 56rpx; font-weight: 700;
}
.name { font-size: 38rpx; font-weight: 700; color: #1F2937; display: block; }
.tags { font-size: 26rpx; color: #6B7280; display: block; margin-top: 8rpx; }

.info-section { margin-top: 20rpx; }
.info-row { display: flex; justify-content: space-between; padding: 16rpx 0; border-bottom: 1rpx solid #F3F4F6; }
.info-label { font-size: 26rpx; color: #9CA3AF; }
.info-value { font-size: 26rpx; color: #1F2937; text-align: right; max-width: 60%; }

.section { margin-top: 32rpx; }
.section-title { font-size: 32rpx; font-weight: 700; color: #1F2937; display: block; margin-bottom: 16rpx; }

.event-item { display: flex; background: #fff; border-radius: 12rpx; padding: 20rpx 24rpx; margin-bottom: 12rpx; }
.event-left { min-width: 180rpx; }
.event-date { font-size: 24rpx; color: #1F2937; font-weight: 600; display: block; }
.event-time { font-size: 22rpx; color: #9CA3AF; display: block; }
.event-right { flex: 1; display: flex; justify-content: space-between; align-items: center; }
.event-title { font-size: 26rpx; color: #1F2937; }

.actions { margin-top: 40rpx; display: flex; gap: 20rpx; }
.btn-primary { flex: 1; padding: 24rpx 0; border-radius: 12rpx; font-size: 28rpx; }
.btn-danger { flex: 1; padding: 24rpx 0; border-radius: 12rpx; font-size: 28rpx; background: #FEE2E2; color: #EF4444; border: 2rpx solid #FECACA; }

.empty-small { text-align: center; padding: 40rpx 0; color: #9CA3AF; font-size: 26rpx; }
</style>