<template>
  <div class="energy-page">
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <!-- 页面页头 -->
      <PageHeader />

      <div class="main-content">
        <!-- 核心统计卡片：包含实时、累计及周期数据 -->
        <div class="energy-summary-container">
          <div class="glass-card summary-card">
            <!-- 头部高亮数据区 -->
            <div class="header-highlight">
              <div class="v-divider"></div>
              <div class="highlight-item secondary">
                <div class="hl-label">累计总用电量</div>
                <div class="hl-value">
                  <span class="number">{{ energyStats.totalAccumulated }}</span>
                  <span class="unit">kWh</span>
                </div>
              </div>
            </div>

            <!-- 四宫格数据区 -->
            <div class="stats-grid">
              <div class="grid-item">
                <span class="sub-label">今日电量</span>
                <span class="sub-value">{{ energyStats.today }}<small>kWh</small></span>
              </div>
              <div class="grid-item border-left">
                <span class="sub-label">昨日电量</span>
                <span class="sub-value">{{ energyStats.yesterday }}<small>kWh</small></span>
              </div>
              <div class="grid-item border-top">
                <span class="sub-label">当月电量</span>
                <span class="sub-value">{{ energyStats.thisMonth }}<small>kWh</small></span>
              </div>
              <div class="grid-item border-top border-left">
                <span class="sub-label">上月电量</span>
                <span class="sub-value">{{ energyStats.lastMonth }}<small>kWh</small></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 实时用电趋势 (15分钟频率) -->
        <div class="trend-section">
          <div class="section-header">
            <div class="section-title">实时用电趋势</div>
            <div class="view-more" @click="goToDetail">
              <span>查看更多</span>
              <van-icon name="arrow" />
            </div>
          </div>
          
          <div class="glass-card chart-card">
            <div class="chart-container">
              <div class="chart-header">
                <span class="chart-unit">单位: kW (15min/次)</span>
              </div>
              <div class="chart-body line-chart-body">
                <div class="chart-y-axis">
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
                
                <div class="chart-content">
                  <svg class="line-chart-svg" viewBox="0 0 300 120" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="300" y2="0" stroke="#f0f0f0" stroke-width="1" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="#f0f0f0" stroke-width="1" />
                    <line x1="0" y1="120" x2="300" y2="120" stroke="#f0f0f0" stroke-width="1" />
                    
                    <defs>
                      <linearGradient id="realtimeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(7, 193, 96, 0.3);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(7, 193, 96, 0);stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <path :d="realtimePathArea" fill="url(#realtimeGradient)" />
                    <path :d="realtimePath" fill="none" stroke="#07c160" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  
                  <div class="chart-labels">
                    <span v-for="(item, index) in realtimeData" :key="index" class="bar-label" v-show="index % 3 === 0">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近7日用电趋势 (折线图) -->
        <div class="trend-section">
          <div class="section-header">
            <div class="section-title">最近7日用电趋势</div>
            <div class="view-more" @click="goToDetail">
              <!-- <span>查看更多</span> -->
              <!-- <van-icon name="arrow" /> -->
            </div>
          </div>
          
          <div class="glass-card chart-card">
            <div class="chart-container">
              <div class="chart-header">
                <span class="chart-unit">单位: kWh</span>
              </div>
              <div class="chart-body line-chart-body">
                <div class="chart-y-axis">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                
                <div class="chart-content">
                  <svg class="line-chart-svg" viewBox="0 0 300 120" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="300" y2="0" stroke="#f0f0f0" stroke-width="1" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="#f0f0f0" stroke-width="1" />
                    <line x1="0" y1="120" x2="300" y2="120" stroke="#f0f0f0" stroke-width="1" />
                    
                    <defs>
                      <linearGradient id="dayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(25, 137, 250, 0.3);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(25, 137, 250, 0);stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <path :d="dayPathArea" fill="url(#dayGradient)" />
                    <path :d="dayPath" fill="none" stroke="#1989fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle v-for="(point, idx) in dayPoints" :key="'dot-'+idx" :cx="point.x" :cy="point.y" r="3" fill="white" stroke="#1989fa" stroke-width="1.5" />
                  </svg>
                  
                  <div class="chart-labels">
                    <span v-for="(item, index) in trendData" :key="index" class="bar-label">{{ item.shortLabel }}</span>
                  </div>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';

const router = useRouter();

// 模拟能耗数据
const energyStats = ref({
  realtime: '4.25',
  today: '12.8',
  yesterday: '45.6',
  thisMonth: '328.5',
  lastMonth: '1250.2',
  totalAccumulated: '8542.8'
});

// 1. 实时用电趋势数据 (15分钟一次)
const realtimeData = ref([
  { label: '10:00', percent: 35 }, { label: '10:15', percent: 42 }, { label: '10:30', percent: 38 },
  { label: '10:45', percent: 45 }, { label: '11:00', percent: 52 }, { label: '11:15', percent: 48 },
  { label: '11:30', percent: 40 }, { label: '11:45', percent: 46 }, { label: '12:00', percent: 55 },
  { label: '12:15', percent: 50 }, { label: '12:30', percent: 42 }, { label: '12:45', percent: 45 }
]);

// 2. 最近7日趋势数据
const trendData = ref([
  { label: '03-20', shortLabel: '20', value: '42.1', percent: 65 },
  { label: '03-21', shortLabel: '21', value: '38.5', percent: 60 },
  { label: '03-22', shortLabel: '22', value: '45.2', percent: 70 },
  { label: '03-23', shortLabel: '23', value: '52.8', percent: 82 },
  { label: '03-24', shortLabel: '24', value: '48.6', percent: 75 },
  { label: '03-25', shortLabel: '25', value: '45.6', percent: 70 },
  { label: '今日', shortLabel: '今', value: '12.8', percent: 20 }
]);

// 辅助函数：生成路径
const getLinePathData = (data, width = 300, height = 120) => {
  const step = width / (data.length - 1);
  const points = data.map((item, index) => ({
    x: index * step,
    y: height - (item.percent / 100) * height
  }));
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const area = `${path} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;
  return { points, path, area };
};

// 实时趋势计算
const realtimeChart = computed(() => getLinePathData(realtimeData.value));
const realtimePath = computed(() => realtimeChart.value.path);
const realtimePathArea = computed(() => realtimeChart.value.area);

// 7日趋势计算
const dayChart = computed(() => getLinePathData(trendData.value));
const dayPoints = computed(() => dayChart.value.points);
const dayPath = computed(() => dayChart.value.path);
const dayPathArea = computed(() => dayChart.value.area);

const goToDetail = () => {
  router.push({ name: 'EnergyDetail' });
};
</script>

<style scoped>
.energy-page {
  position: relative;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
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

.content-wrapper {
  position: relative;
  z-index: 1;
  padding-bottom: 40px;
}

.main-content {
  padding: 0 16px;
  margin-top: -40px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

/* 统计卡片重构 */
.summary-card {
  padding: 0;
  overflow: hidden;
}

.header-highlight {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(25, 137, 250, 0.08) 0%, rgba(25, 137, 250, 0.03) 100%);
  padding: 24px 16px;
  border-bottom: 1px solid rgba(25, 137, 250, 0.1);
}

.highlight-item {
  flex: 1;
  text-align: center;
}

.v-divider {
  width: 1px;
  height: 40px;
  background: rgba(25, 137, 250, 0.15);
  margin: 0 10px;
}

.hl-label {
  font-size: 12px;
  color: #1989fa;
  font-weight: 500;
  margin-bottom: 6px;
  opacity: 0.8;
}

.primary .number {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: 'DIN Alternate', sans-serif;
}

.secondary .number {
  font-size: 22px;
  font-weight: 700;
  color: #323233;
  font-family: 'DIN Alternate', sans-serif;
}

.hl-value .unit {
  font-size: 12px;
  color: #646566;
  margin-left: 4px;
  font-weight: 500;
}

/* 四宫格网格 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.grid-item {
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.border-left {
  border-left: 1px solid rgba(242, 243, 245, 0.8);
}

.border-top {
  border-top: 1px solid rgba(242, 243, 245, 0.8);
}

.sub-label {
  font-size: 11px;
  color: #969799;
  margin-bottom: 4px;
}

.sub-value {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.sub-value small {
  font-size: 10px;
  font-weight: 400;
  color: #969799;
  margin-left: 2px;
}

/* 趋势部分 */
.trend-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.view-more {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #969799;
  cursor: pointer;
}

.view-more span {
  margin-right: 2px;
}

.chart-card {
  padding: 20px;
}

.chart-header {
  margin-bottom: 12px;
  text-align: right;
}

.chart-unit {
  font-size: 11px;
  color: #c8c9cc;
}

.line-chart-body {
  display: flex;
  height: 150px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 120px;
  font-size: 10px;
  color: #c8c9cc;
  padding-right: 12px;
  width: 28px;
}

.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.line-chart-svg {
  width: 100%;
  height: 120px;
  overflow: visible;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0;
}

.bar-label {
  font-size: 9px;
  color: #969799;
  width: 24px;
  text-align: center;
  transform: scale(0.9);
}
</style>
