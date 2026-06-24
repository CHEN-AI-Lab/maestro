<template>
  <view class="page">
    <view class="header">
      <view class="week-nav">
        <text class="nav-btn" @click="prevWeek">‹</text>
        <text class="week-label">{{ weekLabel }}</text>
        <text class="nav-btn" @click="nextWeek">›</text>
      </view>
      <button class="btn-add" @click="showForm = true">+ 新事件</button>
    </view>

    <!-- Day tabs -->
    <scroll-view scroll-x class="day-tabs">
      <view
        v-for="(day, idx) in days"
        :key="idx"
        :class="['day-tab', idx === selectedDay ? 'day-active' : '']"
        @click="selectedDay = idx"
      >
        <text class="day-name">{{ day.name }}</text>
        <text class="day-date">{{ day.date }}</text>
      </view>
    </scroll-view>

    <!-- Events -->
    <view v-if="filteredEvents.length === 0" class="empty">
      <text>当天暂无事件</text>
    </view>
    <view v-for="e in filteredEvents" :key="e.id" class="event-card card">
      <view class="event-bar" :style="{ background: getStatusColor(e.status) }"></view>
      <view class="event-body">
        <view class="event-top">
          <text class="event-title">{{ e.title }}</text>
          <text :class="['tag', 'tag-' + (e.status || 'scheduled').toLowerCase()]">{{ statusLabel(e.status) }}</text>
        </view>
        <view class="event-time-row">
          <text>{{ formatTime(e.startTime) }} - {{ formatTime(e.endTime) }}</text>
          <text> · {{ e.duration }}分钟</text>
        </view>
        <text class="event-client">{{ e.client?.name || '未知客户' }}</text>
      </view>
    </view>

    <!-- Modal -->
    <view class="modal-mask" v-if="showForm" @click="showForm = false">
      <view class="modal" @click.stop>
        <text class="modal-title">添加事件</text>
        <input class="input" v-model="form.title" placeholder="事件标题 *" />
        <picker class="picker" :range="clientNames" @change="onClientChange">
          <view class="picker-display">{{ clientNames[form.clientIdx] || '选择客户' }}</view>
        </picker>
        <input class="input" v-model="form.date" type="date" placeholder="日期" />
        <view class="time-row">
          <input class="input time-input" v-model="form.startTime" type="time" placeholder="开始" />
          <text class="time-sep">至</text>
          <input class="input time-input" v-model="form.endTime" type="time" placeholder="结束" />
        </view>
        <input class="input" v-model="form.price" type="digit" placeholder="费用（选填）" />
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
import { ref, computed, onMounted } from 'vue';

const selectedDay = ref(0);
const showForm = ref(false);
const weekOffset = ref(0);
const events = ref([]);
const clientNames = ref(['请先添加客户']);
const allClients = ref([]);

const form = ref({ title: '', clientIdx: 0, date: '', startTime: '', endTime: '', price: '', notes: '' });

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const days = computed(() => {
  const now = new Date();
  now.setDate(now.getDate() + weekOffset.value * 7);
  const monday = new Date(now);
  monday.setDate(monday.getDate() - now.getDay() + 1);
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    result.push({
      name: weekDays[i],
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      iso: d.toISOString().split('T')[0],
    });
  }
  return result;
});

const weekLabel = computed(() => {
  if (days.value.length < 7) return '';
  return `${days.value[0].date} - ${days.value[6].date}`;
});

const filteredEvents = computed(() => {
  const day = days.value[selectedDay.value];
  if (!day) return [];
  return events.value.filter((e: any) => e.startTime && e.startTime.startsWith(day.iso));
});

function prevWeek() { weekOffset.value--; }
function nextWeek() { weekOffset.value++; }

