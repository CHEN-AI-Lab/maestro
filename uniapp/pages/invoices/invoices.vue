<template>
  <view class="page">
    <view class="header">
      <text class="title">发票管理</text>
      <button class="btn-add" @click="showForm = true">+ 新建</button>
    </view>

    <!-- Summary -->
    <view class="summary card">
      <view class="summary-item">
        <text class="summary-value">${{ totalRevenue }}</text>
        <text class="summary-label">总收入</text>
      </view>
      <view class="summary-item">
        <text class="summary-value pending">{{ pendingCount }}</text>
        <text class="summary-label">待收款</text>
      </view>
      <view class="summary-item">
        <text class="summary-value overdue">{{ overdueCount }}</text>
        <text class="summary-label">逾期</text>
      </view>
    </view>

    <view v-if="invoices.length === 0" class="empty">
      <text>暂无发票记录</text>
    </view>

    <view v-for="inv in invoices" :key="inv.id" class="invoice-card card">
      <view class="inv-left">
        <text class="inv-client">{{ inv.client?.name || '未知客户' }}</text>
        <text class="inv-date">到期: {{ formatDate(inv.dueDate) }}</text>
      </view>
      <view class="inv-right">
        <text class="inv-amount">${{ inv.amount.toFixed(2) }}</text>
        <text :class="['tag', 'tag-' + inv.status.toLowerCase()]">{{ statusLabel(inv.status) }}</text>
      </view>
    </view>

    <!-- Modal -->
    <view class="modal-mask" v-if="showForm" @click="showForm = false">
      <view class="modal" @click.stop>
        <text class="modal-title">新建发票</text>
        <picker class="picker" :range="clientNames" @change="onClientChange">
          <view class="picker-display">{{ clientNames[form.clientIdx] || '选择客户' }}</view>
        </picker>
        <input class="input" v-model="form.amount" type="digit" placeholder="金额 *" />
        <input class="input" v-model="form.dueDate" type="date" placeholder="到期日期" />
        <view class="modal-btns">
          <button class="btn-cancel" @click="showForm = false">取消</button>
          <button class="btn-primary" @click="handleAdd">确认创建</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const showForm = ref(false);
const invoices = ref([]);
const allClients = ref([]);
const clientNames = ref(['请先添加客户']);

const form = ref({ clientIdx: 0, amount: '', dueDate: '' });

const totalRevenue = computed(() => invoices.value
  .filter((i: any) => i.status === 'PAID')
  .reduce((sum: number, i: any) => sum + i.amount, 0));

const pendingCount = computed(() => invoices.value.filter((i: any) => i.status === 'PENDING').length);
const overdueCount = computed(() => invoices.value.filter((i: any) => i.status === 'OVERDUE').length);

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : ''; }
function statusLabel(s) {
  const map = { PENDING: '待付款', PAID: '已付款', OVERDUE: '逾期', REFUNDED: '已退款' };
  return map[s] || s;
}

function onClientChange(e) { form.value.clientIdx = e.detail.value; }

async function loadClients() {
  try {
    const res = await uni.request({ url: 'http://localhost:3000/api/clients' });
    if (res.statusCode === 200 && res.data) {
      allClients.value = res.data as any;
      clientNames.value = allClients.value.map((s: any) => s.name);
    }
  } catch (e) {}
}

async function loadInvoices() {
  try {
    const res = await uni.request({ url: 'http://localhost:3000/api/invoices' });
    if (res.statusCode === 200 && res.data) invoices.value = res.data as any;
  } catch (e) {}
}

async function handleAdd() {
  const client = allClients.value[form.value.clientIdx];
  if (!client) { uni.showToast({ title: '请选择客户', icon: 'none' }); return; }
  if (!form.value.amount) { uni.showToast({ title: '请输入金额', icon: 'none' }); return; }
  try {
    await uni.request({
      url: 'http://localhost:3000/api/invoices',
      method: 'POST',
      data: {
        clientId: (client as any).id,
        amount: parseFloat(form.value.amount),
        dueDate: form.value.dueDate || new Date(Date.now() + 7*86400000).toISOString().split('T')[0],
      },
    });
    uni.showToast({ title: '创建成功' });
    showForm.value = false;
    form.value = { clientIdx: 0, amount: '', dueDate: '' };
    loadInvoices();
  } catch (e) {
    uni.showToast({ title: '创建失败', icon: 'none' });
  }
}

onMounted(() => { loadClients(); loadInvoices(); });
</script>

<style scoped>
.page { background: #F0F2F5; min-height: 100vh; padding: 24rpx 32rpx; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.title { font-size: 36rpx; font-weight: 800; color: #1F2937; }
.btn-add { background: #4F46E5; color: #fff; padding: 12rpx 28rpx; border-radius: 12rpx; font-size: 26rpx; font-weight: 600; border: none; }

.summary { display: flex; justify-content: space-around; padding: 32rpx 0; }
.summary-item { text-align: center; }
.summary-value { font-size: 40rpx; font-weight: 800; color: #10B981; display: block; }
.summary-value.pending { color: #F59E0B; }
.summary-value.overdue { color: #EF4444; }
.summary-label { font-size: 22rpx; color: #9CA3AF; display: block; margin-top: 4rpx; }

.invoice-card { display: flex; justify-content: space-between; align-items: center; }
.inv-left { flex: 1; }
.inv-client { font-size: 30rpx; font-weight: 600; color: #1F2937; display: block; }
.inv-date { font-size: 24rpx; color: #6B7280; display: block; margin-top: 2rpx; }
.inv-right { text-align: right; }
.inv-amount { font-size: 34rpx; font-weight: 800; color: #1F2937; display: block; }

.empty { text-align: center; padding: 100rpx 0; color: #9CA3AF; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 999; }
.modal { width: 100%; background: #fff; border-radius: 32rpx 32rpx 0 0; padding: 48rpx 32rpx 60rpx; }
.modal-title { font-size: 34rpx; font-weight: 700; display: block; margin-bottom: 32rpx; }
.input, .picker-display {
  width: 100%; background: #F9FAFB; border: 2rpx solid #E5E7EB;
  border-radius: 12rpx; padding: 20rpx 24rpx; font-size: 28rpx; margin-bottom: 20rpx;
}
.modal-btns { display: flex; gap: 20rpx; margin-top: 32rpx; }
.btn-cancel { flex: 1; padding: 24rpx 0; border-radius: 12rpx; background: #F3F4F6; color: #6B7280; font-size: 28rpx; border: none; }
.btn-primary { flex: 1; padding: 24rpx 0; border-radius: 12rpx; font-size: 28rpx; }
</style>