<template>
  <div class="work-order-handle">
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 顶部固定区域 -->
    <div class="sticky-header">
      <van-nav-bar
        title="工单处理"
        left-arrow
        @click-left="$emit('close')"
        class="custom-nav-bar"
      />
    </div>

    <div class="handle-container">
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

      <!-- 维修反馈表单 -->
      <div class="section-card glass-card">
        <div class="section-header">
          <span class="blue-bar"></span>
          <span class="title">维修反馈</span>
        </div>
        
        <van-form @submit="onSubmit" class="feedback-form">
          <div class="form-item">
            <div class="form-label required">排查说明</div>
            <van-field
              v-model="formData.explanation"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入现场排查的具体情况..."
              class="custom-field"
              :rules="[{ required: true, message: '请输入排查说明' }]"
            />
          </div>

          <div class="form-item">
            <div class="form-label required">处置措施</div>
            <van-field
              v-model="formData.action"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入针对故障采取的修复措施..."
              class="custom-field"
              :rules="[{ required: true, message: '请输入处置措施' }]"
            />
          </div>

          <div class="form-item">
            <div class="form-label required">现场照片</div>
            <van-uploader 
              v-model="formData.fileList" 
              multiple 
              :max-count="4" 
              upload-icon="plus"
              class="custom-uploader"
            />
          </div>

          <div class="form-actions">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit" 
              class="submit-btn"
            >
              提交处理
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits } from 'vue';
import { showSuccessToast } from 'vant';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const formData = reactive({
  explanation: '',
  action: '',
  fileList: []
});

const onSubmit = () => {
  showSuccessToast('提交成功');
  setTimeout(() => {
    emit('submit', { ...formData });
    emit('close');
  }, 1000);
};
</script>

<style scoped>
.work-order-handle {
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

.handle-container {
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

.desc-box {
  background: rgba(247, 248, 250, 0.6);
  padding: 12px;
  border-radius: 12px;
  line-height: 1.6;
  color: #646566;
  font-weight: 400;
}

/* 表单样式 */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.form-label.required::before {
  content: '*';
  color: #ee0a24;
  margin-right: 4px;
}

.custom-field {
  padding: 12px;
  background: rgba(247, 248, 250, 0.6);
  border-radius: 12px;
}

:deep(.van-field__control) {
  font-size: 14px;
}

.custom-uploader {
  margin-top: 4px;
}

.form-actions {
  margin-top: 12px;
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.2);
}
</style>
