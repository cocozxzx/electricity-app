<template>
  <div class="device-detail-page">
    <!-- 装饰性背景 (彻底置底 z-index: -999) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 顶部导航栏：显式固定并绝对置顶 -->
    <van-nav-bar
      title="网关详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      class="glass-nav"
    />

    <div class="content">
      <!-- 基础信息 -->
      <div class="base-info-section">
        <!-- <div class="section-title">基础信息</div> -->
        <div class="info-card glass-card">
          <div class="device-image-wrapper">
            <div class="image-box">
              <van-icon name="plug" size="48" color="#1989fa" />
              <p class="image-tip">(设备图片)</p>
            </div>
          </div>

          <div class="info-list">
            <div class="info-row">
              <span class="label">设备编码</span>
              <span class="value">1234125202601071003</span>
            </div>
            <div class="info-row">
              <span class="label">设备名称</span>
              <span class="value">采集器03</span>
            </div>
            <div class="info-row">
              <span class="label">安装人员</span>
              <span class="value mono">张三（18788888888）</span>
            </div>
            <div class="info-row">
              <span class="label">产品名称</span>
              <span class="value">导轨网关G1</span>
            </div>
            <div class="info-row">
              <span class="label">安装位置</span>
              <span class="value">{{ deviceAddress }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备操作 -->
      <!-- <div class="section-title">设备操作</div> -->
      <div class="action-card glass-card">
        <div class="action-item blue" @click="showModifyAddress">
          <van-icon name="location-o" />
          <span>修改地址</span>
        </div>
        <div class="action-item green" @click="showNavigation">
          <van-icon name="guide-o" />
          <span>导航</span>
        </div>
        <div class="action-item orange" @click="goToReplace">
          <van-icon name="replay" />
          <span>更换设备</span>
        </div>
        <div class="action-item red" @click="showDeleteConfirm">
          <van-icon name="delete-o" />
          <span>解绑设备</span>
        </div>
      </div>

      <!-- 远程控制 -->
      <div class="control-card glass-card control-card-spacing">
        <van-button block round class="control-btn restore" @click="onRestoreDefault">
          <van-icon name="revoke" />
          <span>恢复默认</span>
        </van-button>
        <van-button block round class="control-btn restart control-restart-spacing" @click="onRestart">
          <van-icon name="replay" />
          <span>重启网关</span>
        </van-button>
      </div>

      <!-- 子设备列表 -->
      <div class="section-title">子设备列表</div>
      <div class="sub-device-card glass-card">
        <div class="sub-table-head">
          <span class="col col-name">设备名称</span>
          <span class="col">设备类型</span>
          <span class="col">设备状态</span>
          <span class="col">开关状态</span>
        </div>
        <div v-for="(item, index) in subDeviceList" :key="index" class="sub-table-row">
          <a class="col col-name link" @click="goToSubDevice(item)">{{ item.name }}</a>
          <span class="col">{{ item.type }}</span>
          <span class="col">
            <span class="sub-badge" :class="item.onlineStatus === '在线' ? 'online' : 'offline'">{{ item.onlineStatus }}</span>
          </span>
          <span class="col">
            <span class="sub-badge" :class="item.switchStatus === '合闸' ? 'closed' : 'open'">{{ item.switchStatus }}</span>
          </span>
        </div>
      </div>

      <!-- 实时监测数据 -->
      <div class="section-title with-refresh">
        <span>实时监测数据</span>
        <div class="realtime-switch-wrapper">
          <span class="switch-label"></span>
          <van-switch v-model="isRealTime" size="18px" />
        </div>
      </div>
      <div class="data-grid">
        <div v-for="(item, index) in monitoringData" :key="index" class="data-card glass-card">
          <div class="data-label">{{ item.label }}</div>
          <div class="data-main">
            <span class="data-value">{{ item.value }}</span>
            <span class="data-unit">{{ item.unit }}</span>
          </div>
        </div>

        <!-- 子设备状态 -->
        <div class="data-card glass-card">
          <div class="data-label">子设备状态</div>
          <div class="data-main">
            <span class="data-value">{{ subDevice.online }} / {{ subDevice.total }}</span>
          </div>
          <div class="sub-progress">
            <div
              class="sub-progress-inner"
              :style="{ width: subDevice.total ? (subDevice.online / subDevice.total * 100) + '%' : '0%' }"
            ></div>
          </div>
          <div class="sub-legend">
            <span>在线: {{ subDevice.online }}</span>
            <span>离线: {{ subDevice.offline }}</span>
          </div>
        </div>

        <!-- 数据上报 -->
        <div class="data-card glass-card">
          <div class="data-label">数据上报</div>
          <div class="report-row">
            <span class="report-label">最后一次上报:</span>
            <span class="report-time">{{ reportInfo.lastTime }}</span>
          </div>
          <div class="report-sub">上报频率: {{ reportInfo.frequency }}</div>
        </div>
      </div>

    </div>

    <!-- 修改地址弹窗 -->
    <van-dialog
      v-model:show="addressDialog.show"
      :show-confirm-button="false"
      class-name="glass-dialog"
    >
      <div class="delete-dialog-content">
        <h3 class="delete-title">修改设备地址</h3>
        <div class="dialog-content-inner">
          <van-field
            v-model="addressDialog.value"
            type="textarea"
            rows="3"
            placeholder="请输入详细安装地址"
            class="dialog-input"
          />
        </div>
        <div class="delete-actions-group">
          <van-button class="cancel-btn" @click="addressDialog.show = false" round>取消</van-button>
          <van-button class="confirm-btn" type="primary" @click="confirmAddress" round>确认</van-button>
        </div>
      </div>
    </van-dialog>

    <!-- 导航软件选择 -->
    <van-action-sheet
      v-model:show="showNavSheet"
      :actions="navActions"
      cancel-text="取消"
      close-on-click-action
      @select="onNavSelect"
      class-name="glass-sheet"
    />

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="deleteDialog.show"
      :show-confirm-button="false"
      class-name="glass-dialog"
    >
      <div class="delete-dialog-content">
        <div class="warning-icon">
          <van-icon name="warning" color="#ee0a24" size="64" />
        </div>
        <h3 class="delete-title">确认解绑设备?</h3>
        <div class="delete-actions-group">
          <van-button class="cancel-btn" @click="deleteDialog.show = false" round>取消</van-button>
          <van-button class="confirm-btn" type="danger" @click="confirmDelete" round>解绑</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showFailToast, showConfirmDialog } from 'vant';

