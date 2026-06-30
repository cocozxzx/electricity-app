<template>
  <div class="device-detail-page">
    <!-- 装饰性背景 (彻底置底 z-index: -999) -->
    <div class="home-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 顶部导航栏：显式固定并绝对置顶 -->
    <van-nav-bar
      title="设备详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      class="glass-nav"
    />

    <div class="content">
      <!-- 基础信息 -->
      <div class="base-info-section">
        <!-- <div class="section-title">基础信息</div> -->
        <div class="info-card glass-card">
          <div class="device-image-wrapper">
            <div class="image-box">
              <van-icon name="plug" size="48" color="#1989fa" />
              <p class="image-tip">(设备图片)</p>
            </div>
          </div>
          
          <div class="info-list">
            <div class="info-row">
              <span class="label">设备编码</span>
              <span class="value">D01234025020260512000007</span>
            </div>
            <div class="info-row">
              <span class="label">设备名称</span>
              <span class="value">重合闸01</span>
            </div>
            <div class="info-row">
              <span class="label">所属网关</span>
              <a class="value link" @click="goToGateway">采集器03</a>
            </div>
            <div class="info-row">
              <span class="label">安装人员</span>
              <span class="value mono">张三（18788888888）</span>
            </div>
            <div class="info-row">
              <span class="label">产品名称</span>
              <span class="value">计量重合闸</span>
            </div>
            <div class="info-row">
              <span class="label">安装位置</span>
              <span class="value">{{ deviceAddress }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备操作 -->
      <!-- <div class="section-title">设备操作</div> -->
      <div class="action-card glass-card">
        <div class="action-item blue" @click="showModifyAddress">
          <van-icon name="location-o" />
          <span>修改地址</span>
        </div>
        <div class="action-item green" @click="showNavigation">
          <van-icon name="guide-o" />
          <span>导航</span>
        </div>
        <div class="action-item orange" @click="goToReplace">
          <van-icon name="replay" />
          <span>更换设备</span>
        </div>
        <div class="action-item red" @click="showDeleteConfirm">
          <van-icon name="delete-o" />
          <span>删除设备</span>
        </div>
      </div>

      <!-- 远程控制 -->
      <!-- <div class="section-title">远程控制</div> -->
      <div class="control-card glass-card control-card-spacing">
        <div class="control-row">
          <van-button round class="control-btn-sm restore" @click="onRestoreDefault">恢复默认</van-button>
          <van-button round class="control-btn-sm reposition" @click="onResetDevice">复位</van-button>
          <van-button round class="control-btn-sm notify" @click="onNotifySetting">通知设置</van-button>
        </div>
        <van-button
          block
          round
          :class="['control-btn', isOn ? 'off' : 'on', 'control-restart-spacing']"
          @click="showSecurityConfirm"
        >
          {{ isOn ? '分闸' : '合闸' }}
        </van-button>
        <van-button block round class="control-btn restart control-restart-spacing" @click="onRestart">
          <van-icon name="replay" />
          <span>重启</span>
        </van-button>
      </div>

      <!-- 实时监测数据 -->
      <div class="section-title with-refresh">
        <span>实时监测数据</span>
        <div class="realtime-switch-wrapper" v-show="activeDetailTab === 'realtime'">
          <span class="switch-label">实时更新</span>
          <van-switch v-model="isRealTime" size="18px" />
        </div>
      </div>

      <!-- 详情 Tab 切换 -->
      <div class="detail-tabs">
        <div
          v-for="tab in detailTabs"
          :key="tab.key"
          class="detail-tab"
          :class="{ active: activeDetailTab === tab.key }"
          @click="activeDetailTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 实时数据 -->
      <template v-if="activeDetailTab === 'realtime'">
        <div class="data-grid">
          <div v-for="(item, index) in monitoringData" :key="index" class="data-card glass-card">
            <div class="data-label">{{ item.label }}</div>
            <div class="data-main">
              <span class="data-value">{{ item.value }}</span>
              <span class="data-unit">{{ item.unit }}</span>
            </div>
            <div class="data-threshold">阈值: {{ item.threshold }}</div>
          </div>
        </div>

        <!-- 相位数据切换 -->
        <div class="phase-tabs-container">
          <div class="phase-tabs glass-card no-blur">
            <div
              v-for="phase in ['A相', 'B相', 'C相']"
              :key="phase"
              :class="['phase-tab', { active: currentPhase === phase }]"
              @click="currentPhase = phase"
            >
              {{ phase }}
            </div>
          </div>
        </div>

        <div class="data-grid">
          <div v-for="(item, index) in phaseData[currentPhase]" :key="index" class="data-card glass-card">
            <div class="data-label">{{ item.label }}</div>
            <div class="data-main">
              <span class="data-value">{{ item.value }}</span>
              <span class="data-unit">{{ item.unit }}</span>
            </div>
            <div class="data-threshold">阈值: {{ item.threshold }}</div>
          </div>
        </div>
      </template>

      <!-- 参数设置 -->
      <div v-else-if="activeDetailTab === 'param'" class="tab-placeholder glass-card">
        <van-icon name="setting-o" size="32" color="#c8c9cc" />
        <p>参数设置功能建设中</p>
      </div>

      <!-- 设备描述 -->
      <div v-else-if="activeDetailTab === 'desc'" class="tab-placeholder glass-card">
        <van-icon name="description" size="32" color="#c8c9cc" />
        <p>设备描述功能建设中</p>
      </div>

      <!-- 历史数据 -->
      <template v-else-if="activeDetailTab === 'history'">
        <!-- 事件类型切换 -->
        <div class="event-tabs">
          <div
            v-for="tab in eventTypeTabs"
            :key="tab.key"
            class="event-tab"
            :class="{ active: activeEventType === tab.key }"
            @click="activeEventType = tab.key"
          >
            {{ tab.label }}
          </div>
        </div>

        <!-- 查询操作 -->
        <div class="query-bar glass-card">
          <van-button class="reset-btn" round @click="onReset">重置</van-button>
          <van-button class="query-btn" type="primary" round @click="onQuery">查询</van-button>
        </div>

        <!-- 事件卡片列表 -->
        <div class="event-list">
          <div v-for="(item, index) in currentEvents" :key="index" class="event-card glass-card">
            <!-- 卡片头部 -->
            <div class="event-card-head">
              <div class="event-head-left">
                <span class="event-type-name">{{ item.type }}</span>
                <span class="event-phase-tag">{{ item.phase }}</span>
              </div>
              <span class="event-status-badge" :class="statusClass(item.status)">{{ item.status }}</span>
            </div>

            <!-- 原因 & 时间 -->
            <div class="event-meta">
              <div class="event-meta-row">
                <span class="meta-label">原因</span>
                <span class="meta-value">{{ item.reason }}</span>
              </div>
              <div class="event-meta-row">
                <span class="meta-label">{{ timeLabel }}</span>
                <span class="meta-value">{{ item.time }}</span>
              </div>
            </div>

            <!-- 电压 -->
            <div class="param-group-title">电压 (V)</div>
            <div class="param-grid">
              <div class="param-cell">
                <span class="param-phase a">A相</span>
                <span class="param-num">{{ item.ua }}</span>
              </div>
              <div class="param-cell">
                <span class="param-phase b">B相</span>
                <span class="param-num">{{ item.ub }}</span>
              </div>
              <div class="param-cell">
                <span class="param-phase c">C相</span>
                <span class="param-num">{{ item.uc }}</span>
              </div>
            </div>

            <!-- 电流 -->
            <div class="param-group-title">电流 (A)</div>
            <div class="param-grid">
              <div class="param-cell">
                <span class="param-phase a">A相</span>
                <span class="param-num">{{ item.ia }}</span>
              </div>
              <div class="param-cell">
                <span class="param-phase b">B相</span>
                <span class="param-num">{{ item.ib }}</span>
              </div>
              <div class="param-cell">
                <span class="param-phase c">C相</span>
                <span class="param-num">{{ item.ic }}</span>
              </div>
            </div>

            <!-- 漏电 -->
            <div class="event-leak">
              <span class="meta-label">漏电</span>
              <span class="leak-value">{{ item.leak }}</span>
              <span class="leak-unit">mA</span>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!currentEvents.length" class="event-empty glass-card">
            <van-icon name="search" size="32" color="#c8c9cc" />
            <p>暂无相关事件记录</p>
          </div>
        </div>
      </template>

      <!-- 冻结数据 -->
      <template v-else-if="activeDetailTab === 'freeze'">
        <!-- 查询条件 -->
        <div class="freeze-query glass-card">
          <div class="freeze-query-row" @click="showFreezeTypePicker = true">
            <span class="fq-label">冻结类型</span>
            <span class="fq-value">
              {{ freezeTypeLabel }}
              <van-icon name="arrow-down" />
            </span>
          </div>
          <div class="freeze-query-row">
            <span class="fq-label">指定次数</span>
            <van-stepper v-model="freezeCount" :min="1" :max="9999" integer />
          </div>
          <van-button class="freeze-query-btn" type="primary" round block @click="onFreezeQuery">查询</van-button>
        </div>

        <!-- 冻结数据结果（多条） -->
        <div v-if="freezeResults.length" class="freeze-result-wrap">
          <div class="freeze-result-count">共 {{ freezeResults.length }} 条记录</div>
          <van-collapse v-model="activeFreezeNames" class="freeze-collapse glass-card">
            <van-collapse-item
              v-for="(record, index) in freezeResults"
              :key="index"
              :name="index"
            >
              <template #title>
                <div class="freeze-collapse-title">
                  <span class="fct-index">第 {{ index + 1 }} 次</span>
                  <span class="fct-time">{{ record.time }}</span>
                </div>
              </template>
              <div class="freeze-result">
                <div v-for="(item, i) in record.fields" :key="i" class="freeze-row">
                  <span class="fr-label">{{ item.label }}</span>
                  <span class="fr-value">
                    {{ item.value }}
                    <span v-if="item.unit" class="fr-unit">{{ item.unit }}</span>
                  </span>
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>

        <!-- 空状态 -->
        <div v-else class="event-empty glass-card">
          <van-icon name="search" size="32" color="#c8c9cc" />
          <p>暂无冻结数据，请点击查询</p>
        </div>
      </template>
    </div>

    <!-- 安全确认弹窗 -->
    <van-dialog
      v-model:show="securityDialog.show"
      :show-confirm-button="false"
      class-name="glass-dialog"
    >
      <div class="delete-dialog-content">
        <h3 class="delete-title">安全确认</h3>
        <p class="dialog-desc">远程控制需要输入密码确认</p>
        <div class="dialog-content-inner">
          <van-field
            v-model="securityDialog.password"
            type="password"
            placeholder="请输入操作密码"
            class="dialog-input"
          />
        </div>
        <div class="delete-actions-group">
          <van-button class="cancel-btn" @click="securityDialog.show = false" round>取消</van-button>
          <van-button class="confirm-btn" type="primary" @click="handleCommand" round>确认操作</van-button>
        </div>
      </div>
    </van-dialog>

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
          <van-button class="cancel-btn" @click="addressDialog.show = false" round>取消</van-button>
          <van-button class="confirm-btn" type="primary" @click="confirmAddress" round>确认</van-button>
        </div>
      </div>
    </van-dialog>

    <!-- 冻结类型选择 -->
    <van-popup v-model:show="showFreezeTypePicker" position="bottom" round>
      <van-picker
        :columns="freezeTypeOptions"
        :model-value="[freezeType]"
        @confirm="onFreezeTypeConfirm"
        @cancel="showFreezeTypePicker = false"
      />
    </van-popup>

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
        <div class="delete-actions-group">
          <van-button class="cancel-btn" @click="deleteDialog.show = false" round>取消</van-button>
          <van-button class="confirm-btn" type="danger" @click="confirmDelete" round>删除</van-button>
        </div>
      </div>
    </van-dialog>

    <!-- 过程动画遮罩 -->
    <van-overlay :show="processing.show" class="process-overlay">
      <div class="process-wrapper">
        <div class="steps-container">
          <div class="step-item" :class="{ active: processing.step >= 1, done: processing.step > 1 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 1" name="success" />
              <span v-else>1</span>
            </div>
            <div class="step-label">密码验证</div>
          </div>
          <div class="step-line" :class="{ active: processing.step >= 2 }"></div>
          <div class="step-item" :class="{ active: processing.step >= 2, done: processing.step > 2 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 2" name="success" />
              <span v-else>2</span>
            </div>
            <div class="step-label">指令下发</div>
          </div>
          <div class="step-line" :class="{ active: processing.step >= 3 }"></div>
          <div class="step-item" :class="{ active: processing.step >= 3, done: processing.step > 3 }">
            <div class="step-icon">
              <van-icon v-if="processing.step > 3" name="success" />
              <span v-else>3</span>
            </div>
            <div class="step-label">下发成功</div>
          </div>
        </div>
        <div class="process-status">
          <van-loading v-if="processing.step <= 3" size="20px" type="spinner" color="#1989fa" />
          <span class="status-text">{{ processing.statusText }}</span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showFailToast, showConfirmDialog } from 'vant';

