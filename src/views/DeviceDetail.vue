<template>
  <div class="device-detail-page">
    <!-- 装饰性背景 (彻底置底 z-index: -999) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 顶部导航栏：显式固定并绝对置顶 -->
    <van-nav-bar
      title="设备详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      class="glass-nav"
    />

    <div class="content">
      <!-- 基础信息 -->
      <div class="base-info-section">
        <div class="section-title">基础信息</div>
        <div class="info-card glass-card">
          <div class="device-image-wrapper">
            <div class="image-box">
              <van-icon name="plug" size="48" color="#1989fa" />
              <p class="image-tip">(设备图片)</p>
            </div>
          </div>
          
          <div class="info-list">
            <div class="info-row">
              <span class="label">设备名称</span>
              <span class="value">1楼大厅照明空开</span>
            </div>
            <div class="info-row">
              <span class="label">备注名称</span>
              <span class="value">大厅照明主回路</span>
            </div>
            <div class="info-row">
              <span class="label">设备ID</span>
              <span class="value mono">24033037930079</span>
            </div>
            <div class="info-row">
              <span class="label">设备型号</span>
              <span class="value">3P智能塑壳断路器 (250A)</span>
            </div>
            <div class="info-row">
              <span class="label">安装位置</span>
              <span class="value">1号配电柜 2层右侧</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 远程控制 -->
      <div class="section-title">远程控制</div>
      <div class="control-card glass-card">
        <van-button 
          block 
          round 
          :class="['control-btn', isOn ? 'off' : 'on']"
          @click="showSecurityConfirm"
        >
          {{ isOn ? '分闸' : '合闸' }}
        </van-button>
      </div>

      <!-- 实时监测数据 -->
      <div class="section-title">实时监测数据</div>
      <div class="data-grid">
        <div v-for="(item, index) in monitoringData" :key="index" class="data-card glass-card">
          <div class="data-label">{{ item.label }}</div>
          <div class="data-main">
            <span class="data-value">{{ item.value }}</span>
            <span class="data-unit">{{ item.unit }}</span>
          </div>
          <div class="data-threshold">阈值: {{ item.threshold }}</div>
        </div>
      </div>

      <!-- 相位数据切换 -->
      <div class="phase-tabs-container">
        <div class="phase-tabs glass-card no-blur">
          <div 
            v-for="phase in ['A相', 'B相', 'C相']" 
            :key="phase"
            :class="['phase-tab', { active: currentPhase === phase }]"
            @click="currentPhase = phase"
          >
            {{ phase }}
          </div>
        </div>
      </div>

      <div class="data-grid">
        <div v-for="(item, index) in phaseData[currentPhase]" :key="index" class="data-card glass-card">
          <div class="data-label">{{ item.label }}</div>
          <div class="data-main">
            <span class="data-value">{{ item.value }}</span>
            <span class="data-unit">{{ item.unit }}</span>
          </div>
          <div class="data-threshold">阈值: {{ item.threshold }}</div>
        </div>
      </div>
    </div>

    <!-- 安全确认弹窗 -->
    <van-dialog
      v-model:show="securityDialog.show"
      :show-confirm-button="false"
      class-name="glass-dialog"
    >
      <div class="delete-dialog-content">
        <h3 class="delete-title">安全确认</h3>
        <p class="dialog-desc">远程控制需要输入密码确认</p>
        <div class="dialog-content-inner">
          <van-field
            v-model="securityDialog.password"
            type="password"
            placeholder="请输入操作密码"
            class="dialog-input"
          />
        </div>
        <div class="delete-actions-group">
          <van-button class="cancel-btn" @click="securityDialog.show = false" round>再想想</van-button>
          <van-button class="confirm-btn" type="primary" @click="handleCommand" round>确认操作</van-button>
        </div>
      </div>
    </van-dialog>

    <!-- 过程动画遮罩 -->
    <van-overlay :show="processing.show" class="process-overlay">
      <div class="process-wrapper">
        <div class="steps-container">
          <div class="step-item" :class="{ active: processing.step >= 1, done: processing.step > 1 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 1" name="success" />
              <span v-else>1</span>
            </div>
            <div class="step-label">密码验证</div>
          </div>
          <div class="step-line" :class="{ active: processing.step >= 2 }"></div>
          <div class="step-item" :class="{ active: processing.step >= 2, done: processing.step > 2 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 2" name="success" />
              <span v-else>2</span>
            </div>
            <div class="step-label">指令下发</div>
          </div>
          <div class="step-line" :class="{ active: processing.step >= 3 }"></div>
          <div class="step-item" :class="{ active: processing.step >= 3, done: processing.step > 3 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 3" name="success" />
              <span v-else>3</span>
            </div>
            <div class="step-label">下发成功</div>
          </div>
        </div>
        <div class="process-status">
          <van-loading v-if="processing.step <= 3" size="20px" type="spinner" color="#1989fa" />
          <span class="status-text">{{ processing.statusText }}</span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showFailToast } from 'vant';