const router = useRouter();
const isOn = ref(false);
const currentPhase = ref('A相');
const isRealTime = ref(false);

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

const handleRefresh = () => {
  showToast('数据已刷新');
};

// 恢复默认
const onRestoreDefault = () => {
  showConfirmDialog({
    title: '恢复默认',
    message: '确认将网关参数恢复为出厂默认设置？',
    className: 'glass-dialog',
  })
    .then(() => showSuccessToast('已恢复默认设置'))
    .catch(() => {});
};

// 重启网关
const onRestart = () => {
  showConfirmDialog({
    title: '重启网关',
    message: '确认重启该网关？重启期间将短暂中断数据采集。',
    className: 'glass-dialog',
  })
    .then(() => showSuccessToast('重启指令已下发'))
    .catch(() => {});
};

// 设备地址（示例数据）
const deviceAddress = ref('1号配电柜 2层右侧');

// 1. 修改地址
const addressDialog = reactive({
  show: false,
  value: '',
});
const showModifyAddress = () => {
  addressDialog.value = deviceAddress.value;
  addressDialog.show = true;
};
const confirmAddress = () => {
  if (!addressDialog.value.trim()) {
    showToast('请输入详细安装地址');
    return;
  }
  deviceAddress.value = addressDialog.value;
  addressDialog.show = false;
  showSuccessToast('修改成功');
};

// 2. 导航
const showNavSheet = ref(false);
const navActions = [
  { name: '高德地图' },
  { name: '百度地图' },
  { name: '腾讯地图' },
  { name: '苹果地图' },
];
const showNavigation = () => {
  showNavSheet.value = true;
};
const onNavSelect = (item) => {
  showToast(`正在跳转至 ${item.name}`);
};

// 3. 更换设备
const goToReplace = () => {
  router.push({ name: 'ReplaceDevice' });
};

// 跳转所属网关
const goToGateway = () => {
  router.push({ name: 'GatewayDetail' });
};