const router = useRouter();
const isOn = ref(false);
const currentPhase = ref('A相');
const isRealTime = ref(false);

const onClickLeft = () => router.back();

// 安全确认逻辑
const securityDialog = reactive({
  show: false,
  password: ''
});

const showSecurityConfirm = () => {
  securityDialog.password = '';
  securityDialog.show = true;
};

// 过程动画逻辑
const processing = reactive({
  show: false,
  step: 1,
  statusText: '正在验证密码...'
});

const handleCommand = () => {
  if (!securityDialog.password.trim()) {
    showFailToast('请输入操作密码');
    return;
  }
  
  securityDialog.show = false;
  processing.show = true;
  processing.step = 1;
  processing.statusText = '密码验证成功';

  // 模拟过程
  setTimeout(() => {
    processing.step = 2;
    processing.statusText = '指令下发中...';
    
    setTimeout(() => {
      processing.step = 3;
      processing.statusText = '下发成功，设备响应中';
      
      setTimeout(() => {
        processing.show = false;
        isOn.value = !isOn.value;
        showSuccessToast(isOn.value ? '已合闸' : '已分闸');
      }, 1000);
    }, 1500);
  }, 800);
};

const handleRefresh = () => {
  showToast('数据已刷新');
};

// 恢复默认
const onRestoreDefault = () => {
  showConfirmDialog({
    title: '恢复默认',
    message: '确认将设备参数恢复为出厂默认设置？',
    className: 'glass-dialog',
  })
    .then(() => showSuccessToast('已恢复默认设置'))
    .catch(() => {});
};

