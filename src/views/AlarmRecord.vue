<template>
  <div class="alarm-record-page">
    <!-- 装饰性背景 -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="page-layout">
      <!-- 1. 固定顶部：导航栏 -->
      <van-nav-bar
        title="告警记录"
        left-arrow
        @click-left="onClickLeft"
        fixed
        placeholder
        :border="false"
        class="custom-nav-bar"
      >
        <template #right>
          <span class="read-all-btn" @click="markAllRead">全部已读</span>
        </template>
      </van-nav-bar>

      <!-- 2. 固定顶部：查询区域 (一个Div包含所有条件) -->
      <div class="query-section">
        <div class="glass-card query-card">
          <!-- 第一行：搜索 -->
          <div class="search-row">
            <van-search
              v-model="searchQuery.deviceName"
              placeholder="请输入设备名称进行搜索"
              background="transparent"
              class="custom-search"
            />
          </div>
          
          <!-- 第二行：紧凑型下拉选择 -->
          <div class="filter-row">
            <van-popover v-model:show="showType" :actions="typeOptions" @select="onTypeSelect" placement="bottom-start" teleport="body">
              <template #reference>
                <div class="web-select-item" :class="{ 'is-active': searchQuery.type }">
                  <span>{{ selectedTypeText || '告警类型' }}</span>
                  <van-icon name="arrow-down" />
                </div>
              </template>
            </van-popover>

            <van-popover v-model:show="showLevel" :actions="levelOptions" @select="onLevelSelect" placement="bottom-start" teleport="body">
              <template #reference>
                <div class="web-select-item" :class="{ 'is-active': searchQuery.level }">
                  <span>{{ selectedLevelText || '告警级别' }}</span>
                  <van-icon name="arrow-down" />
                </div>
              </template>
            </van-popover>

            <van-popover v-model:show="showResult" :actions="resultOptions" @select="onResultSelect" placement="bottom-start" teleport="body">
              <template #reference>
                <div class="web-select-item" :class="{ 'is-active': searchQuery.result }">
                  <span>{{ selectedResultText || '处理结果' }}</span>
                  <van-icon name="arrow-down" />
                </div>
              </template>
            </van-popover>
          </div>
        </div>
      </div>

      <!-- 3. 下方滚动内容 -->
      <div class="scroll-content">
        <div v-for="alarm in filteredAlarms" :key="alarm.id" class="alarm-card glass-card">
          <div class="card-header">
            <span class="alarm-title">{{ alarm.title }}</span>
            <van-tag :type="alarm.severityType" plain class="severity-tag">{{ alarm.severity }}</van-tag>
          </div>

          <div class="card-body">
            <div class="info-item">
              <span class="label">设备名称</span>
              <span class="value semibold">{{ alarm.deviceName }}</span>
            </div>
            <div class="info-item">
              <span class="label">告警设备</span>
              <span class="value">{{ alarm.device }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属项目</span>
              <span class="value">{{ alarm.project }}</span>
            </div>
            <div class="info-item">
              <span class="label">告警内容</span>
              <span class="value">{{ alarm.content }}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="time">{{ alarm.time }}</span>
            <span class="status" :class="alarm.statusType">{{ alarm.status }}</span>
          </div>
        </div>
        
        <div v-if="filteredAlarms.length === 0" class="empty-state">
          <van-empty description="暂无符合条件的告警记录" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showConfirmDialog } from 'vant';

const router = useRouter();
const route = useRoute();

const searchQuery = reactive({
  deviceName: '',
  type: '',
  level: '',
  result: ''
});

const selectedTypeText = ref('');
const selectedLevelText = ref('');
const selectedResultText = ref('');

const showType = ref(false);
const showLevel = ref(false);
const showResult = ref(false);

const typeOptions = [
  { text: '全部类型', value: '' },
  { text: '过压告警', value: '过压告警' },
  { text: '漏电告警', value: '漏电告警' },
  { text: '跳闸告警', value: '跳闸告警' },
  { text: '信号微弱', value: '信号微弱' },
];

const levelOptions = [
  { text: '全部级别', value: '' },
  { text: '严重', value: '严重' },
  { text: '较大', value: '较大' },
  { text: '关注', value: '关注' },
  { text: '一般', value: '一般' },
];

const resultOptions = [
  { text: '全部结果', value: '' },
  { text: '未恢复', value: '未恢复' },
  { text: '已恢复', value: '已恢复' },
  { text: '测试', value: '测试' },
  { text: '误报', value: '误报' },
];

const onTypeSelect = (action) => {
  searchQuery.type = action.value;
  selectedTypeText.value = action.value ? action.text : '';
};

const onLevelSelect = (action) => {
  searchQuery.level = action.value;
  selectedLevelText.value = action.value ? action.text : '';
};

const onResultSelect = (action) => {
  searchQuery.result = action.value;
  selectedResultText.value = action.value ? action.text : '';
};

