<template>
  <div class="bind-page">
    <!-- 装饰性背景 -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <van-nav-bar title="设备批量绑定" left-arrow @click-left="onClickLeft" :border="false" fixed placeholder class="custom-nav-bar" />

      <div class="content">
        <!-- 项目选择 -->
        <div class="project-selector-card glass-card" @click="showPicker = true">
          <div class="p-icon">
            <van-icon name="apps-o" size="24" color="#1989fa" />
          </div>
          <div class="p-details">
            <div class="p-label">目标项目</div>
            <div class="p-value-row">
              <span class="p-value">{{ selectedProject }}</span>
              <van-icon name="arrow-down" color="#323233" />
            </div>
          </div>
        </div>

        <!-- 选择器 -->
        <van-popup v-model:show="showPicker" position="bottom" round>
          <van-picker
            :columns="projects"
            @confirm="onConfirm"
            @cancel="showPicker = false"
            show-toolbar
          />
        </van-popup>

        <!-- 提示信息 -->
        <div class="hint-message">
          <span class="hint-text">提示：请先扫码网关（仅 1 个），再扫码子设备（可多个）。</span>
        </div>

        <!-- 设备列表区域 -->
        <div v-if="scannedDevices.length > 0" class="scanned-section">
          <div class="scanned-header">
            <span class="scanned-title">已扫描设备</span>
            <span class="scanned-count">{{ scannedDevices.length }} 个设备</span>
          </div>
          
          <transition-group name="list" tag="div" class="device-cards-container">
            <div v-for="device in sortedDevices" :key="device.id" class="device-bind-card glass-card" :class="device.type">
              <div class="card-top-bar" :class="device.type"></div>
              <div class="card-header">
                <div class="device-tag" :class="device.type">
                  <van-icon :name="device.type === 'gateway' ? 'signal' : 'cluster-o'" />
                  <span>{{ device.type === 'gateway' ? '智能网关' : '子设备' }}</span>
                </div>
                <div class="delete-icon-wrapper" @click="removeDevice(device.id)">
                  <van-icon name="delete-o" class="delete-icon" />
                </div>
              </div>

              <div class="device-main-info">
                <div class="device-icon-wrapper" :class="device.type">
                  <van-icon :name="device.type === 'gateway' ? 'wap-home-o' : 'flash-outline'" size="32" />
                </div>
                <div class="device-text-info">
                  <div class="device-name">{{ device.type === 'gateway' ? '智能网关控制器' : '单相智能断路器' }}</div>
                  <div class="device-id-tag">{{ device.type === 'gateway' ? '网关' : '子设' }}-{{ device.id }}</div>
                </div>
              </div>

              <div class="input-group">
                <div class="input-label">备注名称</div>
                <van-field v-model="device.remark" placeholder="请输入备注名称" class="custom-field">
                  <template #left-icon>
                    <van-icon name="label-o" />
                  </template>
                </van-field>
              </div>

              <div class="input-group">
                <div class="input-label">安装位置</div>
                <van-field v-model="device.location" placeholder="请输入安装位置" class="custom-field">
                  <template #left-icon>
                    <van-icon name="location-o" />
                  </template>
                </van-field>
              </div>

              <div class="input-group">
                <div class="input-label">上传图片</div>
                <van-uploader v-model="device.images" multiple :max-count="1" class="custom-uploader" />
              </div>
            </div>
          </transition-group>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-container">
          <div class="dashed-circle">
            <van-icon name="plus" size="36" color="#dcdee0" />
          </div>
          <div class="empty-title">列表为空</div>
          <div class="empty-subtitle">点击下方扫码添加设备</div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-bar">
        <van-button class="btn-scan" @click="onScan" :loading="scanning">
          <template #icon>
            <van-icon name="photograph" />
          </template>
          扫码添加
        </van-button>
        <van-button 
          class="btn-submit" 
          :class="{ 'btn-animate': scannedDevices.length > 0 && !processing.show }"
          :disabled="scannedDevices.length === 0"
          @click="onSubmit"
        >
          <template #icon>
            <van-icon name="notes-o" />
          </template>
          提交绑定（ {{ scannedDevices.length }} ）
        </van-button>
      </div>
    </div>

    <!-- 过程动画遮罩 -->
    <van-overlay :show="processing.show" class="process-overlay">
      <div class="process-wrapper">
        <div class="steps-container">
          <div class="step-item" :class="{ active: processing.step >= 1, done: processing.step > 1 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 1" name="success" />
              <span v-else>1</span>
            </div>
            <div class="step-label">提交数据</div>
          </div>
          <div class="step-line" :class="{ active: processing.step >= 2 }"></div>
          <div class="step-item" :class="{ active: processing.step >= 2, done: processing.step > 2 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 2" name="success" />
              <span v-else>2</span>
            </div>
            <div class="step-label">执行绑定</div>
          </div>
        </div>
        <div class="process-status">
          <van-loading v-if="processing.step <= 2" size="20px" type="spinner" color="#1989fa" />
          <span class="status-text">{{ processing.statusText }}</span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast, showConfirmDialog } from 'vant';

const router = useRouter();

const showPicker = ref(false);
const selectedProject = ref('示例小区配电房改造项目');
const projects = [
  { text: '示例小区配电房改造项目', value: '1' },
  { text: '上海嘉定工业园区项目', value: '2' },
  { text: '北京朝阳区商业中心项目', value: '3' },
];

const scannedDevices = ref([]);
const scanning = ref(false);

// 过程动画逻辑
const processing = reactive({
  show: false,
  step: 1,
  statusText: '正在提交设备数据...'
});

