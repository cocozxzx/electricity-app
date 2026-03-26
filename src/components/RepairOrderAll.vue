<template>
  <div class="repair-order-all">
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <van-nav-bar
      title="维修工单"
      left-arrow
      @click-left="$emit('close')"
      fixed
      placeholder
      class="custom-nav-bar"
    />

    <!-- 状态切换 Tabs -->
    <van-tabs v-model:active="activeStatus" sticky offset-top="46px" color="#1989fa" line-width="30px" class="custom-tabs-nav">
      <van-tab title="处理中" name="处理中"></van-tab>
      <van-tab title="待审核" name="待审核"></van-tab>
      <van-tab title="已完成" name="已完成"></van-tab>
    </van-tabs>

    <div class="list-container">
      <div v-if="displayOrders.length === 0" class="empty-state">
        暂无{{ activeStatus }}的工单
      </div>
      
      <div v-for="order in displayOrders" :key="order.id" class="glass-card order-card repair-card">
        <div class="card-header">
          <div class="header-main">
            <h3 class="device-name">{{ order.deviceName }}</h3>
            <span class="order-id-tag">{{ order.id }}</span>
          </div>
          <div class="status-tag" :class="order.status">{{ order.status }}</div>
        </div>
        
        <div class="card-body-grid">
          <div class="info-row">
            <div class="info-col">
              <span class="info-label">故障类型</span>
              <span class="info-value">{{ order.faultType }}</span>
            </div>
            <div class="info-col">
              <span class="info-label">紧急程度</span>
              <span class="info-value urgency-text" :class="order.urgency">{{ order.urgency }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-col">
              <span class="info-label">所属项目</span>
              <span class="info-value">{{ order.projectName }}</span>
            </div>
            <div class="info-col">
              <span class="info-label">创建时间</span>
              <span class="info-value time-value">{{ order.createTime.split(' ')[0] }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer-actions">
          <van-button 
            v-if="order.status !== '处理中'"
            type="default"
            size="small"
            class="footer-btn"
            round
            @click="$emit('view-detail', order)"
          >
            详情
          </van-button>
          <van-button 
            v-if="order.status === '处理中'"
            type="primary"
            size="small"
            class="footer-btn"
            round
            @click="$emit('handle-order', order)"
          >
            前往处理
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

const activeStatus = ref('处理中');

const displayOrders = computed(() => {
  return props.orders.filter(order => {
    if (activeStatus.value === '已完成') {
      return order.status === '已完成' || order.status === '已归档';
    }
    return order.status === activeStatus.value;
  });
});
</script>

<style scoped>
.repair-order-all {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f7f8fa;
  z-index: 1500;
  overflow-y: auto;
}

.home-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: rgba(25, 137, 250, 0.15);
  top: -50px;
  right: -50px;
}

.circle-2 {
  width: 250px;
  height: 250px;
  background: rgba(0, 210, 255, 0.1);
  top: 300px;
  left: -50px;
}

.custom-nav-bar {
  --van-nav-bar-background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.custom-tabs-nav {
  --van-tabs-nav-background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}

.list-container {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  padding: 16px;
}

.repair-card .card-header {
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
.status-tag.待审核 { background: rgba(255, 151, 106, 0.1); color: #ff976a; }
.status-tag.已完成, .status-tag.已归档 { background: rgba(7, 193, 96, 0.1); color: #07c160; }

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

.info-label {
  font-size: 12px;
  color: #969799;
}

.info-value {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

.urgency-text.紧急 { color: #ee0a24; }
.urgency-text.一般 { color: #1989fa; }

.time-value {
  color: #646566;
  font-size: 13px;
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
  position: relative;
  z-index: 1;
  padding: 60px 0;
  text-align: center;
  color: #969799;
}
</style>
