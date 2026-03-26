<template>
  <div class="inspection-order-handle">
    <van-nav-bar
      title="开始巡检"
      left-text="返回"
      left-arrow
      @click-left="$emit('close')"
      fixed
      placeholder
      class="custom-nav-bar"
    />

    <div class="handle-container">
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
            <div class="label">周期类型</div>
            <div class="value">{{ order.cycleType }}</div>
          </div>
        </div>
      </div>

      <!-- 巡检反馈表单 -->
      <div class="section-card">
        <div class="section-header">
          <span class="blue-bar"></span>
          <span class="title">巡检反馈</span>
        </div>
        
        <van-form @submit="onSubmit" class="feedback-form">
          <div class="form-item">
            <div class="form-label required">巡检结果</div>
            <van-radio-group v-model="formData.result" direction="horizontal" class="custom-radio-group">
              <van-radio name="正常">正常</van-radio>
              <van-radio name="异常">异常</van-radio>
            </van-radio-group>
          </div>

          <div class="form-item">
            <div class="form-label required">情况说明</div>
            <van-field
              v-model="formData.explanation"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入巡检过程中的具体情况说明..."
              class="custom-field"
              :rules="[{ required: true, message: '请输入情况说明' }]"
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
              提交巡检
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
  result: '正常',
  explanation: '',
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
.inspection-order-handle {
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

.handle-container {
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
  background: #f7f8fa;
  border-radius: 12px;
}

.custom-radio-group {
  padding: 4px 0;
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