const sortedDevices = computed(() => {
  return [...scannedDevices.value].sort((a, b) => {
    if (a.type === 'gateway') return -1;
    if (b.type === 'gateway') return 1;
    return 0;
  });
});

const onConfirm = ({ selectedOptions }) => {
  selectedProject.value = selectedOptions[0].text;
  showPicker.value = false;
};

const onClickLeft = () => router.back();

const onScan = () => {
  scanning.value = true;
  const toast = showLoadingToast({
    message: '正在扫描...',
    forbidClick: true,
    duration: 800,
  });

  setTimeout(() => {
    const hasGateway = scannedDevices.value.some(d => d.type === 'gateway');
    const type = hasGateway ? 'sub' : 'gateway';
    const newId = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    scannedDevices.value.unshift({
      id: newId,
      type: type,
      remark: '',
      location: type === 'gateway' ? '科技园1号楼总配电室' : '科技园1号楼10楼配电箱',
      images: []
    });
    scanning.value = false;
    showToast('添加成功');
  }, 800);
};

const removeDevice = (id) => {
  showConfirmDialog({
    title: '确认删除',
    message: '确认要删除该设备吗？',
  }).then(() => {
    const index = scannedDevices.value.findIndex(d => d.id === id);
    if (index !== -1) {
      scannedDevices.value.splice(index, 1);
      showToast('删除成功');
    }
  }).catch(() => {});
};

const onSubmit = () => {
  const hasGateway = scannedDevices.value.some(d => d.type === 'gateway');
  if (!hasGateway) {
    showToast('请先扫码添加一个网关设备');
    return;
  }
  
  processing.show = true;
  processing.step = 1;
  processing.statusText = '正在提交设备数据...';

  setTimeout(() => {
    processing.step = 2;
    processing.statusText = '正在执行设备绑定...';
    
    setTimeout(() => {
      processing.step = 3;
      processing.statusText = '绑定成功';
      
      setTimeout(() => {
        processing.show = false;
        showSuccessToast('绑定成功');
        router.push('/');
      }, 800);
    }, 2000);
  }, 2000);
};
</script>

<style scoped>
.bind-page {
  position: relative;
  height: 100vh;
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-nav-bar {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
}

:deep(.van-nav-bar__title) {
  font-weight: bold;
  color: #323233;
}

:deep(.van-nav-bar .van-icon) {
  color: #1989fa;
  font-size: 20px;
}

.content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.project-selector-card {
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.p-icon {
  width: 48px;
  height: 48px;
  background: #f0f7ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.p-details {
  flex: 1;
}

.p-label {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.p-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-value {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
}

.hint-message {
  background-color: rgba(240, 247, 255, 0.8);
  border: 1px solid #d1e9ff;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.hint-text {
  font-size: 13px;
  color: #1989fa;
  line-height: 1.6;
}

/* 已扫描设备列表样式 */
.scanned-section {
  flex: 1;
}

.scanned-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.scanned-title {
  font-size: 15px;
  font-weight: bold;
  color: #646566;
}

.scanned-count {
  font-size: 14px;
  color: #1989fa;
  font-weight: bold;
}

.device-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
}

.device-bind-card {
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.card-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.card-top-bar.gateway { background-color: #1989fa; }
.card-top-bar.sub { background-color: #07c160; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.device-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.device-tag.gateway { background: #f0f7ff; color: #1989fa; }
.device-tag.sub { background: #e8fff0; color: #07c160; }

.delete-icon-wrapper {
  background: #fff1f0;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-icon {
  font-size: 20px;
  color: #ee0a24;
}

.device-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.device-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.device-icon-wrapper.gateway { background: #f0f7ff; color: #1989fa; }
.device-icon-wrapper.sub { background: #e8fff0; color: #07c160; }

.device-text-info {
  flex: 1;
}

.device-name {
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 6px;
}

.device-id-tag {
  display: inline-block;
  background: rgba(242, 243, 245, 0.6);
  color: #969799;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  font-size: 14px;
  font-weight: bold;
  color: #646566;
  margin-bottom: 8px;
}

.custom-field {
  padding: 10px 12px;
  background: rgba(247, 248, 250, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(235, 237, 240, 0.8);
}

:deep(.van-field__left-icon) {
  color: #1989fa;
}

.custom-uploader {
  margin-top: 4px;
}

:deep(.van-uploader__upload) {
  background: rgba(247, 248, 250, 0.6);
  border-radius: 12px;
  border: 1px dashed #dcdee0;
  margin: 0;
  width: 80px;
  height: 80px;
}

.empty-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dashed-circle {
  width: 100px;
  height: 100px;
  border: 2px dashed #dcdee0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 20px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.empty-subtitle {
  font-size: 14px;
  color: #969799;
}

.bottom-bar {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 16px 16px 32px;
  display: flex;
  gap: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
  flex-shrink: 0;
}

.btn-scan {
  flex: 1;
  height: 50px;
  background: white;
  border: 1px dashed #1989fa !important;
  color: #1989fa !important;
  font-weight: bold;
  border-radius: 12px;
}

.btn-submit {
  flex: 1.5;
  height: 50px;
  background-color: #1989fa !important;
  border: none !important;
  color: #ffffff !important;
  font-weight: bold;
  border-radius: 12px;
  transition: all 0.3s;
}

.btn-submit:disabled {
  background-color: #d8dde3 !important;
  opacity: 1;
}

.btn-animate {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 137, 250, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 15px rgba(25, 137, 250, 0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 137, 250, 0.4); }
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 过程动画遮罩 */
.process-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000 !important;
}

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
</style>
