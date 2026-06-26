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
          <div class="status-item" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
            <span class="count blue">{{ allDevices.length }}</span>
            <span class="label">全部</span>
          </div>
          <div class="status-item" :class="{ active: activeFilter === 'online' }" @click="activeFilter = 'online'">
            <span class="count green">{{ allDevices.filter(d => d.onlineStatus === '在线').length }}</span>
            <span class="label">在线</span>
          </div>
          <div class="status-item" :class="{ active: activeFilter === 'alarm' }" @click="activeFilter = 'alarm'">
            <span class="count red">{{ allDevices.filter(d => d.alarm).length }}</span>
            <span class="label">告警</span>
          </div>
          <div class="status-item" :class="{ active: activeFilter === 'offline' }" @click="activeFilter = 'offline'">
            <span class="count gray">{{ allDevices.filter(d => d.onlineStatus === '离线').length }}</span>
            <span class="label">离线</span>
          </div>
          <div class="status-item" :class="{ active: activeFilter === 'favorite' }" @click="activeFilter = 'favorite'">
            <span class="count orange">{{ allDevices.filter(d => d.isFavorite).length }}</span>
            <span class="label">收藏</span>
          </div>
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
        <div
          v-for="device in filteredDevices"
          :key="device.id"
          class="device-card glass-card"
          :class="{ 'is-alarm': device.alarm }"
        >
          <div class="device-header">
            <div class="device-title">
              <!-- <span class="dot" :class="device.statusType"></span> -->
              <h3>{{ device.name }}</h3>
              <span class="product-name">（{{ device.productName }}）</span>
            </div>
            <div class="header-right">
              <div v-if="device.alarm" class="alarm-tag">
                <van-icon name="warning" />
                <span>告警</span>
              </div>
              <van-icon
                class="fav-icon"
                :name="device.isFavorite ? 'star' : 'star-o'"
                :color="device.isFavorite ? '#ff976a' : '#c8c9cc'"
                size="20"
                @click.stop="toggleFavorite(device)"
              />
              <span class="view-more" @click="goToDetail(device)">查看更多</span>
            </div>
          </div>

          <div class="device-body">
            <!-- 产品图片，可预览 -->
            <div class="product-image" @click="previewImage(device)">
              <van-image
                width="76"
                height="76"
                radius="12"
                fit="cover"
                :src="device.image"
              >
                <template #error>
                  <div class="image-fallback">
                    <van-icon name="plug" size="28" color="#1989fa" />
                  </div>
                </template>
              </van-image>
              <span class="preview-hint">
                <van-icon name="eye-o" />
              </span>
            </div>

            <!-- 设备字段 -->
            <div class="device-fields">
              <div class="field-item">
                <span class="field-label">设备状态</span>
                <span class="field-badge" :class="device.onlineStatus === '在线' ? 'online' : 'offline'">
                  {{ device.onlineStatus }}
                </span>
              </div>
              <div v-if="device.deviceType !== '网关'" class="field-item">
                <span class="field-label">开关状态</span>
                <span class="field-badge switch" :class="device.switchStatus === '合闸' ? 'closed' : 'open'">
                  {{ device.switchStatus }}
                </span>
              </div>
              <div class="field-item">
                <span class="field-label">产品名称</span>
                <span class="field-value">{{ device.productAlias }}</span>
              </div>
              <div class="field-item">
                <span class="field-label">设备类型</span>
                <span class="field-value">{{ device.deviceType }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showImagePreview } from 'vant';
import PageHeader from '@/components/PageHeader.vue';

const router = useRouter();

// 搜索
const searchText = ref('');

// 状态筛选：all / online / offline / alarm / favorite
const activeFilter = ref('all');