const alarms = ref([
  { id: 1, title: '过压告警', severity: '严重', severityType: 'danger', deviceName: '1号配电箱总控', device: '测试设备_1 (DEV_1000)', project: '宝安人才公寓', content: '监测值超出安全阈值，请尽快检查', time: '2026-03-12 15:54:14', status: '未恢复', statusType: 'unrecovered' },
  { id: 2, title: '漏电告警', severity: '较大', severityType: 'warning', deviceName: '2楼照明支路', device: '测试设备_2 (DEV_1001)', project: '天河办公楼', content: '监测值超出安全阈值，请尽快检查', time: '2026-03-12 15:54:14', status: '已恢复', statusType: 'recovered' },
  { id: 3, title: '跳闸告警', severity: '关注', severityType: 'primary', deviceName: '地下车库充电桩', device: '测试设备_3 (DEV_1002)', project: '上海嘉定工业园', content: '设备发生异常跳闸，已自动断开', time: '2026-03-13 09:30:22', status: '测试', statusType: 'primary' },
  { id: 4, title: '信号微弱', severity: '一般', severityType: 'success', deviceName: '顶楼5G基站电源', device: '测试设备_4 (DEV_1003)', project: '北京朝阳中心', content: '网关通信信号波动，可能影响数据上传', time: '2026-03-13 10:15:05', status: '误报', statusType: 'gray' }
]);

const filteredAlarms = computed(() => {
  return alarms.value.filter(item => {
    const matchName = item.deviceName.toLowerCase().includes(searchQuery.deviceName.toLowerCase());
    const matchType = !searchQuery.type || item.title === searchQuery.type;
    const matchLevel = !searchQuery.level || item.severity === searchQuery.level;
    const matchResult = !searchQuery.result || item.status === searchQuery.result;
    return matchName && matchType && matchLevel && matchResult;
  });
});

const onClickLeft = () => router.back();

// 全部已读：二次确认后，记录该设备已读，返回首页隐藏告警角标
const markAllRead = () => {
  showConfirmDialog({
    title: '提示',
    message: '确认将该设备的告警全部标记为已读吗？',
  })
    .then(() => {
      const deviceId = route.query.deviceId;
      if (deviceId) {
        const readIds = JSON.parse(localStorage.getItem('readAlarmDeviceIds') || '[]');
        if (!readIds.includes(deviceId)) {
          readIds.push(deviceId);
          localStorage.setItem('readAlarmDeviceIds', JSON.stringify(readIds));
        }
      }
      // 标记已读后停留在当前页面，返回首页时告警角标自动隐藏
    })
    .catch(() => {
      // 取消，停留在当前页面
    });
};
</script>

<style scoped>
.alarm-record-page {
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

.circle-1 { width: 300px; height: 300px; background: rgba(25, 137, 250, 0.15); top: -50px; right: -50px; }
.circle-2 { width: 250px; height: 250px; background: rgba(0, 210, 255, 0.1); top: 300px; left: -50px; }

.page-layout {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.custom-nav-bar {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

:deep(.van-nav-bar__title) { font-weight: bold; }

.read-all-btn {
  font-size: 14px;
  color: #1989fa;
  font-weight: 500;
  cursor: pointer;
}

.query-section {
  padding: 8px 16px 12px;
  flex-shrink: 0;
}

.query-card {
  padding: 12px;
  border-radius: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.search-row {
  margin-bottom: 12px;
}

:deep(.custom-search .van-search__content) {
  background: rgba(247, 248, 250, 0.6) !important;
  border-radius: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  overflow-x: auto;
  justify-content: space-between;
}

.filter-row::-webkit-scrollbar { display: none; }

.web-select-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  font-size: 13px;
  color: #646566;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.web-select-item.is-active {
  background: rgba(25, 137, 250, 0.08);
  border-color: rgba(25, 137, 250, 0.2);
  color: #1989fa;
  font-weight: 500;
}

.web-select-item .van-icon {
  font-size: 12px;
  color: #969799;
  transition: transform 0.3s;
}

.web-select-item.is-active .van-icon {
  color: #1989fa;
}

:deep(.van-popover__content) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

:deep(.van-popover__action) {
  height: 40px;
  font-size: 14px;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 24px;
}

.scroll-content::-webkit-scrollbar { display: none; }

.alarm-card { padding: 16px; margin-bottom: 16px; border-radius: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.alarm-title { font-size: 17px; font-weight: bold; color: #323233; }
.severity-tag { padding: 2px 8px; border-radius: 4px; }
.card-body { background-color: rgba(248, 250, 252, 0.6); border-radius: 12px; padding: 12px; margin-bottom: 16px; }
.info-item { display: flex; margin-bottom: 8px; font-size: 14px; line-height: 1.5; }
.info-item:last-child { margin-bottom: 0; }
.label { color: #969799; width: 70px; flex-shrink: 0; }
.value { color: #323233; }
.value.semibold { font-weight: 600; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px dashed rgba(235, 237, 240, 0.8); }
.time { font-size: 13px; color: #969799; }
.status { font-size: 14px; font-weight: 500; }
.status.unrecovered { color: #ee0a24; }
.status.recovered { color: #07c160; }
.status.primary { color: #1989fa; }
.status.gray { color: #969799; }
.empty-state { padding-top: 40px; }
</style>
