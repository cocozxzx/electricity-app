<template>
  <div class="operation-page">
    <!-- 装饰性背景 (与Home页保持一致) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content-wrapper">
      <PageHeader />
      
      <div class="content">
        <!-- 选项卡 (完全同步首页结构与交互) -->
        <div class="tab-section">
          <div class="custom-tabs glass-card no-blur">
            <div class="tab-item" :class="{ active: activeTab === 0 }" @click="activeTab = 0">维修工单</div>
            <div class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">我的巡检</div>
          </div>
        </div>

        <!-- 最近待办任务标题栏 -->
        <div class="section-header">
          <div class="header-left">
            <span class="blue-bar"></span>
            <span class="section-title">最近待办任务</span>
          </div>
          <div class="header-right" @click="handleViewAll">
            <span class="view-all">查看全部</span>
            <van-icon name="arrow" />
          </div>
        </div>

        <!-- 工单/巡检列表 -->
        <div class="order-list">
          <div v-if="filteredOrders.length === 0" class="empty-state">
            暂无处理中的任务
          </div>
          
          <!-- 维修工单卡片 -->
          <template v-if="activeTab === 0">
            <div v-for="order in filteredOrders" :key="order.id" class="glass-card order-card repair-card">
              <div class="card-header">
                <div class="header-main">
                  <h3 class="device-name">{{ order.deviceName }}</h3>
                  <span class="order-id-tag">{{ order.id }}</span>
                </div>
                <div class="status-processing-tag">处理中</div>
              </div>
              
              <div class="card-body-grid">
                <div class="info-row">
                  <div class="info-col">
                    <span class="info-label">故障类型</span>
                    <span class="info-value">{{ order.faultType }}</span>
                  </div>
                  <div class="info-col">
                    <span class="info-label">紧急程度</span>
                    <span class="info-value urgency-text" :class="order.urgency">{{ order.urgency }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-col">
                    <span class="info-label">所属项目</span>
                    <span class="info-value">{{ order.projectName }}</span>
                  </div>
                  <div class="info-col">
                    <span class="info-label">创建时间</span>
                    <span class="info-value time-value">{{ order.createTime.split(' ')[0] }}</span>
                  </div>
                </div>
              </div>

              <div class="card-footer-actions">
                <van-button 
                  type="primary"
                  size="small"
                  class="footer-btn"
                  round
                  @click="handleGoProcess(order)"
                >
                  前往处理
                </van-button>
              </div>
            </div>
          </template>

          <!-- 巡检任务卡片 -->
          <template v-else>
            <div v-for="order in filteredOrders" :key="order.id" class="glass-card order-card inspection-card">
              <div class="card-header">
                <div class="header-main">
                  <h3 class="device-name">{{ order.planName }}</h3>
                  <span class="order-id-tag">{{ order.id }}</span>
                </div>
                <div class="status-processing-tag">进行中</div>
              </div>
              
              <div class="card-body-grid">
                <div class="info-row">
                  <div class="info-col">
                    <span class="info-label">巡检周期</span>
                    <span class="info-value cycle-display">
                      {{ order.cycleType }}
                      <span v-if="order.cycleDetail" class="cycle-detail">{{ order.cycleDetail }}</span>
                    </span>
                  </div>
                  <div class="info-col">
                    <span class="info-label">巡检人</span>
                    <span class="info-value">{{ order.inspector }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-col full-width">
                    <span class="info-label">所属项目</span>
                    <span class="info-value">{{ order.projectName }}</span>
                  </div>
                </div>
              </div>

              <div class="card-footer-actions">
                <van-button 
                  type="default"
                  size="small"
                  class="footer-btn"
                  round
                  @click="handleInspectionDetail(order)"
                >
                  详情
                </van-button>
                <van-button 
                  type="primary"
                  size="small"
                  class="footer-btn"
                  round
                  @click="handleGoProcessInspection(order)"
                >
                  开始巡检
                </van-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 维修工单详情页 -->
    <WorkOrderDetail 
      v-if="showDetail" 
      :order="currentDetail" 
      @close="showDetail = false" 
    />

    <!-- 维修工单处理 -->
    <WorkOrderHandle
      v-if="showHandle"
      :order="currentDetail"
      @close="showHandle = false"
      @submit="handleOrderSubmitted"
    />

    <!-- 全部维修工单 -->
    <RepairOrderAll
      v-if="showAllRepair"
      :orders="repairOrders"
      @close="showAllRepair = false"
      @view-detail="handleDetailFromAll"
      @handle-order="handleGoProcessFromAll"
    />

    <!-- 全部巡检任务 -->
    <InspectionOrderAll
      v-if="showAllInspection"
      :orders="inspectionTasks"
      @close="showAllInspection = false"
      @view-detail="handleInspectionDetail"
      @handle-order="handleGoProcessInspection"
    />

    <!-- 巡检详情页 -->
    <InspectionOrderDetail
      v-if="showInspectionDetail"
      :order="currentInspectionDetail"
      @close="showInspectionDetail = false"
    />

    <!-- 开始巡检页面 -->
    <InspectionOrderHandle
      v-if="showInspectionHandle"
      :order="currentInspectionDetail"
      @close="showInspectionHandle = false"
      @submit="handleInspectionSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import WorkOrderDetail from '@/components/WorkOrderDetail.vue';
import WorkOrderHandle from '@/components/WorkOrderHandle.vue';
import RepairOrderAll from '@/components/RepairOrderAll.vue';
import InspectionOrderAll from '@/components/InspectionOrderAll.vue';
import InspectionOrderDetail from '@/components/InspectionOrderDetail.vue';
import InspectionOrderHandle from '@/components/InspectionOrderHandle.vue';

const activeTab = ref(0); // 0: 维修工单, 1: 我的巡检

// 状态控制
const showDetail = ref(false);
const showHandle = ref(false);
const showAllRepair = ref(false);
const showAllInspection = ref(false);
const showInspectionDetail = ref(false);
const showInspectionHandle = ref(false);

const currentDetail = ref(null);
const currentInspectionDetail = ref(null);

const repairOrders = ref([
  {
    id: 'WO_20260312_001',
    deviceName: '测试设备_1',
    projectName: '宝安人才公寓',
    faultType: '过压告警',
    urgency: '紧急',
    createTime: '2026-03-12 09:00:00',
    status: '处理中',
    statusType: 'primary'
  },
  {
    id: 'WO_20260312_002',
    deviceName: '电梯动力控制柜',
    projectName: '演示项目A',
    faultType: '缺相运行',
    urgency: '紧急',
    createTime: '2026-03-12 10:15:30',
    status: '待审核',
    statusType: 'warning',
    handler: '李工'
  },
  {
    id: 'WO_20260312_003',
    deviceName: '3楼走廊照明',
    projectName: '宝安人才公寓',
    faultType: '灯具损坏',
    urgency: '一般',
    createTime: '2026-03-12 11:30:00',
    status: '已完成',
    statusType: 'success',
    handler: '王工'
  },
  {
    id: 'WO_20260312_004',
    deviceName: '水泵控制器',
    projectName: '宝安人才公寓',
    faultType: '压力异常',
    urgency: '一般',
    createTime: '2026-03-12 12:00:00',
    status: '处理中',
    statusType: 'primary'
  }
]);

const inspectionTasks = ref([
  {
    id: 'REC_20260313_001',
    planName: '每日例行巡查',
    cycleType: '每日',
    cycleDetail: '',
    projectName: '宝安人才公寓',
    inspector: '张工',
    time: '2026-03-13 10:30:00',
    status: '处理中',
    statusType: 'primary'
  },
  {
    id: 'REC_20260313_002',
    planName: '季度设备性能测试',
    cycleType: '每周',
    cycleDetail: '执行日：周一、周三',
    projectName: '天河办公楼',
    inspector: '李工',
    time: '2026-03-13 10:30:00',
    status: '处理中',
    statusType: 'primary'
  },
  {
    id: 'REC_20260313_006',
    planName: '月度用电安全检查',
    cycleType: '每月',
    cycleDetail: '执行日：1号、15号',
    projectName: '宝安人才公寓',
    inspector: '王工',
    time: '2026-03-11 10:30:00',
    status: '已完成',
    statusType: 'success'
  }
]);

const filteredOrders = computed(() => {
  const list = activeTab.value === 0 ? repairOrders.value : inspectionTasks.value;
  return list.filter(order => order.status === '处理中' || order.status === '进行中');
});

const handleViewAll = () => {
  if (activeTab.value === 0) {
    showAllRepair.value = true;
  } else {
    showAllInspection.value = true;
  }
};

// 维修逻辑
const handleDetail = (order) => {
  currentDetail.value = order;
  showDetail.value = true;
};

const handleDetailFromAll = (order) => {
  currentDetail.value = order;
  showDetail.value = true;
};

const handleGoProcess = (order) => {
  currentDetail.value = order;
  showHandle.value = true;
};

const handleGoProcessFromAll = (order) => {
  currentDetail.value = order;
  showHandle.value = true;
};

const handleOrderSubmitted = (data) => {
  console.log('工单已提交:', data);
};

// 巡检逻辑
const handleInspectionDetail = (order) => {
  currentInspectionDetail.value = order;
  showInspectionDetail.value = true;
};

const handleGoProcessInspection = (order) => {
  currentInspectionDetail.value = order;
  showInspectionHandle.value = true;
};

const handleInspectionSubmitted = (data) => {
  console.log('巡检已提交:', data);
};
</script>

<style scoped>
.operation-page {
  position: relative;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow-x: hidden;
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

/* 选项卡样式 - 严格同步首页 CSS */
.tab-section {
  padding: 24px 16px 0;
}

.custom-tabs {
  background: rgba(235, 237, 240, 0.6) !important;
  border-radius: 24px;
  display: flex;
  padding: 4px;
  border: none !important;
  box-shadow: none !important;
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

/* 最近待办任务标题栏 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 16px;
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
}

.blue-bar {
  width: 4px;
  height: 16px;
  background-color: #1989fa;
  border-radius: 2px;
  margin-right: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.header-right {
  display: flex;
  align-items: center;
  color: #969799;
  font-size: 14px;
  cursor: pointer;
}

.view-all {
  margin-right: 2px;
}

/* 列表样式 */
.order-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border-radius: 20px;
  overflow: hidden;
  padding: 16px;
}

/* 维修工单优化样式 */
.repair-card .card-header, .inspection-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-name {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.order-id-tag {
  font-size: 12px;
  color: #969799;
  font-family: monospace;
}

/* “处理中”状态特殊样式 */
.status-processing-tag {
  background: rgba(25, 137, 250, 0.1);
  color: #1989fa;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-body-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 12px;
}

.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-col.full-width {
  flex: 2;
}

.info-label {
  font-size: 12px;
  color: #969799;
}

.info-value {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

/* 周期详情样式 */
.cycle-display {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cycle-detail {
  font-size: 12px;
  color: #646566;
  font-weight: 400;
}

.urgency-text.紧急 { color: #ee0a24; }
.urgency-text.一般 { color: #1989fa; }

.time-value {
  color: #646566;
  font-size: 13px;
}

.card-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(242, 243, 245, 0.8);
}

.footer-btn {
  min-width: 84px;
  height: 34px;
  font-weight: 500;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #969799;
}
</style>
