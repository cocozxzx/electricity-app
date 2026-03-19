<template>
  <div class="replace-device-page">
    <van-nav-bar
      title="更换新设备"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="content">
      <div v-if="!hasScanned" class="status-box">
        <div class="icon-wrapper">
          <van-icon name="replay" size="64" color="#dcdee0" />
        </div>
        <h3 class="status-title">未选择新设备</h3>
        <p class="status-desc">点击下方扫码识别新设备</p>
      </div>

      <div v-else class="device-card-wrapper">
        <div class="card-header-title">新设备信息</div>
        <div class="device-info-card">
          <div class="card-top-bar"></div>
          <div class="card-body">
            <div class="card-top-row">
              <van-tag type="primary" plain class="sub-device-tag">
                <template #icon><van-icon name="cluster-o" /></template>
                子设备
              </van-tag>
              <van-icon name="delete-o" color="#ee0a24" class="delete-icon" @click="hasScanned = false" />
            </div>

            <div class="device-main-info">
              <div class="device-icon-box">
                <van-icon name="flash-outline" size="32" color="#07c160" />
              </div>
              <div class="device-text">
                <div class="device-name">1P 智能断路器</div>
                <div class="device-sn-tag">SN-5S2LS5Z97</div>
              </div>
            </div>

            <div class="input-section">
              <div class="input-label">备注名称</div>
              <van-field
                v-model="deviceInfo.remark"
                placeholder="请输入备注名称"
                class="custom-field"
                left-icon="label-o"
              />
            </div>

            <div class="input-section">
              <div class="input-label">安装位置</div>
              <van-field
                v-model="deviceInfo.location"
                placeholder="请输入安装位置"
                class="custom-field"
                left-icon="location-o"
              />
            </div>

            <div class="input-section">
              <div class="input-label">上传图片</div>
              <div class="upload-box">
                <van-icon name="plus" size="24" color="#969799" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-actions">
      <div class="btn-group">
        <van-button 
          class="scan-btn" 
          plain 
          type="primary" 
          round
          @click="onScan"
        >
          <template #icon>
            <van-icon name="photograph" />
          </template>
          扫码识别
        </van-button>
        <van-button 
          class="submit-btn" 
          type="primary" 
          round 
          :disabled="!hasScanned"
          @click="onSubmit"
        >
          <template #icon>
            <van-icon name="passed" />
          </template>
          提交更换
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
            <div class="step-label">解绑原设备</div>
          </div>
          <div class="step-line" :class="{ active: processing.step >= 2 }"></div>
          <div class="step-item" :class="{ active: processing.step >= 2, done: processing.step > 2 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 2" name="success" />
              <span v-else>2</span>
            </div>
            <div class="step-label">绑定新设备</div>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast, showSuccessToast } from 'vant';

const router = useRouter();
const hasScanned = ref(false);
const deviceInfo = reactive({
  remark: '',
  location: '杭州市滨江区xx大厦5F'
});

const onClickLeft = () => router.back();

const onScan = () => {
  if (hasScanned.value) {
    showToast('当前已经扫描过设备了，如需添加请删除当前设备。');
    return;
  }
  const toast = showLoadingToast({
    message: '正在识别...',
    forbidClick: true,
  });

  setTimeout(() => {
    closeToast();
    hasScanned.value = true;
    showToast('识别成功');
  }, 1000);
};

// 过程动画逻辑
const processing = reactive({
  show: false,
  step: 1,
  statusText: '正在解绑原设备...'
});

const onSubmit = () => {
  if (!deviceInfo.remark.trim()) {
    showToast('请输入备注名称');
    return;
  }
  if (!deviceInfo.location.trim()) {
    showToast('请输入安装位置');
    return;
  }

  processing.show = true;
  processing.step = 1;
  processing.statusText = '正在解绑原设备...';

  setTimeout(() => {
    processing.step = 2;
    processing.statusText = '正在绑定新设备...';
    
    setTimeout(() => {
      processing.step = 3;
      processing.statusText = '更换成功';
      
      setTimeout(() => {
        processing.show = false;
        showSuccessToast('更换成功');
        router.back();
      }, 800);
    }, 2000);
  }, 2000);
};
</script>

<style scoped>
.replace-device-page {
  position: relative;
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
}

.status-box {
  margin-top: 100px;
  text-align: center;
}

.icon-wrapper {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  border: 1px dashed #dcdee0;
}

.status-title {
  font-size: 20px;
  color: #323233;
  margin-bottom: 12px;
}

.status-desc {
  font-size: 14px;
  color: #969799;
}

/* 设备卡片样式 */
.device-card-wrapper {
  width: 100%;
}

.card-header-title {
  font-size: 16px;
  font-weight: bold;
  color: #646566;
  margin-bottom: 12px;
}

.device-info-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-top-bar {
  height: 6px;
  background-color: #07c160;
}

.card-body {
  padding: 16px;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sub-device-tag {
  background-color: #e8fff0 !important;
  color: #07c160 !important;
  border-radius: 4px;
  padding: 2px 8px;
}

.delete-icon {
  font-size: 20px;
  background: #fff1f0;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #ffccc7;
}

.device-main-info {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f2f3f5;
}

.device-icon-box {
  width: 60px;
  height: 60px;
  background: #e8fff0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.device-name {
  font-size: 18px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.device-sn-tag {
  display: inline-block;
  font-size: 12px;
  color: #1989fa;
  background: #eef7ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.input-section {
  margin-bottom: 16px;
}

.input-label {
  font-size: 13px;
  color: #646566;
  margin-bottom: 8px;
  font-weight: 500;
}

.custom-field {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 10px 12px;
}

.upload-box {
  width: 80px;
  height: 80px;
  background: #f7f8fa;
  border: 1px dashed #dcdee0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-actions {
  padding: 20px 16px 40px;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.btn-group {
  display: flex;
  gap: 12px;
}

.scan-btn, .submit-btn {
  flex: 1;
  height: 50px;
  font-weight: bold;
}

.submit-btn:disabled {
  background-color: #f2f3f5;
  border-color: #f2f3f5;
  color: #c8c9cc;
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