// 复位
const onResetDevice = () => {
  showConfirmDialog({
    title: '设备复位',
    message: '确认对设备执行复位操作？',
    className: 'glass-dialog',
  })
    .then(() => showSuccessToast('复位指令已下发'))
    .catch(() => {});
};

// 重启
const onRestart = () => {
  showConfirmDialog({
    title: '重启设备',
    message: '确认重启该设备？重启期间将短暂离线。',
    className: 'glass-dialog',
  })
    .then(() => showSuccessToast('重启指令已下发'))
    .catch(() => {});
};

// 通知设置
const onNotifySetting = () => {
  showToast('通知设置功能建设中');
};

// 设备地址（示例数据）
const deviceAddress = ref('1号配电柜 2层右侧');

// 1. 修改地址
const addressDialog = reactive({
  show: false,
  value: '',
});
const showModifyAddress = () => {
  addressDialog.value = deviceAddress.value;
  addressDialog.show = true;
};
const confirmAddress = () => {
  if (!addressDialog.value.trim()) {
    showToast('请输入详细安装地址');
    return;
  }
  deviceAddress.value = addressDialog.value;
  addressDialog.show = false;
  showSuccessToast('修改成功');
};

// 2. 导航
const showNavSheet = ref(false);
const navActions = [
  { name: '高德地图' },
  { name: '百度地图' },
  { name: '腾讯地图' },
  { name: '苹果地图' },
];
const showNavigation = () => {
  showNavSheet.value = true;
};
const onNavSelect = (item) => {
  showToast(`正在跳转至 ${item.name}`);
};

