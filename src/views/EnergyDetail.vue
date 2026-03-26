<template>
  <div class="energy-detail-page">
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <van-nav-bar
        title="能耗详情"
        left-arrow
        @click-left="onClickLeft"
        fixed
        placeholder
        class="custom-nav-bar"
      />
      
      <div class="main-content">
        <!-- 查询条件卡片 -->
        <div class="glass-card filter-card">
          <div class="filter-row" @click="showDevicePicker = true">
            <span class="label">设备名称</span>
            <div class="value">
              <span>{{ currentDevice.text }}</span>
              <van-icon name="arrow-down" />
            </div>
          </div>

          <div class="filter-row" @click="showGranularityPicker = true">
            <span class="label">统计粒度</span>
            <div class="value">
              <span>{{ currentGranularity.text }}</span>
              <van-icon name="arrow-down" />
            </div>
          </div>

          <div class="filter-row" @click="openDatePicker">
            <span class="label">日期选择</span>
            <div class="value">
              <span>{{ dateText }}</span>
              <van-icon name="calendar-o" />
            </div>
          </div>
        </div>

        <!-- 趋势图卡片 -->
        <div class="section-title">{{ currentGranularity.text }}能耗变化趋势</div>
        <div class="glass-card chart-card">
          <div class="chart-container">
            <div class="chart-header">
              <span class="chart-unit">单位: kWh</span>
            </div>
            <div class="chart-body">
              <div class="chart-y-axis">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>
              <div class="chart-content">
                <div class="scroll-chart">
                  <svg class="detail-chart-svg" :viewBox="`0 0 ${chartWidth} 150`" preserveAspectRatio="none">
                    <line x1="0" y1="0" :x2="chartWidth" y2="0" stroke="#f0f0f0" stroke-width="1" />
                    <line x1="0" y1="75" :x2="chartWidth" y2="75" stroke="#f0f0f0" stroke-width="1" />
                    <line x1="0" y1="150" :x2="chartWidth" y2="150" stroke="#f0f0f0" stroke-width="1" />
                    
                    <defs>
                      <linearGradient id="detailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:rgba(25, 137, 250, 0.3);stop-opacity:1" />
                        <stop offset="100%" style="stop-color:rgba(25, 137, 250, 0);stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <path :d="chartPathArea" fill="url(#detailGradient)" />
                    <path :d="chartPath" fill="none" stroke="#1989fa" stroke-width="2" />
                  </svg>
                  <div class="chart-labels" :style="{ width: chartWidth + 'px' }">
                    <span v-for="(item, index) in displayTrendData" :key="index" class="x-label">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据表格卡片 -->
        <div class="section-title">明细数据报表</div>
        <div class="glass-card table-card">
          <div class="table-header">
            <span class="col-time">时间点</span>
            <span class="col-value">能耗 (kWh)</span>
          </div>
          <div class="table-body">
            <div v-for="(row, index) in displayTableData" :key="index" class="table-row">
              <span class="col-time">{{ row.time }}</span>
              <span class="col-value">{{ row.value }}</span>
            </div>
            <van-empty v-if="displayTableData.length === 0" description="暂无数据" />
          </div>
        </div>
      </div>
    </div>

    <!-- 设备选择器 -->
    <van-popup v-model:show="showDevicePicker" position="bottom" round>
      <van-picker
        :columns="deviceColumns"
        @confirm="onDeviceConfirm"
        @cancel="showDevicePicker = false"
      />
    </van-popup>

    <!-- 粒度选择器 -->
    <van-popup v-model:show="showGranularityPicker" position="bottom" round>
      <van-picker
        :columns="granularityColumns"
        @confirm="onGranularityConfirm"
        @cancel="showGranularityPicker = false"
      />
    </van-popup>

    <!-- 日期选择器 (日) -->
    <van-calendar
      v-model:show="showDayPicker"
      @confirm="onDayConfirm"
      color="#1989fa"
      :min-date="new Date(2020, 0, 1)"
    />

    <!-- 日期选择器 (月/年) -->
    <van-popup v-model:show="showMonthYearPicker" position="bottom" round>
      <van-date-picker
        v-model="pickerDateValue"
        :title="currentGranularity.value === 'month' ? '选择月份' : '选择年份'"
        :columns-type="currentGranularity.value === 'month' ? ['year', 'month'] : ['year']"
        @confirm="onMonthYearConfirm"
        @cancel="showMonthYearPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const onClickLeft = () => router.back();

// --- 状态定义 ---
const currentDevice = ref({ text: '1F大厅立柜空调', value: 'all' });
const deviceColumns = [
  // { text: '全部设备', value: 'all' },
  { text: '1F大厅立柜空调', value: '1' },
  { text: '办公区照明总柜', value: '2' },
  { text: '动力设备主控', value: '3' }
];

const currentGranularity = ref({ text: '日', value: 'day' });
const granularityColumns = [
  { text: '日', value: 'day' },
  { text: '月', value: 'month' },
  { text: '年', value: 'year' }
];

const selectedDate = ref(new Date());
const pickerDateValue = ref([
  selectedDate.value.getFullYear().toString(),
  (selectedDate.value.getMonth() + 1).toString().padStart(2, '0')
]);

const showDevicePicker = ref(false);
const showGranularityPicker = ref(false);
const showDayPicker = ref(false);
const showMonthYearPicker = ref(false);

// --- 日期展示格式 (顶部筛选栏用) ---
const dateText = computed(() => {
  const d = selectedDate.value;
  const yy = d.getFullYear().toString().slice(-2);
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  
  if (currentGranularity.value.value === 'day') return `${yy}/${mm}/${dd}`;
  if (currentGranularity.value.value === 'month') return `${yy}/${mm}`;
  return `${d.getFullYear()}`;
});

const openDatePicker = () => {
  if (currentGranularity.value.value === 'day') {
    showDayPicker.value = true;
  } else {
    pickerDateValue.value = [
      selectedDate.value.getFullYear().toString(),
      (selectedDate.value.getMonth() + 1).toString().padStart(2, '0')
    ];
    showMonthYearPicker.value = true;
  }
};

const onDeviceConfirm = ({ selectedOptions }) => {
  currentDevice.value = selectedOptions[0];
  showDevicePicker.value = false;
};

const onGranularityConfirm = ({ selectedOptions }) => {
  currentGranularity.value = selectedOptions[0];
  showGranularityPicker.value = false;
};

const onDayConfirm = (date) => {
  selectedDate.value = date;
  showDayPicker.value = false;
};

const onMonthYearConfirm = ({ selectedValues }) => {
  const year = parseInt(selectedValues[0]);
  const month = selectedValues[1] ? parseInt(selectedValues[1]) - 1 : 0;
  selectedDate.value = new Date(year, month, 1);
  showMonthYearPicker.value = false;
};

// --- 数据模拟逻辑 (趋势图 X 轴和表格时间点) ---

const displayTrendData = computed(() => {
  const granularity = currentGranularity.value.value;
  const d = selectedDate.value;
  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  let data = [];
  
  if (granularity === 'day') {
    // 日粒度：hh:mm:ss
    for (let i = 0; i < 96; i++) {
      const h = Math.floor(i / 4).toString().padStart(2, '0');
      const m = ((i % 4) * 15).toString().padStart(2, '0');
      data.push({
        label: `${h}:${m}:00`,
        percent: 20 + Math.random() * 60,
        value: (Math.random() * 10).toFixed(2)
      });
    }
  } else if (granularity === 'month') {
    // 月粒度：yyyy-mm-dd
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= days; i++) {
      const dd = i.toString().padStart(2, '0');
      data.push({
        label: `${yyyy}-${mm}-${dd}`,
        percent: 30 + Math.random() * 50,
        value: (Math.random() * 50 + 20).toFixed(1)
      });
    }
  } else {
    // 年粒度：yyyy-mm
    for (let i = 1; i <= 12; i++) {
      const targetMM = i.toString().padStart(2, '0');
      data.push({
        label: `${yyyy}-${targetMM}`,
        percent: 40 + Math.random() * 40,
        value: (Math.random() * 200 + 500).toFixed(0)
      });
    }
  }
  return data;
});

