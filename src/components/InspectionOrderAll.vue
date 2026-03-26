<template>
  <div class="inspection-order-all">
    <van-nav-bar
      title="全部巡检任务"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
      fixed
      placeholder
      class="custom-nav-bar"
    />

    <!-- 状态切换 Tabs -->
    <van-tabs v-model:active="activeStatus" sticky offset-top="46px" color="#1989fa" line-width="30px">
      <van-tab title="进行中" name="进行中"></van-tab>
      <van-tab title="已完成" name="已完成"></van-tab>
    </van-tabs>

    <div class="list-container">
      <div v-if="displayOrders.length === 0" class="empty-state">
        暂无{{ activeStatus }}的巡检任务
      </div>
      
      <div v-for="order in displayOrders" :key="order.id" class="glass-card order-card inspection-card">
        <div class="card-header">
          <div class="header-main">
            <h3 class="device-name">{{ order.planName }}</h3>
            <span class="order-id-tag">{{ order.id }}</span>
          </div>
          <div class="status-tag" :class="order.status">{{ order.status === '已完成' ? '已完成' : '进行中' }}</div>
        </div>
        
        <div class="card-body-grid">
          <div class="info-row">
            <div class="info-col">
              <span class="info-label">巡检周期</span>
              <span class="info-value cycle-display">
                {{ order.cycleType }}
                <span v-if="order.cycleDetail" class="cycle-detail">{{ order.cycleDetail }}</span>
              </span>
            </div>
            <div class="info-col">
              <span class="info-label">巡检人</span>
              <span class="info-value">{{ order.inspector }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-col full-width">
              <span class="info-label">所属项目</span>
              <span class="info-value">{{ order.projectName }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer-actions">
          <!-- 所有状态现在都有详情按钮 -->
          <van-button 
            type="default"
            size="small"
            class="footer-btn"
            round
            @click="$emit('view-detail', order)"
          >
            详情
          </van-button>
          <van-button 
            v-if="order.status === '进行中' || order.status === '处理中'"
            type="primary"
            size="small"
            class="footer-btn"
            round
            @click="$emit('handle-order', order)"
          >
            开始巡检
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  orders: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'view-detail', 'handle-order']);

const activeStatus = ref('进行中');

const displayOrders = computed(() => {
  return props.orders.filter(order => {
    const status = (order.status === '处理中' || order.status === '进行中') ? '进行中' : '已完成';
    return status === activeStatus.value;
  });
});
</script>

<style scoped>
.inspection-order-all {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f7f8fa;
  z-index: 1500;
  overflow-y: auto;
}

.custom-nav-bar {
  --van-nav-bar-background: #fff;
  border-bottom: 1px solid #f2f3f5;
}

.list-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glass-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  padding: 16px;
}

.inspection-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-name {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.order-id-tag {
  font-size: 12px;
  color: #969799;
  font-family: monospace;
}

.status-tag {
  background: rgba(25, 137, 250, 0.1);
  color: #1989fa;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}
.status-tag.已完成 { background: rgba(7, 193, 96, 0.1); color: #07c160; }

.card-body-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 12px;
}

.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-col.full-width {
  flex: 2;
}

.info-label {
  font-size: 12px;
  color: #969799;
}

.info-value {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

.cycle-display {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cycle-detail {
  font-size: 12px;
  color: #646566;
  font-weight: 400;
}

.card-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(242, 243, 245, 0.8);
}

.footer-btn {
  min-width: 84px;
  height: 34px;
  font-weight: 500;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #969799;
}
</style>
