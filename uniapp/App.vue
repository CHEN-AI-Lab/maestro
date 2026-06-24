<script>
export default {
  onLaunch() {
    console.log('SaaSPro App Launched');
  },
};
</script>

<style>
/* 全局样式 */
page {
  background-color: #F0F2F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1F2937;
  font-size: 28rpx;
  line-height: 1.6;
}

/* 通用按钮 */
.btn-primary {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  font-size: 30rpx;
  font-weight: 600;
}

.btn-primary:active {
  opacity: 0.85;
}

/* 通用卡片 */
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

/* 状态标签 */
.tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;
  color: #fff;
}

.tag-scheduled { background: #3B82F6; }
.tag-completed { background: #10B981; }
.tag-cancelled { background: #9CA3AF; }
.tag-no-show { background: #EF4444; }
.tag-pending { background: #F59E0B; }
.tag-paid { background: #10B981; }
.tag-overdue { background: #EF4444; }
.tag-refunded { background: #6B7280; }
</style>