const router = useRouter();
const isOn = ref(false);
const currentPhase = ref('A相');

const onClickLeft = () => router.back();

// 安全确认逻辑
const securityDialog = reactive({
  show: false,
  password: ''
});

const showSecurityConfirm = () => {
  securityDialog.password = '';
  securityDialog.show = true;
};

// 过程动画逻辑
const processing = reactive({
  show: false,
  step: 1,
  statusText: '正在验证密码...'
});

const handleCommand = () => {
  if (!securityDialog.password.trim()) {
    showFailToast('请输入操作密码');
    return;
  }
  
  securityDialog.show = false;
  processing.show = true;
  processing.step = 1;
  processing.statusText = '密码验证成功';

  // 模拟过程
  setTimeout(() => {
    processing.step = 2;
    processing.statusText = '指令下发中...';
    
    setTimeout(() => {
      processing.step = 3;
      processing.statusText = '下发成功，设备响应中';
      
      setTimeout(() => {
        processing.show = false;
        isOn.value = !isOn.value;
        showSuccessToast(isOn.value ? '已合闸' : '已分闸');
      }, 1000);
    }, 1500);
  }, 800);
};

const monitoringData = [
  { label: '剩余电流(漏电)', value: '0.02', unit: 'mA', threshold: '≤ 30 mA' },
  { label: '电网频率', value: '50.01', unit: 'Hz', threshold: '49.5-50.5 Hz' },
  { label: '载板温度', value: '34.5', unit: '℃', threshold: '≤ 80 ℃' },
  { label: '载板湿度', value: '45.2', unit: '%', threshold: '≤ 85 %' },
  { label: '总有功功率', value: '12.5', unit: 'kW', threshold: '≤ 15.0 kW' },
  { label: '总无功功率', value: '1.2', unit: 'kVar', threshold: '≤ 5.0 kVar' },
  { label: '总功率因数', value: '0.96', unit: '', threshold: '≥ 0.85' },
  { label: '信号强度', value: '-65', unit: 'dBm', threshold: '≥ -90 dBm' },
];

const phaseData = {
  'A相': [
    { label: '电压', value: '220.1', unit: 'V', threshold: '207-253 V' },
    { label: '后端电压', value: '220.0', unit: 'V', threshold: '207-253 V' },
    { label: '电流', value: '15.2', unit: 'A', threshold: '≤ 63 A' },
    { label: '有功功率', value: '3.3', unit: 'kW', threshold: '≤ 5.0 kW' },
    { label: '端子温度 (进)', value: '35.1', unit: '℃', threshold: '≤ 85 ℃' },
    { label: '端子温度 (出)', value: '34.8', unit: '℃', threshold: '≤ 85 ℃' },
  ],
  'B相': [
    { label: '电压', value: '219.5', unit: 'V', threshold: '207-253 V' },
    { label: '后端电压', value: '219.4', unit: 'V', threshold: '207-253 V' },
    { label: '电流', value: '14.8', unit: 'A', threshold: '≤ 63 A' },
    { label: '有功功率', value: '3.1', unit: 'kW', threshold: '≤ 5.0 kW' },
    { label: '端子温度 (进)', value: '34.5', unit: '℃', threshold: '≤ 85 ℃' },
    { label: '端子温度 (出)', value: '34.2', unit: '℃', threshold: '≤ 85 ℃' },
  ],
  'C相': [
    { label: '电压', value: '221.2', unit: 'V', threshold: '207-253 V' },
    { label: '后端电压', value: '221.0', unit: 'V', threshold: '207-253 V' },
    { label: '电流', value: '15.5', unit: 'A', threshold: '≤ 63 A' },
    { label: '有功功率', value: '3.4', unit: 'kW', threshold: '≤ 5.0 kW' },
    { label: '端子温度 (进)', value: '35.8', unit: '℃', threshold: '≤ 85 ℃' },
    { label: '端子温度 (出)', value: '35.5', unit: '℃', threshold: '≤ 85 ℃' },
  ]
};
</script>

