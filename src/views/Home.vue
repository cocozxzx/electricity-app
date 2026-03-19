<template>
  <div class="home-page">
    <!-- 装饰性背景 (与登录页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <PageHeader />

      <!-- 状态卡片 -->
      <div class="status-card-container">
        <div class="status-card glass-card">
          <div class="status-item">
            <span class="count blue">{{ allDevices.length }}</span>
            <span class="label">全部</span>
          </div>
          <div class="status-item">
            <span class="count green">{{ allDevices.filter(d => d.status === '合闸').length }}</span>
            <span class="label">在线</span>
          </div>
          <div class="status-item">
            <span class="count red">0</span>
            <span class="label">告警</span>
          </div>
          <div class="status-item">
            <span class="count gray">{{ allDevices.filter(d => d.status === '离线').length }}</span>
            <span class="label">离线</span>
          </div>
        </div>
      </div>

      <!-- 选项卡 -->
      <div class="tab-section">
        <div class="custom-tabs glass-card no-blur">
          <div class="tab-item" :class="{ active: activeTab === 0 }" @click="activeTab = 0">全部设备</div>
          <div class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">我关注的</div>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-section">
        <van-search
          v-model="searchText"
          placeholder="搜索设备名称或ID"
          background="transparent"
          class="custom-search"
        />
      </div>

      <!-- 设备列表 -->
      <div class="device-list">
        <div v-if="filteredDevices.length === 0" class="empty-state">
          无匹配设备
        </div>
        <div v-for="device in filteredDevices" :key="device.id" class="device-card glass-card">
          <div class="device-header">
            <div class="device-title">
              <span class="dot" :class="device.statusType"></span>
              <h3>{{ device.name }}</h3>
            </div>
            <van-icon 
              :name="device.isFollowed ? 'star' : 'star-o'" 
              size="22" 
              :color="device.isFollowed ? '#ff976a' : '#c8c9cc'" 
              @click="toggleFollow(device)"
              class="star-icon"
            />
          </div>
          
          <div class="device-info-grid">
            <div class="info-item">
              <span class="info-label">设备状态</span>
              <span class="info-value" :class="device.statusType">{{ device.status }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">设备ID</span>
              <span class="info-value bold">{{ device.id }}</span>
            </div>
            <div class="info-item full">
              <span class="info-label">安装地址</span>
              <span class="info-value">{{ device.address }}</span>
            </div>
          </div>

          <div class="device-main-btn">
            <van-button block round plain type="primary" class="main-btn" @click="goToDetail(device)">
              <template #icon>
                <van-icon name="apps-o" />
              </template>
              设备主页
            </van-button>
          </div>

          <div class="device-actions">
            <div class="action-item blue" @click="showModifyAddress(device)">
              <van-icon name="location-o" />
              <span>修改地址</span>
            </div>
            <div class="action-item green" @click="showNavigation">
              <van-icon name="guide-o" />
              <span>导航</span>
            </div>
            <div class="action-item orange" @click="goToReplace(device)">
              <van-icon name="replay" />
              <span>更换设备</span>
            </div>
            <div class="action-item red" @click="showDeleteConfirm(device)">
              <van-icon name="delete-o" />
              <span>删除设备</span>
            </div>
          </div>
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
          <van-button class="cancel-btn" @click="addressDialog.show = false" round>再想想</van-button>
          <van-button class="confirm-btn" type="primary" @click="confirmAddress" round>确认修改</van-button>
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
        <h3 class="delete-title">确认删除设备?</h3>
        <!-- <p class="ios-dialog-desc">删除后该设备的历史数据将无法查看，此操作不可撤销。</p> -->
        <div class="delete-actions-group">
          <van-button class="cancel-btn" @click="deleteDialog.show = false" round>再想想</van-button>
          <van-button class="confirm-btn" type="danger" @click="confirmDelete" round>确认删除</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import PageHeader from '@/components/PageHeader.vue';

const router = useRouter();

// 搜索与Tab
const searchText = ref('');
const activeTab = ref(0); // 0: 全部, 1: 我关注的

// 模拟设备数据
const allDevices = ref([
  { id: '24033037930080', name: '配电箱A区', status: '合闸', statusType: 'green', address: '杭州市余杭区xx科技园', isFollowed: false },
  { id: '24033037930081', name: '一楼照明总控', status: '离线', statusType: 'gray', address: '杭州市西湖区xx中心', isFollowed: true },
  { id: '24033037930082', name: '空调温控设备', status: '分闸', statusType: 'red', address: '杭州市上城区xx大楼', isFollowed: false },
]);

const toggleFollow = (device) => {
  device.isFollowed = !device.isFollowed;
};

const filteredDevices = computed(() => {
  let list = allDevices.value;
  if (activeTab.value === 1) {
    list = list.filter(d => d.isFollowed);
  }
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    list = list.filter(d => 
      d.name.toLowerCase().includes(keyword) || 
      d.id.includes(keyword)
    );
  }
  return list;
});

// --- 交互逻辑 ---

// 1. 修改地址
const addressDialog = reactive({
  show: false,
  value: '',
  device: null
});
const showModifyAddress = (device) => {
  addressDialog.device = device;
  addressDialog.value = device.address;
  addressDialog.show = true;
};
const confirmAddress = () => {
  if (!addressDialog.value.trim()) {
    showToast('请输入详细安装地址');
    return;
  }
  if (addressDialog.device) {
    addressDialog.device.address = addressDialog.value;
    addressDialog.show = false;
    showSuccessToast('修改成功');
  }
};

// 2. 导航
const showNavSheet = ref(false);
const navActions = [
  { name: '高德地图' },
  { name: '百度地图' },
  { name: '腾讯地图' },
  { name: '苹果地图' }
];
const showNavigation = () => {
  showNavSheet.value = true;
};
const onNavSelect = (item) => {
  showToast(`正在跳转至 ${item.name}`);
};

// 3. 更换设备
const goToReplace = (device) => {
  router.push({ name: 'ReplaceDevice' });
};

// 4. 删除设备
const deleteDialog = reactive({
  show: false,
  device: null
});
const showDeleteConfirm = (device) => {
  deleteDialog.device = device;
  deleteDialog.show = true;
};
const confirmDelete = () => {
  allDevices.value = allDevices.value.filter(d => d.id !== deleteDialog.device.id);
  deleteDialog.show = false;
  showSuccessToast('删除成功');
};

// 5. 设备主页
const goToDetail = (device) => {
  router.push({ name: 'DeviceDetail' });
};
</script>

<style scoped>
.home-page {
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
  padding-bottom: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.no-blur {
  backdrop-filter: none;
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

.project-selector {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  margin-left: 100px;
}

.project-selector .van-icon {
  margin-left: 6px;
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

.status-card-container {
  margin-top: -40px;
  padding: 0 16px;
}

.status-card {
  border-radius: 20px;
  display: flex;
  padding: 24px 0;
}

.status-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-item.active {
  position: relative;
}

.status-item.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  width: 24px;
  height: 4px;
  background-color: #1989fa;
  border-radius: 2px;
}

.status-item .count {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 6px;
}

.status-item .label {
  font-size: 12px;
  color: #646566;
}

.tab-section {
  padding: 24px 16px 0;
}

.custom-tabs {
  background: rgba(235, 237, 240, 0.6);
  border-radius: 24px;
  display: flex;
  padding: 4px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  border-radius: 20px;
  color: #646566;
  transition: all 0.3s;
  cursor: pointer;
}

.tab-item.active {
  background: white;
  color: #1989fa;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-section {
  padding: 16px;
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 6px 12px;
}

.device-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.device-card {
  border-radius: 20px;
  overflow: hidden;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(242, 243, 245, 0.6);
}

.device-title {
  display: flex;
  align-items: center;
}

.device-title .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
}
.dot.red { background-color: #ee0a24; }
.dot.green { background-color: #07c160; }
.dot.gray { background-color: #c8c9cc; }

.device-title h3 {
  font-size: 17px;
  margin: 0;
  color: #1a1a1a;
  font-weight: 600;
}

.device-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 16px;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full {
  grid-column: span 2;
}

.info-label {
  font-size: 12px;
  color: #969799;
  margin-bottom: 6px;
}

.info-value {
  font-size: 14px;
  color: #323233;
}

.info-value.red { color: #ee0a24; font-weight: 600; }
.info-value.green { color: #07c160; font-weight: 600; }
.info-value.gray { color: #969799; font-weight: 600; }

.device-main-btn {
  padding: 0 16px 16px;
}

.main-btn {
  background: rgba(25, 137, 250, 0.08);
  border: 1px solid rgba(25, 137, 250, 0.2);
  color: #1989fa;
  font-weight: 500;
  height: 44px;
}

.device-actions {
  display: flex;
  background: rgba(247, 248, 250, 0.5);
  border-top: 1px solid rgba(242, 243, 245, 0.6);
}

.action-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  font-size: 12px;
  border-right: 1px solid rgba(242, 243, 245, 0.6);
  cursor: pointer;
}

.action-item:last-child {
  border-right: none;
}

.action-item .van-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.action-item.blue { color: #1989fa; }
.action-item.green { color: #07c160; }
.action-item.orange { color: #ff976a; }
.action-item.red { color: #ee0a24; }

.count.blue { color: #1989fa; }
.count.green { color: #07c160; }
.count.red { color: #ee0a24; }
.count.gray { color: #969799; }

/* 局部样式 */
.dialog-content {
  padding: 24px 16px;
}

.dialog-input {
  background-color: transparent !important;
  border-radius: 12px;
  border: 1px solid #ebedf0;
}

.dialog-content-inner {
  margin: 20px 0;
}

.delete-dialog-content {
  padding: 32px 24px;
  text-align: center;
}

.warning-icon {
  margin-bottom: 16px;
}

.delete-title {
  font-size: 20px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
}

.delete-desc {
  font-size: 14px;
  color: #969799;
  line-height: 1.6;
  margin-bottom: 24px;
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

<!-- 全局样式：系统渐变风格 -->
<style>
.glass-dialog.van-dialog {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden;
}

.glass-sheet.van-action-sheet {
  background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px 24px 0 0 !important;
}
</style>