const displayTableData = computed(() => {
  return [...displayTrendData.value].reverse().map(item => ({
    time: item.label,
    value: item.value
  }));
});

// --- 图表计算 ---
const chartWidth = computed(() => {
  const count = displayTrendData.value.length;
  // 给长字符串标签 (yyyy-mm-dd) 预留足够空间
  const stepWidth = currentGranularity.value.value === 'month' ? 65 : 55;
  if (count * stepWidth <= 300) return 300;
  return count * stepWidth;
});

const chartPath = computed(() => {
  const width = chartWidth.value;
  const height = 150;
  const step = width / (displayTrendData.value.length - 1);
  return displayTrendData.value.map((p, i) => {
    const x = i * step;
    const y = height - (p.percent / 100) * height;
    return (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }).join(' ');
});

const chartPathArea = computed(() => {
  return `${chartPath.value} L ${chartWidth.value} 150 L 0 150 Z`;
});
</script>

<style scoped>
.energy-detail-page {
  position: relative;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding-bottom: 40px;
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
}

.main-content {
  padding: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin-bottom: 20px;
}

/* 筛选条件样式 */
.filter-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.filter-row .label {
  font-size: 14px;
  color: #646566;
}

.filter-row .value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

.filter-row .van-icon {
  color: #c8c9cc;
}

/* 趋势图样式 */
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  padding-left: 4px;
}

.chart-header {
  margin-bottom: 12px;
  text-align: right;
}

.chart-unit {
  font-size: 11px;
  color: #c8c9cc;
}

.chart-body {
  display: flex;
  height: 180px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  font-size: 10px;
  color: #c8c9cc;
  padding-right: 12px;
  width: 28px;
  background: rgba(255, 255, 255, 0.5);
  z-index: 2;
}

.chart-content {
  flex: 1;
  overflow-x: auto;
  position: relative;
}

.scroll-chart {
  min-width: 100%;
}

.detail-chart-svg {
  height: 150px;
  overflow: visible;
  display: block;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-bottom: 5px;
}

.x-label {
  font-size: 9px;
  color: #969799;
  white-space: nowrap;
  transform: scale(0.8);
}

/* 表格样式 */
.table-card {
  padding: 0;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: rgba(25, 137, 250, 0.05);
  padding: 12px 16px;
  font-size: 12px;
  color: #1989fa;
  font-weight: 600;
}

.table-row {
  display: flex;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(242, 243, 245, 0.8);
  font-size: 13px;
  color: #323233;
}

.table-row:last-child {
  border-bottom: none;
}

.col-time { flex: 2; }
.col-value { flex: 1; text-align: center; }

:deep(.custom-nav-bar) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px) !important;
}
</style>
