<template>
  <div class="home-page">
    <!-- 装饰性背景 (与登录页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <!-- 顶部区域 -->
      <div class="header-section">
        <div class="top-bar">
          <h1 class="agent-name">测试代理</h1>
          
          <van-popover v-model:show="showProjectPopover" :actions="projects" @select="onSelectProject" placement="bottom">
            <template #reference>
              <div class="project-selector">
                <span>{{ currentProject.text }}</span>
                <van-icon name="arrow-down" />
              </div>
            </template>
          </van-popover>

          <div class="notice-icon">
            <van-icon name="bell" size="24" />
            <div class="badge">3</div>
          </div>
        </div>
        <div class="user-info">
          <p class="address">浙江杭州市余杭区xxxx</p>
          <p class="user-detail">admin 18888888888</p>
        </div>
      </div>

      <!-- 状态卡片 -->
      <div class="status-card-container">
        <div class="status-card glass-card">
          <div class="status-item active">
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
        <div class="custom-tabs">
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
            <van-button block round plain type="primary" class="main-btn">
              <template #icon>
                <van-icon name="apps-o" />
              </template>
              设备主页
            </van-button>
          </div>

          <div class="device-actions">
            <div class="action-item blue">
              <van-icon name="location-o" />
              <span>修改地址</span>
            </div>
            <div class="action-item green">
              <van-icon name="guide-o" />
              <span>导航</span>
            </div>
            <div class="action-item orange">
              <van-icon name="replay" />
              <span>更换设备</span>
            </div>
            <div class="action-item red">
              <van-icon name="delete-o" />
              <span>删除设备</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 演示项目下拉选择
const showProjectPopover = ref(false);
const projects = [
  { text: '演示项目A', value: 'A' },
  { text: '演示项目B', value: 'B' },
  { text: '演示项目C', value: 'C' },
];
const currentProject = ref(projects[0]);

const onSelectProject = (action) => {
  currentProject.value = action;
};

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
  
  // Tab 过滤
  if (activeTab.value === 1) {
    list = list.filter(d => d.isFollowed);
  }
  
  // 搜索过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    list = list.filter(d => 
      d.name.toLowerCase().includes(keyword) || 
      d.id.includes(keyword)
    );
  }
  
  return list;
});
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
}

/* 装饰性背景 */
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

/* 毛玻璃通用类 */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

/* 顶部蓝色背景 */
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

.user-info .address {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 8px;
}

.user-info .user-detail {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

/* 状态卡片 */
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.status-item .label {
  font-size: 12px;
  color: #646566;
}

/* 选项卡 */
.tab-section {
  padding: 24px 16px 0;
}

.custom-tabs {
  background: rgba(235, 237, 240, 0.6);
  backdrop-filter: blur(5px);
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

/* 搜索栏 */
.search-section {
  padding: 16px;
}

.custom-search {
  padding: 0;
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 6px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

/* 设备列表 */
.device-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #969799;
  font-size: 14px;
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
.dot.red { background-color: #ee0a24; box-shadow: 0 0 8px rgba(238, 10, 36, 0.4); }
.dot.green { background-color: #07c160; box-shadow: 0 0 8px rgba(7, 193, 96, 0.4); }
.dot.gray { background-color: #c8c9cc; }

.device-title h3 {
  font-size: 17px;
  margin: 0;
  color: #1a1a1a;
  font-weight: 600;
}

.star-icon {
  cursor: pointer;
  transition: transform 0.2s;
}
.star-icon:active {
  transform: scale(1.2);
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
.info-value.bold { font-weight: bold; font-family: monospace; font-size: 15px; }

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
</style>