// 3. 更换设备
const goToReplace = () => {
  router.push({ name: 'ReplaceDevice' });
};

// 跳转所属网关
const goToGateway = () => {
  router.push({ name: 'GatewayDetail' });
};

// 4. 删除设备
const deleteDialog = reactive({
  show: false,
});
const showDeleteConfirm = () => {
  deleteDialog.show = true;
};
const confirmDelete = () => {
  deleteDialog.show = false;
  showSuccessToast('删除成功');
  router.back();
};

const monitoringData = [
  { label: '剩余电流(漏电)', value: '0.02', unit: 'mA', threshold: '≤ 30 mA' },
  { label: '电网频率', value: '50.01', unit: 'Hz', threshold: '49.5-50.5 Hz' },
  { label: '载板温度', value: '34.5', unit: '℃', threshold: '≤ 80 ℃' },
  { label: '载板湿度', value: '45.2', unit: '%', threshold: '≤ 85 %' },
  { label: '总有功功率', value: '12.5', unit: 'kW', threshold: '≤ 15.0 kW' },
  { label: '总无功功率', value: '1.2', unit: 'kVar', threshold: '≤ 5.0 kVar' },
  { label: '总功率因数', value: '0.96', unit: '', threshold: '≥ 0.85' },
  { label: '信号强度', value: '-65', unit: 'dBm', threshold: '≥ -90 dBm' },
];

