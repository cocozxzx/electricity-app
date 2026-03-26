<template>
  <div class="inspection-order-detail">
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 顶部固定区域 -->
    <div class="sticky-header">
      <van-nav-bar
        title="巡检详情"
        left-arrow
        @click-left="$emit('close')"
        class="custom-nav-bar"
      />
    </div>

    <div class="detail-container">
      <!-- 基础信息 (基于 image-4.png) -->
      <div class="section-card glass-card basic-info-card">
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
        </div>
      </div>

      <!-- 时间轴详情列表 (基于 image-2.png) -->
      <div class="timeline-container">
        <div v-for="(record, index) in mockTimelineData" :key="index" class="timeline-item">
          <div class="timeline-left">
            <div class="node-dot" :class="record.result">
              <van-icon v-if="record.result === '异常'" name="warning-o" />
            </div>
            <div v-if="index !== mockTimelineData.length - 1" class="node-line"></div>
          </div>
          
          <div class="timeline-right">
            <div class="record-header">
              <span class="record-time">{{ record.time }}</span>
              <span class="record-meta">执行人：{{ record.inspector }}</span>
              <span class="record-meta">结果：<span :class="record.result">{{ record.result }}</span></span>
            </div>

            <div class="record-card glass-card" :class="record.result">
              <!-- 情况说明 -->
              <div class="card-section">
                <div class="section-title">
                  <span class="blue-bar"></span>
                  情况说明
                </div>
                <div class="result-box" :class="record.result">
                  {{ record.explanation }}
                </div>
              </div>

              <!-- 现场照片 -->
              <div class="card-section">
                <div class="section-title">
                  <span class="blue-bar"></span>
                  现场照片
                </div>
                <div class="image-grid">
                  <van-image
                    v-for="(img, i) in record.images"
                    :key="i"
                    width="80"
                    height="80"
                    radius="8"
                    :src="img"
                    class="evidence-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

// 模拟时间轴数据
const mockTimelineData = ref([
  {
    time: '2026-03-13 10:30:00',
    inspector: '张工',
    result: '正常',
    explanation: '经现场核查，设备各项运行指标处于正常范围，未发现安全隐患。',
    images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg']
  },
  {
    time: '2026-03-12 10:15:00',
    inspector: '李工',
    result: '异常',
    explanation: '发现电表箱温度偏高，最高达78°C，初步判断为过载引起。',
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    ]
  },
  {
    time: '2026-03-11 09:45:00',
    inspector: '王工',
    result: '正常',
    explanation: '巡视结果正常，电压电流参数稳定。',
    images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg']
  }
]);
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
}

.section-card {
  padding: 16px;
  margin-bottom: 24px;
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
}

.value.code {
  font-family: monospace;
}

/* 时间轴样式 */
.timeline-container {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 12px;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
}

.node-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #07c160;
  margin-top: 6px;
  position: relative;
  z-index: 2;
}

.node-dot.异常 {
  width: 20px;
  height: 20px;
  background: transparent;
  color: #ee0a24;
  display: center;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-top: 0;
}

.node-line {
  width: 2px;
  flex: 1;
  background: #ebedf0;
  margin: 4px 0;
}

.timeline-right {
  flex: 1;
  padding-bottom: 24px;
}

.record-header {
  font-size: 13px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.record-time {
  font-weight: 700;
  color: #323233;
  font-size: 14px;
}

.record-meta {
  color: #646566;
}

.record-meta span.正常 { color: #07c160; }
.record-meta span.异常 { color: #ee0a24; }

.record-card {
  padding: 16px;
}

.record-card.异常 {
  background: rgba(255, 241, 240, 0.85);
  border-color: rgba(255, 204, 199, 0.5);
}

.card-section {
  margin-bottom: 16px;
}

.card-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

.result-box {
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.result-box.正常 {
  background: rgba(7, 193, 96, 0.05);
  color: #07c160;
  border: 1px solid rgba(7, 193, 96, 0.1);
}

.result-box.异常 {
  background: rgba(238, 10, 36, 0.05);
  color: #ee0a24;
  border: 1px solid rgba(238, 10, 36, 0.1);
}

.image-grid {
  display: flex;
  gap: 8px;
}

.evidence-img {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
