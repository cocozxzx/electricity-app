<template>
  <div class="work-order-detail">
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 顶部固定区域 -->
    <div class="sticky-header">
      <van-nav-bar
        title="工单详情"
        left-arrow
        @click-left="$emit('close')"
        class="custom-nav-bar"
      />
    </div>

    <div class="detail-container">
      <!-- 基础信息 -->
      <div class="section-card glass-card">
        <div class="section-header">
          <span class="blue-bar"></span>
          <span class="title">基础信息</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">工单编号</div>
            <div class="value code">{{ order.id }}</div>
          </div>
          <div class="info-item">
            <div class="label">设备名称</div>
            <div class="value">{{ order.deviceName }}</div>
          </div>
          <div class="info-item">
            <div class="label">所属项目</div>
            <div class="value">{{ order.projectName }}</div>
          </div>
          <div class="info-item">
            <div class="label">故障类型</div>
            <div class="value">{{ order.faultType }}</div>
          </div>
          <div class="info-item">
            <div class="label">紧急程度</div>
            <div class="value urgency" :class="order.urgency">{{ order.urgency }}</div>
          </div>
          <div class="info-item">
            <div class="label">创建时间</div>
            <div class="value">{{ order.createTime }}</div>
          </div>
          <div class="info-item full-width">
            <div class="label">故障描述</div>
            <div class="value desc-box">设备触发相关告警，需要现场核查线路及设备运行状态。</div>
          </div>
        </div>
      </div>

      <!-- 维修反馈 (待审核和已完成展示) -->
      <div v-if="order.status === '待审核' || order.status === '已完成'" class="section-card glass-card">
        <div class="section-header">
          <span class="blue-bar"></span>
          <span class="title">维修反馈</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">处理人</div>
            <div class="value">{{ order.handler || '王工' }}</div>
          </div>
          <div class="info-item">
            <div class="label">完成时间</div>
            <div class="value">2026-03-12 14:30:00</div>
          </div>
          <div class="info-item full-width">
            <div class="label">排查说明</div>
            <div class="value desc-box">经现场排查，发现设备接线端子有轻微松动迹象。</div>
          </div>
          <div class="info-item full-width">
            <div class="label">处置措施</div>
            <div class="value desc-box">对松动的接线端子进行了紧固处理，恢复后测试运行稳定。</div>
          </div>
          <div class="info-item full-width">
            <div class="label">现场照片</div>
            <div class="image-grid">
              <van-image
                width="80"
                height="80"
                radius="8"
                src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                class="evidence-img"
              />
              <van-image
                width="80"
                height="80"
                radius="8"
                src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                class="evidence-img"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 审核意见 (已完成展示) -->
      <div v-if="order.status === '已完成'" class="section-card glass-card">
        <div class="section-header">
          <span class="blue-bar"></span>
          <span class="title">审核意见</span>
        </div>
        <div class="info-grid">
          <div class="info-item full-width">
            <div class="label">审核结果</div>
            <div class="value status-success">审核通过</div>
          </div>
          <div class="info-item full-width">
            <div class="label">审核意见</div>
            <div class="value desc-box">经核实，该工单处理规范，现场恢复良好，准予结单。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.work-order-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f7f8fa;
  z-index: 2000;
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

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.custom-nav-bar {
  --van-nav-bar-background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.detail-container {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  padding: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.blue-bar {
  width: 4px;
  height: 16px;
  background: #1989fa;
  border-radius: 2px;
  margin-right: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item.full-width {
  grid-column: span 2;
}

.label {
  font-size: 12px;
  color: #969799;
}

.value {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

.value.code {
  font-family: monospace;
}

.value.urgency.紧急, .value.urgency.特急 { color: #ee0a24; }
.value.urgency.一般 { color: #1989fa; }

.status-success {
  color: #07c160;
  font-weight: 600;
}

.desc-box {
  background: rgba(247, 248, 250, 0.6);
  padding: 12px;
  border-radius: 12px;
  line-height: 1.6;
  color: #646566;
  font-weight: 400;
}

.image-grid {
  display: flex;
  gap: 12px;
}

.evidence-img {
  border: 1px solid rgba(242, 243, 245, 0.8);
}
</style>