// 4. 删除设备
const deleteDialog = reactive({
  show: false,
});
const showDeleteConfirm = () => {
  deleteDialog.show = true;
};
const confirmDelete = () => {
  deleteDialog.show = false;
  showSuccessToast('删除成功');
  router.back();
};

const monitoringData = [
  { label: '载板温度', value: '34.6', unit: '℃' },
  { label: '载板湿度', value: '47', unit: '%' },
  { label: '信号强度', value: '0', unit: '' },
  { label: '接口占用', value: '--', unit: '' },
  { label: '累计运行（小时）', value: '48', unit: '' },
];

// 子设备状态
const subDevice = {
  total: 6,
  online: 6,
  offline: 0,
};

// 子设备列表
const subDeviceList = [
  { name: '重合闸01', type: '计量重合闸', onlineStatus: '在线', switchStatus: '合闸' },
  { name: '微断06', type: 'B型L7', onlineStatus: '离线', switchStatus: '开闸' },
  { name: '微断05', type: 'B型L7', onlineStatus: '在线', switchStatus: '合闸' },
];

// 点击子设备名称跳转设备详情
const goToSubDevice = () => {
  router.push({ name: 'DeviceDetail' });
};

// 数据上报
const reportInfo = {
  lastTime: '11:58:10',
  frequency: '900 秒/次',
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

.section-title.with-refresh {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 16px;
}

.realtime-switch-wrapper {
  display: flex;
  align-items: center;
}

.switch-label {
  font-size: 13px;
  color: #646566;
  margin-right: 8px;
  font-weight: normal;
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

.value.link {
  color: #1989fa;
  text-decoration: underline;
  cursor: pointer;
}

/* 设备操作 */
.action-card {
  display: flex;
  padding: 8px 0;
}

.action-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  font-size: 12px;
  cursor: pointer;
}

.action-item .van-icon {
  font-size: 22px;
}

.action-item.blue { color: #1989fa; }
.action-item.green { color: #07c160; }
.action-item.orange { color: #ff976a; }
.action-item.red { color: #ee0a24; }

/* 远程控制 */
.control-card-spacing {
  margin-top: 16px;
}

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

.control-btn.restore {
  background: rgba(25, 137, 250, 0.1);
  color: #1989fa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn.restart {
  background: rgba(100, 101, 102, 0.1);
  color: #646566;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn.restore .van-icon,
.control-btn.restart .van-icon {
  font-size: 20px;
}

.control-restart-spacing {
  margin-top: 12px;
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

/* 子设备列表 */
.sub-device-card {
  padding: 4px 12px;
}

.sub-table-head,
.sub-table-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.sub-table-head {
  border-bottom: 1px solid rgba(242, 243, 245, 0.8);
}

.sub-table-row {
  border-bottom: 1px solid rgba(242, 243, 245, 0.6);
}

.sub-table-row:last-child {
  border-bottom: none;
}

.sub-table-head .col {
  font-size: 13px;
  color: #969799;
}

.sub-table-row .col {
  font-size: 13px;
  color: #323233;
}

.col {
  flex: 1;
  text-align: center;
}

.col-name {
  flex: 1.4;
  text-align: left;
}

.col-name.link {
  color: #1989fa;
  text-decoration: underline;
  cursor: pointer;
}

.sub-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.sub-badge.online,
.sub-badge.closed {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.sub-badge.offline {
  color: #969799;
  background: rgba(150, 151, 153, 0.12);
}

.sub-badge.open {
  color: #ff976a;
  background: rgba(255, 151, 106, 0.12);
}

/* 子设备状态进度条 */
.sub-progress {
  width: 100%;
  height: 6px;
  background: #ebedf0;
  border-radius: 3px;
  overflow: hidden;
}

.sub-progress-inner {
  height: 100%;
  background: #07c160;
  border-radius: 3px;
  transition: width 0.3s;
}

.sub-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #969799;
}

/* 数据上报 */
.report-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.report-label {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.report-time {
  font-size: 14px;
  color: #1989fa;
  font-weight: 600;
  margin-left: 6px;
}

.report-sub {
  font-size: 12px;
  color: #969799;
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

/* 导航选择面板：渐变系统风格 */
.glass-sheet.van-action-sheet {
  background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px 24px 0 0 !important;
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