const phaseData = {
  'A相': [
    { label: '电压', value: '220.1', unit: 'V', threshold: '207-253 V' },
    { label: '后端电压', value: '220.0', unit: 'V', threshold: '207-253 V' },
    { label: '电流', value: '15.2', unit: 'A', threshold: '≤ 63 A' },
    { label: '有功功率', value: '3.3', unit: 'kW', threshold: '≤ 5.0 kW' },
    { label: '端子温度 (进)', value: '35.1', unit: '℃', threshold: '≤ 85 ℃' },
    { label: '端子温度 (出)', value: '34.8', unit: '℃', threshold: '≤ 85 ℃' },
  ],
  'B相': [
    { label: '电压', value: '219.5', unit: 'V', threshold: '207-253 V' },
    { label: '后端电压', value: '219.4', unit: 'V', threshold: '207-253 V' },
    { label: '电流', value: '14.8', unit: 'A', threshold: '≤ 63 A' },
    { label: '有功功率', value: '3.1', unit: 'kW', threshold: '≤ 5.0 kW' },
    { label: '端子温度 (进)', value: '34.5', unit: '℃', threshold: '≤ 85 ℃' },
    { label: '端子温度 (出)', value: '34.2', unit: '℃', threshold: '≤ 85 ℃' },
  ],
  'C相': [
    { label: '电压', value: '221.2', unit: 'V', threshold: '207-253 V' },
    { label: '后端电压', value: '221.0', unit: 'V', threshold: '207-253 V' },
    { label: '电流', value: '15.5', unit: 'A', threshold: '≤ 63 A' },
    { label: '有功功率', value: '3.4', unit: 'kW', threshold: '≤ 5.0 kW' },
    { label: '端子温度 (进)', value: '35.8', unit: '℃', threshold: '≤ 85 ℃' },
    { label: '端子温度 (出)', value: '35.5', unit: '℃', threshold: '≤ 85 ℃' },
  ]
};

/* ============ 详情 Tab 切换 ============ */
const detailTabs = [
  { key: 'realtime', label: '实时数据' },
  { key: 'param', label: '参数设置' },
  { key: 'desc', label: '设备描述' },
  { key: 'history', label: '历史数据' },
  { key: 'freeze', label: '冻结数据' },
];
const activeDetailTab = ref('realtime');

/* ============ 历史数据查询 ============ */
const eventTypeTabs = [
  { key: 'alarm', label: '设备报警事件' },
  { key: 'gate', label: '闸位变化事件' },
  { key: 'power', label: '失复电事件' },
];
const activeEventType = ref('alarm');

// 不同事件类型的时间字段标签
const timeLabel = computed(() =>
  activeEventType.value === 'gate' ? '时间' : '发生/恢复时间'
);

// 查询 / 重置
const onQuery = () => {
  showSuccessToast('查询成功');
};

const onReset = () => {
  activeEventType.value = 'alarm';
  showToast('已重置');
};

// 状态徽标样式
const statusClass = (status) => {
  if (['告警', '失电', '分闸'].includes(status)) return 'danger';
  if (['恢复', '复电', '合闸'].includes(status)) return 'success';
  return 'info';
};

// 各类型事件记录（示例数据）
const eventRecords = {
  alarm: [
    {
      type: '过流报警', reason: 'A相电流超过阈值', status: '告警', phase: 'A相',
      time: '2026-06-26 10:23:11',
      ua: '220.1', ub: '219.8', uc: '221.0', ia: '32.5', ib: '4.9', ic: '5.0', leak: '0.5',
    },
    {
      type: '过压报警', reason: '电网电压异常升高', status: '恢复', phase: 'B相',
      time: '2026-06-25 18:47:02',
      ua: '231.4', ub: '258.6', uc: '230.9', ia: '4.8', ib: '5.1', ic: '4.7', leak: '0.3',
    },
  ],
  gate: [
    {
      type: '闸位变化', reason: '远程分闸指令', status: '分闸', phase: 'A相',
      time: '2026-06-26 09:12:36',
      ua: '0.0', ub: '0.0', uc: '0.0', ia: '0.0', ib: '0.0', ic: '0.0', leak: '0.0',
    },
    {
      type: '闸位变化', reason: '本地手动合闸', status: '合闸', phase: 'A相',
      time: '2026-06-25 08:05:19',
      ua: '220.3', ub: '220.0', uc: '219.7', ia: '5.0', ib: '4.9', ic: '5.1', leak: '0.4',
    },
  ],
  power: [
    {
      type: '失复电事件', reason: '线路停电', status: '失电', phase: 'C相',
      time: '2026-06-24 22:31:50',
      ua: '218.9', ub: '219.2', uc: '0.0', ia: '4.6', ib: '4.7', ic: '0.0', leak: '0.2',
    },
    {
      type: '失复电事件', reason: '线路恢复供电', status: '复电', phase: 'C相',
      time: '2026-06-24 23:10:08',
      ua: '220.5', ub: '220.1', uc: '220.8', ia: '5.0', ib: '4.9', ic: '5.0', leak: '0.3',
    },
  ],
};

const currentEvents = computed(() => eventRecords[activeEventType.value] || []);

