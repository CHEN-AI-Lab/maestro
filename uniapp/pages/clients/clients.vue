<template>
  <view class="page">
    <view class="header">
      <text class="title">客户管理</text>
      <button class="btn-add" @click="showForm = true">+ 添加</button>
    </view>

    <view class="list" v-if="clients.length > 0">
      <view
        v-for="c in clients"
        :key="c.id"
        class="client-card card"
        @click="goDetail(c.id)"
      >
        <view class="client-avatar">
          <text>{{ c.name.charAt(0) }}</text>
        </view>
        <view class="client-info">
          <text class="client-name">{{ c.name }}</text>
          <text class="client-meta">
            {{ c.email || '无邮箱' }}
          </text>
        </view>
        <text class="client-arrow">›</text>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-icon">👥</text>
      <text class="empty-text">还没有添加客户</text>
      <text class="empty-hint">点击右上角添加第一位客户</text>
    </view>

    <!-- Add Client Modal -->
    <view class="modal-mask" v-if="showForm" @click="showForm = false">
      <view class="modal" @click.stop>
        <text class="modal-title">添加客户</text>
        <input class="input" v-model="form.name" placeholder="客户姓名 *" />
        <input class="input" v-model="form.email" placeholder="邮箱（选填）" type="text" />
        <input class="input" v-model="form.phone" placeholder="电话（选填）" />
        <input class="input" v-model="form.tags" placeholder="标签（选填，逗号分隔）" />
        <textarea class="textarea" v-model="form.notes" placeholder="备注（选填）" />
        <view class="modal-btns">
          <button class="btn-cancel" @click="showForm = false">取消</button>
          <button class="btn-primary" @click="handleAdd">确认添加</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showForm = ref(false);
const clients = ref([]);

const form = ref({ name: '', email: '', phone: '', tags: '', notes: '' });

function goDetail(id) {
  uni.navigateTo({ url: `/pages/clients/client-detail?id=${id}` });
}

async function handleAdd() {
  if (!form.value.name) {
    uni.showToast({ title: '请输入客户姓名', icon: 'none' });
    return;
  }
  try {
    const res = await uni.request({
      url: 'http://localhost:3000/api/clients',
      method: 'POST',
      data: { ...form.value, tags: form.value.tags ? form.value.tags.split(',').map((t: string) => t.trim()) : [] },
    });
    if (res.statusCode === 201 || res.statusCode === 200) {
      uni.showToast({ title: '添加成功' });
      showForm.value = false;
      form.value = { name: '', email: '', phone: '', tags: '', notes: '' };
      loadClients();
    }
  } catch (e) {
    uni.showToast({ title: '添加失败', icon: 'none' });
  }
}

async function loadClients() {
  try {
    const res = await uni.request({ url: 'http://localhost:3000/api/clients' });
    if (res.statusCode === 200 && res.data) {
      clients.value = res.data as any;
    }
  } catch (e) {
    // fail silently
  }
}

onMounted(loadClients);
</script>

<style scoped>
.page { background: #F0F2F5; min-height: 100vh; padding: 24rpx 32rpx; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.title { font-size: 36rpx; font-weight: 800; color: #1F2937; }
.btn-add { background: #4F46E5; color: #fff; padding: 12rpx 28rpx; border-radius: 12rpx; font-size: 26rpx; font-weight: 600; border: none; }

.client-card { display: flex; align-items: center; gap: 20rpx; }
.client-avatar {
  width: 80rpx; height: 80rpx; border-radius: 50%;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 36rpx; font-weight: 700;
}
.client-info { flex: 1; }
.client-name { font-size: 30rpx; font-weight: 600; color: #1F2937; display: block; }
.client-meta { font-size: 24rpx; color: #6B7280; display: block; margin-top: 4rpx; }
.client-arrow { font-size: 40rpx; color: #D1D5DB; }

.empty { text-align: center; padding: 160rpx 0; }
.empty-icon { font-size: 100rpx; display: block; }
.empty-text { font-size: 32rpx; color: #9CA3AF; display: block; margin-top: 20rpx; }
.empty-hint { font-size: 24rpx; color: #D1D5DB; display: block; margin-top: 8rpx; }

.modal-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: flex-end; z-index: 999;
}
.modal {
  width: 100%; background: #fff; border-radius: 32rpx 32rpx 0 0;
  padding: 48rpx 32rpx 60rpx; max-height: 80vh; overflow-y: auto;
}
.modal-title { font-size: 34rpx; font-weight: 700; color: #1F2937; display: block; margin-bottom: 32rpx; }
.input, .textarea, .picker-display {
  width: 100%; background: #F9FAFB; border: 2rpx solid #E5E7EB;
  border-radius: 12rpx; padding: 20rpx 24rpx; font-size: 28rpx; margin-bottom: 20rpx;
}
.textarea { height: 160rpx; }
.picker-display { color: #9CA3AF; }
.modal-btns { display: flex; gap: 20rpx; margin-top: 32rpx; }
.btn-cancel {
  flex: 1; padding: 24rpx 0; border-radius: 12rpx;
  background: #F3F4F6; color: #6B7280; font-size: 28rpx; border: none;
}
.btn-primary { flex: 1; padding: 24rpx 0; border-radius: 12rpx; font-size: 28rpx; }
</style>