<style scoped>
.device-detail-page {
  position: relative;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding-bottom: 30px;
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

.content {
  position: relative;
  z-index: 1;
  padding: 16px;
}

.base-info-section {
  padding-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 24px 0 12px;
  padding-left: 12px;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background-color: #1989fa;
  border-radius: 2px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.no-blur {
  backdrop-filter: none;
}

/* 基础信息 */
.device-image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.image-box {
  width: 100%;
  height: 140px;
  background: rgba(25, 137, 250, 0.05);
  border: 1px dashed rgba(25, 137, 250, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-tip {
  margin-top: 8px;
  font-size: 13px;
  color: #969799;
}

.info-list .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 15px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  color: #646566;
}

.info-row .value {
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.value.mono {
  font-family: monospace;
}

/* 远程控制 */
.control-btn {
  height: 54px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.control-btn.on {
  background: rgba(7, 193, 96, 0.1);
  color: #07c160;
}

.control-btn.off {
  background: rgba(238, 10, 36, 0.1);
  color: #ee0a24;
}

/* 数据网格 */
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.data-card {
  padding: 16px 12px;
}

.data-label {
  font-size: 13px;
  color: #646566;
  margin-bottom: 8px;
}

.data-main {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.data-value {
  font-size: 22px;
  font-weight: bold;
  color: #1a1a1a;
}

.data-unit {
  font-size: 12px;
  color: #969799;
  margin-left: 4px;
}

.data-threshold {
  font-size: 11px;
  color: #ee0a24;
  background: rgba(238, 10, 36, 0.05);
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
}

/* 相位切换 */
.phase-tabs-container {
  margin: 24px 0 12px;
}

.phase-tabs {
  background: rgba(235, 237, 240, 0.6);
  border-radius: 24px;
  display: flex;
  padding: 4px;
}

.phase-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  border-radius: 20px;
  color: #646566;
  transition: all 0.3s;
}

.phase-tab.active {
  background: white;
  color: #1989fa;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 局部样式 */
.dialog-content {
  padding: 24px 16px;
  text-align: center;
}

.dialog-desc {
  font-size: 14px;
  color: #969799;
  margin-bottom: 20px;
}

.dialog-input {
  background-color: transparent !important;
  border-radius: 12px;
  border: 1px solid #ebedf0;
}

/* 过程动画遮罩 */
.process-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000 !important;
}

.steps-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f2f3f5;
  color: #969799;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.step-label {
  font-size: 12px;
  color: #969799;
  white-space: nowrap;
}

.step-item.active .step-icon {
  background: #1989fa;
  color: white;
  box-shadow: 0 0 10px rgba(25, 137, 250, 0.4);
}

.step-item.active .step-label {
  color: #1989fa;
  font-weight: bold;
}

.step-item.done .step-icon {
  background: #e8fff0;
  color: #07c160;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #f2f3f5;
  margin: 0 -10px 20px;
  transition: all 0.3s;
}

.step-line.active {
  background: #1989fa;
}

.process-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.status-text {
  font-size: 15px;
  color: #1989fa;
  font-weight: 500;
}

.delete-dialog-content {
  padding: 32px 24px;
  text-align: center;
}

.delete-title {
  font-size: 20px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
}

.dialog-content-inner {
  margin: 20px 0;
}

.delete-actions-group {
  display: flex;
  gap: 12px;
}

.delete-actions-group .van-button {
  flex: 1;
  height: 44px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.cancel-btn {
  background-color: #f0f7ff !important;
  color: #1989fa !important;
  border: none !important;
}
</style>

<!-- 全局样式：强制置顶并确保弹窗渐变样式 -->
<style>
/* 导航栏置顶并强制提升层级：正确穿透 placeholder */
.glass-nav {
  z-index: 9999 !important;
}
.glass-nav .van-nav-bar,
.van-nav-bar.glass-nav {
  z-index: 9999 !important;
  background: linear-gradient(to bottom, #ffffff, #f0f7ff) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
}

/* 弹窗背景样式：渐变系统风格 */
.glass-dialog.van-dialog {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden;
}

/* 过程动画容器背景样式：渐变系统风格 */
.process-wrapper {
  width: 85%;
  max-width: 320px;
  padding: 32px 20px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
}
</style>