/* ============ 冻结数据 ============ */
const freezeTypeOptions = [
  { text: '瞬时冻结', value: 'instant' },
  { text: '分钟冻结', value: 'minute' },
  { text: '日冻结', value: 'day' },
  { text: '月冻结', value: 'month' },
];
const freezeType = ref('day');
const showFreezeTypePicker = ref(false);
const freezeCount = ref(1);

const freezeTypeLabel = computed(
  () => freezeTypeOptions.find((o) => o.value === freezeType.value)?.text || ''
);

const onFreezeTypeConfirm = ({ selectedValues }) => {
  freezeType.value = selectedValues[0];
  showFreezeTypePicker.value = false;
};

// 查询结果（每次查询生成 freezeCount 条记录）
const freezeResults = ref([]);
const activeFreezeNames = ref([]);

// 两位补零
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// 根据冻结类型与序号计算冻结时间（序号越大时间越早）
const freezeTimeAt = (index) => {
  const d = new Date(2026, 5, 29, 0, 0, 0);
  switch (freezeType.value) {
    case 'instant': d.setSeconds(d.getSeconds() - index * 5); break;
    case 'minute': d.setMinutes(d.getMinutes() - index * 15); break;
    case 'day': d.setDate(d.getDate() - index); break;
    case 'month': d.setMonth(d.getMonth() - index); break;
  }
  return fmt(d);
};

// 构建单条冻结记录字段（瞬时/分钟/日/月冻结均使用日冻结字段）
const buildFreezeFields = (index, time) => [
  { label: '冻结类型', value: freezeTypeLabel.value, unit: '' },
  { label: '冻结时间', value: time, unit: '' },
  { label: '正向有功总电能', value: (12345.67 - index * 23.45).toFixed(2), unit: 'kWh' },
  { label: '反向有功总电能', value: '0.00', unit: 'kWh' },
  { label: '组合无功1电能', value: (2345.12 - index * 5.6).toFixed(2), unit: 'kvarh' },
  { label: '组合无功2电能', value: (1234.56 - index * 3.2).toFixed(2), unit: 'kvarh' },
  { label: '第一象限无功电能', value: (1200.34 - index * 2.8).toFixed(2), unit: 'kvarh' },
  { label: '第二象限无功电能', value: '0.00', unit: 'kvarh' },
  { label: '第三象限无功电能', value: '0.00', unit: 'kvarh' },
  { label: '第四象限无功电能', value: (1144.78 - index * 2.4).toFixed(2), unit: 'kvarh' },
  { label: '正向有功最大需量', value: (15.23 - index * 0.12).toFixed(2), unit: 'kW' },
  { label: '正向有功最大需量发生时间', value: time, unit: '' },
  { label: '反向有功最大需量', value: '0.00', unit: 'kW' },
  { label: '反向有功最大需量发生时间', value: '--', unit: '' },
  { label: '总有功功率', value: (12.50 - index * 0.1).toFixed(2), unit: 'kW' },
  { label: 'A相有功功率', value: (4.20 - index * 0.03).toFixed(2), unit: 'kW' },
  { label: 'B相有功功率', value: (4.10 - index * 0.03).toFixed(2), unit: 'kW' },
  { label: 'C相有功功率', value: (4.20 - index * 0.04).toFixed(2), unit: 'kW' },
  { label: '总无功功率', value: (1.20 - index * 0.02).toFixed(2), unit: 'kvar' },
  { label: 'A相无功功率', value: '0.40', unit: 'kvar' },
  { label: 'B相无功功率', value: '0.40', unit: 'kvar' },
  { label: 'C相无功功率', value: '0.40', unit: 'kvar' },
];

const onFreezeQuery = () => {
  const count = freezeCount.value;
  const list = [];
  for (let i = 0; i < count; i++) {
    const time = freezeTimeAt(i);
    list.push({ time, fields: buildFreezeFields(i, time) });
  }
  freezeResults.value = list;
  activeFreezeNames.value = count ? [0] : []; // 默认展开第一条
  showSuccessToast(`查询到 ${count} 条${freezeTypeLabel.value}数据`);
};
</script>

