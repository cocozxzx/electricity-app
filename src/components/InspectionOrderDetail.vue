<template>
  <div class="inspection-order-detail">
    <van-nav-bar
      title="巡检详情"
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
            <div class="label">记录编号</div>
            <div class="value code">{{ order.id }}</div>
          </div>
          <div class="info-item">
            <div class="label">计划名称</div>
            <div class="value">{{ order.planName }}</div>
          </div>
          <div class="info-item">
            <div class="label">所属项目</div>
            <div class="value">{{ order.projectName }}</div>
          </div>
          <div class="info-item">
            <div class="label">巡检周期</div>
            <div class="value">
              {{ order.cycleType }}
              <div v-if="order.cycleDetail" class="sub-value">{{ order.cycleDetail }}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">巡检人</div>
            <div class="value">{{ order.inspector }}</div>
          </div>
        </div>
      </div>

      <!-- 巡检反馈 (进行中和已完成逻辑上都可以展示，根据是否有数据) -->
      <div v-if="order.status === '已完成'" class="section-card">
        <div class="section-header">
          <span class="blue-bar"></span>
          <span class="title">巡检反馈</span>
        </div>
        <div class="info-grid">
          <div class="info-item full-width">
            <div class="label">巡检结果</div>
            <div class="value status-success">正常</div>
          </div>
          <div class="info-item full-width">
            <div class="label">情况说明</div>
            <div class="value desc-box">经现场巡检，所有设备运行状态良好，参数指标正常。</div>
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
            </div>
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
.inspection-order-detail {
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

.sub-value {
  font-size: 12px;
  color: #646566;
  font-weight: 400;
  margin-top: 2px;
}

.value.code {
  font-family: monospace;
}

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