// 模拟设备数据
const allDevices = ref([
  {
    id: '24033037930080',
    name: '采集器03',
    productName: '1234125202601071003',
    image: 'https://deling-dianli-dev.oss-cn-hangzhou.aliyuncs.com/iot/product-model/a104bossp98/product-image/20260606/%E6%89%8B%E6%9C%BA%E5%8F%B7%E6%97%A0%E6%95%88%E5%8E%9F%E5%9B%A0%E5%8F%8A%E8%A7%A3%E5%86%B3%E5%8A%9E%E6%B3%95%20%283%29_1780717191914.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260618T025010Z&X-Amz-SignedHeaders=host&X-Amz-Credential=LTAI5t8uwzApTbutamCX9DzP%2F20260618%2Fcn-hangzhou%2Fs3%2Faws4_request&X-Amz-Expires=86400&X-Amz-Signature=bab9ba86e744929e95884a651d988edbb2dab3f8bb95a1d64bb7a1e495096011',
    onlineStatus: '在线',
    switchStatus: '合闸',
    deviceType: '网关',
    productAlias: '导轨网关G1',
    alarm: false,
    isFavorite: true,
    statusType: 'green',
  },
  {
    id: '24033037930081',
    name: '重合闸01',
    productName: 'D01234025020260512000001',
    image: 'https://deling-dianli-dev.oss-cn-hangzhou.aliyuncs.com/iot/product-model/a1aB6oqpiGE/product-image/20260529/CBRM3EL%20%E5%89%A9%E4%BD%99%E7%94%B5%E6%B5%81%E4%BF%9D%E6%8A%A4%E6%96%AD%E8%B7%AF%E5%99%A8%28%E8%AE%A1%E9%87%8F%E5%9E%8B%29_1780027776867.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260618T025206Z&X-Amz-SignedHeaders=host&X-Amz-Credential=LTAI5t8uwzApTbutamCX9DzP%2F20260618%2Fcn-hangzhou%2Fs3%2Faws4_request&X-Amz-Expires=86400&X-Amz-Signature=02c5ca89c3d4088f95c8c6680dc9d175e8bf1ddbfe393764c5542fc4fb3e22cb',
    onlineStatus: '离线',
    switchStatus: '开闸',
    deviceType: '网关子设备',
    productAlias: '计量重合闸',
    alarm: false,
    isFavorite: false,
    statusType: 'gray',
  },
  {
    id: '24033037930082',
    name: '微断06',
    productName: 'D01234025020260512000006',
    image: 'https://deling-dianli-dev.oss-cn-hangzhou.aliyuncs.com/iot/product-model/a1f1ZsPcENU/product-image/20260526/8cb55ce402336a30d59b821e23e89cde_1779781941201.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260618T025206Z&X-Amz-SignedHeaders=host&X-Amz-Credential=LTAI5t8uwzApTbutamCX9DzP%2F20260618%2Fcn-hangzhou%2Fs3%2Faws4_request&X-Amz-Expires=86400&X-Amz-Signature=0b2c5571cd92760df3f88120421e7fbea91131715d066f7bc00df774cc161744',
    onlineStatus: '在线',
    switchStatus: '合闸',
    deviceType: '网关子设备',
    productAlias: 'B型L7',
    alarm: true,
    isFavorite: true,
    statusType: 'red',
  },
]);

const filteredDevices = computed(() => {
  let list = allDevices.value;
  if (activeFilter.value === 'online') {
    list = list.filter(d => d.onlineStatus === '在线');
  } else if (activeFilter.value === 'offline') {
    list = list.filter(d => d.onlineStatus === '离线');
  } else if (activeFilter.value === 'alarm') {
    list = list.filter(d => d.alarm);
  } else if (activeFilter.value === 'favorite') {
    list = list.filter(d => d.isFavorite);
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

// 收藏切换
const toggleFavorite = (device) => {
  device.isFavorite = !device.isFavorite;
};

// 产品图片预览
const previewImage = (device) => {
  showImagePreview([device.image]);
};

// 设备主页：网关跳转网关详情，网关子设备跳转设备详情
const goToDetail = (device) => {
  if (device.deviceType === '网关') {
    router.push({ name: 'GatewayDetail' });
  } else {
    router.push({ name: 'DeviceDetail' });
  }
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

.status-card-container {
  margin-top: -60px;
  padding: 0 16px;
}

.status-card {
  border-radius: 20px;
  display: flex;
  padding: 15px 0;
}

.status-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.status-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  width: 20px;
  height: 3px;
  border-radius: 2px;
  background: #1989fa;
}

.status-item.active .label {
  color: #1989fa;
  font-weight: 600;
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

.empty-state {
  text-align: center;
  color: #969799;
  font-size: 14px;
  padding: 40px 0;
}

.device-card {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
}

/* 告警设备突出展示 */
.device-card.is-alarm {
  border: 1px solid rgba(238, 10, 36, 0.45);
  box-shadow: 0 10px 25px rgba(238, 10, 36, 0.15);
  background: linear-gradient(180deg, rgba(255, 241, 240, 0.95) 0%, rgba(255, 255, 255, 0.9) 60%);
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
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.view-more {
  font-size: 13px;
  color: #1989fa;
  cursor: pointer;
  white-space: nowrap;
}

.fav-icon {
  cursor: pointer;
}

.device-title .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
}
/* .dot.red { background-color: #ee0a24; }
.dot.green { background-color: #07c160; }
.dot.gray { background-color: #c8c9cc; } */

.device-title h3 {
  font-size: 17px;
  margin: 0;
  color: #1a1a1a;
  font-weight: 600;
}

.device-title .product-name {
  font-size: 13px;
  color: #969799;
  margin-left: 2px;
}

.alarm-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ee0a24;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(238, 10, 36, 0.3);
}

.device-body {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.product-image {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.product-image .preview-hint {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.image-fallback {
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(25, 137, 250, 0.06);
  border-radius: 12px;
}

.device-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 13px;
  color: #969799;
}

.field-value {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

.field-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 12px;
}

.field-badge.online {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.field-badge.offline {
  color: #969799;
  background: rgba(150, 151, 153, 0.12);
}

.field-badge.closed {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.field-badge.open {
  color: #ff976a;
  background: rgba(255, 151, 106, 0.12);
}

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

.count.blue { color: #1989fa; }
.count.green { color: #07c160; }
.count.red { color: #ee0a24; }
.count.gray { color: #969799; }
.count.orange { color: #ff976a; }
</style>