<style scoped>
.device-detail-page {
  position: relative;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding-bottom: 30px;
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

.content {
  position: relative;
  z-index: 1;
  padding: 16px;
}

.base-info-section {
  padding-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 24px 0 12px;
  padding-left: 12px;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background-color: #1989fa;
  border-radius: 2px;
}

.section-title.with-refresh {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 16px;
}

.realtime-switch-wrapper {
  display: flex;
  align-items: center;
}

.switch-label {
  font-size: 13px;
  color: #646566;
  margin-right: 8px;
  font-weight: normal;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.no-blur {
  backdrop-filter: none;
}

/* 基础信息 */
.device-image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.image-box {
  width: 100%;
  height: 140px;
  background: rgba(25, 137, 250, 0.05);
  border: 1px dashed rgba(25, 137, 250, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-tip {
  margin-top: 8px;
  font-size: 13px;
  color: #969799;
}

.info-list .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 15px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  color: #646566;
}

.info-row .value {
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
}

.value.mono {
  font-family: monospace;
}

.value.link {
  color: #1989fa;
  text-decoration: underline;
  cursor: pointer;
}

/* 设备操作 */
.action-card {
  display: flex;
  padding: 8px 0;
}

.action-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  font-size: 12px;
  cursor: pointer;
}

.action-item .van-icon {
  font-size: 22px;
}

.action-item.blue { color: #1989fa; }
.action-item.green { color: #07c160; }
.action-item.orange { color: #ff976a; }
.action-item.red { color: #ee0a24; }

/* 远程控制 */
.control-card-spacing {
  margin-top: 16px;
}

.control-btn {
  height: 54px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.control-btn.on {
  background: rgba(7, 193, 96, 0.1);
  color: #07c160;
}

.control-btn.off {
  background: rgba(238, 10, 36, 0.1);
  color: #ee0a24;
}

/* 控制按钮一行（恢复默认 / 复位） */
.control-row {
  display: flex;
  gap: 10px;
}

.control-btn-sm {
  flex: 1;
  height: 48px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.control-btn-sm.on {
  background: rgba(7, 193, 96, 0.1);
  color: #07c160;
}

.control-btn-sm.off {
  background: rgba(238, 10, 36, 0.1);
  color: #ee0a24;
}

.control-btn-sm.restore {
  background: rgba(25, 137, 250, 0.1);
  color: #1989fa;
}

.control-btn-sm.reposition {
  background: rgba(255, 151, 106, 0.12);
  color: #ff976a;
}

.control-btn-sm.notify {
  background: rgba(123, 97, 255, 0.12);
  color: #7b61ff;
}

/* 重启按钮单独一行 */
.control-restart-spacing {
  margin-top: 12px;
}

.control-btn.restart {
  background: rgba(100, 101, 102, 0.1);
  color: #646566;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn.restart .van-icon {
  font-size: 20px;
}

/* 数据网格 */
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.data-card {
  padding: 16px 12px;
}

.data-label {
  font-size: 13px;
  color: #646566;
  margin-bottom: 8px;
}

.data-main {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.data-value {
  font-size: 22px;
  font-weight: bold;
  color: #1a1a1a;
}

.data-unit {
  font-size: 12px;
  color: #969799;
  margin-left: 4px;
}

.data-threshold {
  font-size: 11px;
  color: #ee0a24;
  background: rgba(238, 10, 36, 0.05);
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
}

/* 相位切换 */
.phase-tabs-container {
  margin: 24px 0 12px;
}

.phase-tabs {
  background: rgba(235, 237, 240, 0.6);
  border-radius: 24px;
  display: flex;
  padding: 4px;
}

.phase-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  border-radius: 20px;
  color: #646566;
  transition: all 0.3s;
}

.phase-tab.active {
  background: white;
  color: #1989fa;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 局部样式 */
.dialog-content {
  padding: 24px 16px;
  text-align: center;
}

.dialog-desc {
  font-size: 14px;
  color: #969799;
  margin-bottom: 20px;
}

.dialog-input {
  background-color: transparent !important;
  border-radius: 12px;
  border: 1px solid #ebedf0;
}

/* 过程动画遮罩 */
.process-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000 !important;
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

.delete-dialog-content {
  padding: 32px 24px;
  text-align: center;
}

.delete-title {
  font-size: 20px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
}

.dialog-content-inner {
  margin: 20px 0;
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

/* ============ 详情 Tab 切换 ============ */
.detail-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.detail-tab {
  flex: 1;
  min-width: 72px;
  text-align: center;
  padding: 9px 0;
  font-size: 14px;
  color: #646566;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(235, 237, 240, 0.9);
  border-radius: 14px;
  transition: all 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.detail-tab.active {
  color: #ffffff;
  font-weight: bold;
  background: #1989fa;
  border-color: #1989fa;
  box-shadow: 0 6px 14px rgba(25, 137, 250, 0.25);
}

/* Tab 占位内容 */
.tab-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 0;
  color: #969799;
  font-size: 14px;
}

/* ============ 历史数据查询 ============ */
/* 事件类型切换 */
.event-tabs {
  display: flex;
  padding: 4px;
  background: rgba(235, 237, 240, 0.6);
  border-radius: 20px;
  margin-bottom: 14px;
}

.event-tab {
  flex: 1;
  text-align: center;
  padding: 9px 0;
  font-size: 13px;
  color: #646566;
  border-radius: 16px;
  transition: all 0.3s;
  cursor: pointer;
}

.event-tab.active {
  background: #ffffff;
  color: #1989fa;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* 查询操作栏 */
.query-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.query-bar .van-button {
  flex: 1;
  height: 40px;
  font-weight: 500;
}

.reset-btn {
  background-color: #f0f7ff !important;
  color: #1989fa !important;
  border: none !important;
}

/* 事件卡片列表 */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-card {
  padding: 16px;
}

.event-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(242, 243, 245, 0.9);
}

.event-head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-type-name {
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
}

.event-phase-tag {
  font-size: 11px;
  color: #1989fa;
  background: rgba(25, 137, 250, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
}

.event-status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 12px;
}

.event-status-badge.danger {
  color: #ee0a24;
  background: rgba(238, 10, 36, 0.1);
}

.event-status-badge.success {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.event-status-badge.info {
  color: #1989fa;
  background: rgba(25, 137, 250, 0.1);
}

/* 原因 & 时间 */
.event-meta {
  padding: 12px 0;
}

.event-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-meta-row:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-size: 13px;
  color: #969799;
  flex-shrink: 0;
}

.meta-value {
  font-size: 13px;
  color: #323233;
  font-weight: 500;
  text-align: right;
  margin-left: 12px;
}

/* 电气参数分组 */
.param-group-title {
  font-size: 12px;
  color: #646566;
  font-weight: 600;
  margin: 4px 0 8px;
}

.param-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.param-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  background: rgba(25, 137, 250, 0.04);
  border-radius: 12px;
}

.param-phase {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 8px;
}

.param-phase.a {
  color: #ee0a24;
  background: rgba(238, 10, 36, 0.08);
}

.param-phase.b {
  color: #07c160;
  background: rgba(7, 193, 96, 0.08);
}

.param-phase.c {
  color: #1989fa;
  background: rgba(25, 137, 250, 0.08);
}

.param-num {
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
}

/* 漏电 */
.event-leak {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(242, 243, 245, 0.9);
}

.leak-value {
  font-size: 18px;
  font-weight: bold;
  color: #ff976a;
}

.leak-unit {
  font-size: 12px;
  color: #969799;
}

/* 空状态 */
.event-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 0;
  color: #969799;
  font-size: 14px;
}

/* ============ 冻结数据 ============ */
.freeze-query {
  margin-bottom: 14px;
}

.freeze-query-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 36px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(242, 243, 245, 0.9);
}

.fq-label {
  font-size: 14px;
  color: #646566;
}

.fq-value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #1989fa;
  cursor: pointer;
}

.freeze-query-btn {
  height: 42px;
  margin-top: 14px;
  font-weight: 500;
}

.freeze-result-count {
  font-size: 12px;
  color: #969799;
  margin-bottom: 10px;
  padding-left: 4px;
}

.freeze-collapse {
  padding: 0 16px;
  overflow: hidden;
}

.freeze-collapse :deep(.van-collapse-item__content) {
  background: transparent;
  padding: 0;
}

.freeze-collapse :deep(.van-cell) {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}

.freeze-collapse-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.freeze-result {
  padding-bottom: 4px;
}

.fct-index {
  font-size: 14px;
  font-weight: 600;
  color: #1989fa;
}

.fct-time {
  font-size: 12px;
  color: #969799;
}

.freeze-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid rgba(242, 243, 245, 0.9);
}

.freeze-row:last-child {
  border-bottom: none;
}

.fr-label {
  font-size: 13px;
  color: #646566;
  flex-shrink: 0;
}

.fr-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: right;
  margin-left: 12px;
}

.fr-unit {
  font-size: 11px;
  font-weight: normal;
  color: #969799;
  margin-left: 3px;
}
</style>

<!-- 全局样式：强制置顶并确保弹窗渐变样式 -->
<style>
/* 导航栏置顶并强制提升层级：正确穿透 placeholder */
.glass-nav {
  z-index: 9999 !important;
}
.glass-nav .van-nav-bar,
.van-nav-bar.glass-nav {
  z-index: 9999 !important;
  background: linear-gradient(to bottom, #ffffff, #f0f7ff) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
}

/* 弹窗背景样式：渐变系统风格 */
.glass-dialog.van-dialog {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden;
}

/* 导航选择面板：渐变系统风格 */
.glass-sheet.van-action-sheet {
  background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 24px 24px 0 0 !important;
}

/* 过程动画容器背景样式：渐变系统风格 */
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
</style>