function formatTime(s) { return s ? s.slice(11, 16) : ''; }
function statusLabel(s) {
  const map = { SCHEDULED: '已排程', COMPLETED: '已完成', CANCELLED: '已取消', NO_SHOW: '未出席' };
  return map[s] || s;
}
function getStatusColor(s) {
  const map = { SCHEDULED: '#3B82F6', COMPLETED: '#10B981', CANCELLED: '#9CA3AF', NO_SHOW: '#EF4444' };
  return map[s] || '#3B82F6';
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

async function loadEvents() {
  try {
    const res = await uni.request({ url: 'http://localhost:3000/api/events' });
    if (res.statusCode === 200 && res.data) events.value = res.data as any;
  } catch (e) {}
}

async function handleAdd() {
  if (!form.value.title) { uni.showToast({ title: '请输入标题', icon: 'none' }); return; }
  const client = allClients.value[form.value.clientIdx];
  if (!client) { uni.showToast({ title: '请选择客户', icon: 'none' }); return; }
  const startTime = `${form.value.date || days.value[selectedDay.value].iso}T${form.value.startTime || '09:00'}:00`;
  const endTime = `${form.value.date || days.value[selectedDay.value].iso}T${form.value.endTime || '10:00'}:00`;
  try {
    await uni.request({
      url: 'http://localhost:3000/api/events',
      method: 'POST',
      data: {
        clientId: (client as any).id,
        title: form.value.title,
        startTime,
        endTime,
        price: parseFloat(form.value.price) || undefined,
        notes: form.value.notes || undefined,
      },
    });
    uni.showToast({ title: '添加成功' });
    showForm.value = false;
    form.value = { title: '', clientIdx: 0, date: '', startTime: '', endTime: '', price: '', notes: '' };
    loadEvents();
  } catch (e) {
    uni.showToast({ title: '添加失败', icon: 'none' });
  }
}

onMounted(() => { loadClients(); loadEvents(); });
</script>

<style scoped>
.page { background: #F0F2F5; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 24rpx 32rpx; background: #4F46E5; }
.week-nav { display: flex; align-items: center; gap: 16rpx; }
.nav-btn { font-size: 48rpx; color: #fff; padding: 0 8rpx; }
.week-label { font-size: 28rpx; color: #fff; font-weight: 600; }
.btn-add { background: rgba(255,255,255,0.2); color: #fff; padding: 10rpx 24rpx; border-radius: 12rpx; font-size: 26rpx; border: none; }

.day-tabs { display: flex; white-space: nowrap; background: #fff; padding: 16rpx 0; }
.day-tab { flex-shrink: 0; width: 140rpx; text-align: center; padding: 16rpx 0; }
.day-name { font-size: 24rpx; color: #9CA3AF; display: block; }
.day-date { font-size: 26rpx; color: #1F2937; font-weight: 600; display: block; }
.day-active { background: #EEF2FF; border-radius: 12rpx; }
.day-active .day-name, .day-active .day-date { color: #4F46E5; }

.empty { text-align: center; padding: 100rpx 0; color: #9CA3AF; }

.event-card { display: flex; margin: 0 32rpx 12rpx; overflow: hidden; }
.event-bar { width: 6rpx; flex-shrink: 0; }
.event-body { flex: 1; padding: 20rpx 24rpx; }
.event-top { display: flex; justify-content: space-between; align-items: center; }
.event-title { font-size: 28rpx; font-weight: 600; color: #1F2937; }
.event-time-row { font-size: 24rpx; color: #6B7280; margin-top: 6rpx; }
.event-client { font-size: 24rpx; color: #4F46E5; display: block; margin-top: 4rpx; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 999; }
.modal { width: 100%; background: #fff; border-radius: 32rpx 32rpx 0 0; padding: 48rpx 32rpx 60rpx; max-height: 85vh; overflow-y: auto; }
.modal-title { font-size: 34rpx; font-weight: 700; display: block; margin-bottom: 32rpx; }
.input, .textarea, .picker-display {
  width: 100%; background: #F9FAFB; border: 2rpx solid #E5E7EB;
  border-radius: 12rpx; padding: 20rpx 24rpx; font-size: 28rpx; margin-bottom: 20rpx;
}
.textarea { height: 140rpx; }
.time-row { display: flex; align-items: center; gap: 12rpx; }
.time-input { flex: 1; }
.time-sep { color: #9CA3AF; }
.modal-btns { display: flex; gap: 20rpx; margin-top: 32rpx; }
.btn-cancel { flex: 1; padding: 24rpx 0; border-radius: 12rpx; background: #F3F4F6; color: #6B7280; font-size: 28rpx; border: none; }
.btn-primary { flex: 1; padding: 24rpx 0; border-radius: 12rpx; font-size: 28rpx; }
</style>