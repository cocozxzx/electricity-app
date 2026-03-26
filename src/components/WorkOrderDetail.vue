<template>
  <div class="work-order-detail">
    <van-nav-bar
      title="工单详情"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
      fixed
      placeholder
      class="custom-nav-bar"
    />

    <div class="detail-container">
      <!-- 基础信息 -->
      <div class="section-card">
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
      <div v-if="order.status === '待审核' || order.status === '已完成'" class="section-card">
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
      <div v-if="order.status === '已完成'" class="section-card">
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

.custom-nav-bar {
  --van-nav-bar-background: #fff;
  --van-nav-bar-title-font-size: 17px;
}

.detail-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
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

.value.urgency.紧急, .value.urgency.紧急 { color: #ee0a24; }
.value.urgency.一般 { color: #1989fa; }

.status-success {
  color: #07c160;
  font-weight: 600;
}

.desc-box {
  background: #f7f8fa;
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
  border: 1px solid #f2f3f5;
}
</style>
