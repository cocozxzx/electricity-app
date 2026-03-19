<template>
  <!-- 使用 @touchmove.prevent 彻底拦截触摸滚动 -->
  <div class="profile-page" @touchmove.prevent>
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <PageHeader />

      <!-- 功能列表 -->
      <div class="menu-section">
        <div class="menu-list glass-card">
          <van-cell title="个人信息" is-link icon="user-o" @click="showUserInfo = true" />
          <van-cell title="项目详情" is-link icon="hotel-o" @click="showProjectDetail = true" />
          <van-cell title="操作记录" is-link icon="records-o" @click="showOperationRecords = true" />
        </div>

        <!-- 退出按钮 -->
        <div class="logout-wrapper">
          <van-button block round class="logout-btn" @click="handleLogout">
            退出登录
          </van-button>
        </div>
      </div>
    </div>

    <!-- 个人信息弹窗 -->
    <van-popup v-model:show="showUserInfo" position="right" :style="{ width: '100%', height: '100%' }" :lock-scroll="true">
      <div class="sub-page" @touchmove.prevent>
        <div class="home-background">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
        <van-nav-bar title="个人信息" left-arrow @click-left="showUserInfo = false" fixed placeholder />
        <div class="sub-content">
          <van-form @submit="saveInfo">
            <div class="info-group glass-card">
              <van-field
                v-model="userForm.name"
                label="姓名"
                placeholder="请输入姓名"
                required
                :rules="[{ required: true, message: '请输入姓名' }]"
              />
              <van-field
                v-model="userForm.account"
                label="登录账号"
                placeholder="请输入登录账号"
                required
                :rules="[{ required: true, message: '请输入登录账号' }]"
              />
              <van-field
                v-model="userForm.password"
                label="登录密码"
                type="password"
                placeholder="请输入登录密码"
                required
                :rules="[{ required: true, message: '请输入登录密码' }]"
              />
              <van-field
                v-model="userForm.phone"
                label="联系电话"
                placeholder="请输入联系电话"
                required
                :rules="[{ required: true, message: '请输入联系电话' }]"
              />
            </div>
            <div class="action-bar">
              <van-button block round type="primary" native-type="submit">保存修改</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>

    <!-- 项目详情弹窗 -->
    <van-popup v-model:show="showProjectDetail" position="right" :style="{ width: '100%', height: '100%' }" :lock-scroll="true">
      <div class="sub-page" @touchmove.prevent>
        <div class="home-background">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
        <van-nav-bar title="项目详情" left-arrow @click-left="showProjectDetail = false" fixed placeholder />
        <div class="sub-content">
          <div class="search-box">
            <van-search placeholder="按项目名称查询" background="transparent" />
          </div>
          <div class="project-list">
            <div v-for="p in projects_detail" :key="p.name" class="project-card glass-card">
              <h3 class="p-name">{{ p.name }}</h3>
              <div class="p-info-row">
                <span class="p-label">项目地址</span>
                <span class="p-value">{{ p.address }}</span>
              </div>
              <div class="p-info-row">
                <span class="p-label">所属代理商</span>
                <span class="p-value">{{ p.agent }}</span>
              </div>
              <div class="p-info-row">
                <span class="p-label">网关数</span>
                <span class="p-value">{{ p.gateways }}</span>
              </div>
              <div class="p-info-row">
                <span class="p-label">子设备数</span>
                <span class="p-value">{{ p.devices }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 操作记录弹窗 -->
    <van-popup v-model:show="showOperationRecords" position="right" :style="{ width: '100%', height: '100%' }" :lock-scroll="true">
      <div class="sub-page" @touchmove.prevent>
        <div class="home-background">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
        <van-nav-bar title="操作记录" left-arrow @click-left="showOperationRecords = false" fixed placeholder />
        <div class="sub-content">
          <div class="filter-bar">
            <van-field placeholder="设备名称" class="mini-input" />
            
            <div class="select-wrapper">
              <select v-model="filterCmd" class="custom-select">
                <option value="">全部指令</option>
                <option value="分闸">分闸</option>
                <option value="合闸">合闸</option>
              </select>
              <van-icon name="arrow-down" class="select-arrow" />
            </div>

            <div class="select-wrapper">
              <select v-model="filterResult" class="custom-select">
                <option value="">全部结果</option>
                <option value="成功">成功</option>
                <option value="失败">失败</option>
                <option value="超时">超时</option>
              </select>
              <van-icon name="arrow-down" class="select-arrow" />
            </div>
          </div>
          <div class="record-list">
            <div v-for="(r, i) in operationRecords" :key="i" class="record-card glass-card">
              <div class="r-row">
                <span class="r-label">设备名称</span>
                <span class="r-value">{{ r.device }}</span>
              </div>
              <div class="r-row">
                <span class="r-label">指令名称</span>
                <span class="r-value">{{ r.cmd }}</span>
              </div>
              <div class="r-row">
                <span class="r-label">执行结果</span>
                <span :class="['r-value', r.statusType]">{{ r.status }}</span>
              </div>
              <div class="r-row">
                <span class="r-label">执行人</span>
                <span class="r-value">{{ r.user }}</span>
              </div>
              <div class="r-row">
                <span class="r-label">执行时间</span>
                <span class="r-value">{{ r.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog, showToast, showSuccessToast } from 'vant';
import PageHeader from '@/components/PageHeader.vue';

const router = useRouter();

// 弹窗控制
const showUserInfo = ref(false);
const showProjectDetail = ref(false);
const showOperationRecords = ref(false);

const userForm = reactive({
  name: '张工',
  account: 'admin',
  password: '••••••',
  phone: '18888888888'
});

const filterCmd = ref('');
const filterResult = ref('');

const projects_detail = [
  { name: '演示项目A', address: '浙江杭州余杭区xx路', agent: '测试代理商A', gateways: 12, devices: 186 },
  { name: '演示项目B', address: '浙江宁波鄞州区xx园区', agent: '测试代理商B', gateways: 8, devices: 94 },
  { name: '奥体中心电力监控系统', address: '浙江杭州滨江区xx大道', agent: '测试代理商C', gateways: 21, devices: 322 },
];

const operationRecords = [
  { device: '1号变压器', cmd: '分闸', status: '成功', statusType: 'green', user: 'admin', time: '2026-03-06 09:12:33' },
  { device: '进线柜', cmd: '合闸', status: '失败', statusType: 'red', user: 'operator01', time: '2026-03-05 18:26:07' },
  { device: '2号变压器', cmd: '分闸', status: '超时', statusType: 'orange', user: 'operator02', time: '2026-03-05 11:41:59' },
];

const saveInfo = () => {
  showSuccessToast({
    message: '修改成功',
    onClose: () => {
      showUserInfo.value = false;
    }
  });
};

const handleLogout = () => {
  showConfirmDialog({
    title: '退出确认',
    message: '确定要退出当前账号吗？',
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    className: 'glass-dialog'
  }).then(() => {
    showToast('已退出登录');
    router.push('/login');
  }).catch(() => {});
};
</script>

<style scoped>
.profile-page {
  /* 严禁主页面有任何维度的滚动和溢出 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden !important;
  touch-action: none;
  z-index: 1;
  box-sizing: border-box;
}

/* 隐藏所有可能的滚动条 */
.profile-page::-webkit-scrollbar,
.sub-page::-webkit-scrollbar,
.sub-content::-webkit-scrollbar {
  display: none !important;
}

.home-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden; /* 确保圆圈不超出背景容器 */
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
  width: 100%;
  height: 100%;
  overflow: hidden !important;
  box-sizing: border-box;
}

.header-section {
  background: linear-gradient(135deg, rgba(45, 114, 241, 0.95) 0%, rgba(62, 129, 245, 0.85) 100%);
  backdrop-filter: blur(10px);
  padding: 24px 20px 60px;
  color: white;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 4px 20px rgba(45, 114, 241, 0.2);
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.agent-name {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.notice-icon {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px;
  border-radius: 50%;
  backdrop-filter: blur(5px);
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ee0a24;
  color: white;
  font-size: 10px;
  padding: 0 4px;
  border-radius: 10px;
  min-width: 14px;
  text-align: center;
  border: 1px solid white;
}

.user-info {
  margin-top: 0px;
}

.address {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.user-detail {
  font-size: 14px;
  opacity: 0.8;
}

.menu-section {
  margin-top: -30px;
  padding: 0 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  margin-bottom: 40px;
}

:deep(.van-cell) {
  padding: 20px 16px;
  background-color: transparent;
}

:deep(.van-cell__title) {
  font-size: 16px;
  margin-left: 8px;
}

:deep(.van-cell__left-icon) {
  font-size: 20px;
  color: #1989fa;
}

.logout-wrapper {
  padding: 0 20px;
}

.logout-btn {
  height: 50px;
  font-size: 16px;
  font-weight: bold;
  color: #ee0a24;
  background: white;
  border: 1px solid #ebedf0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 子页面定位：锁死在屏幕，严禁水平滚动 */
.sub-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  touch-action: none;
  box-sizing: border-box;
}

.sub-content {
  flex: 1;
  width: 100%;
  overflow: hidden !important;
  padding: 16px;
  box-sizing: border-box;
}

/* 个人信息 */
.info-group {
  padding: 8px 16px;
}

.field-item {
  padding: 16px 0;
  border-bottom: 1px solid #f2f3f5;
}

.field-item:last-child {
  border-bottom: none;
}

.field-label {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
}

.field-value {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
}

.action-bar {
  margin-top: 40px;
  padding: 0 16px;
}

/* 项目详情 */
.search-box {
  margin-bottom: 16px;
  width: 100%;
}

:deep(.search-box .van-search__content) {
  background: white !important;
  border-radius: 12px;
  border: 1px solid #ebedf0;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  overflow: hidden !important;
}

.project-card {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.p-name {
  font-size: 18px;
  margin: 0 0 16px;
  color: #1a1a1a;
}

.p-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.p-label {
  color: #969799;
}

.p-value {
  color: #323233;
  font-weight: 500;
}

/* 操作记录 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
}

.mini-input {
  flex: 1.2;
  background: white !important;
  border-radius: 8px;
  padding: 0 8px;
  height: 36px;
  display: flex;
  align-items: center;
  border: 1px solid #ebedf0;
  overflow: hidden;
}

:deep(.mini-input .van-field__control) {
  font-size: 12px;
}

.select-wrapper {
  position: relative;
  flex: 1;
  height: 36px;
}

.custom-select {
  width: 100%;
  height: 36px;
  padding: 0 20px 0 6px;
  border: 1px solid #ebedf0;
  background: white;
  border-radius: 8px;
  font-size: 12px;
  color: #323233;
  appearance: none;
  -webkit-appearance: none;
}

.select-arrow {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #969799;
  font-size: 12px;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  overflow: hidden !important;
}

.record-card {
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
}

.r-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.r-row:last-child {
  margin-bottom: 0;
}

.r-label {
  color: #969799;
}

.r-value {
  color: #323233;
  font-weight: 500;
}

.r-value.green { color: #07c160; }
.r-value.red { color: #ee0a24; }
.r-value.orange { color: #ff976a; }
</style>
