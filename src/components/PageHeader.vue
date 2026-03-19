<template>
  <div class="header-section">
    <div class="top-bar">
      <h1 class="agent-name">测试代理</h1>
      
      <div class="right-group">
        <van-popover v-model:show="showProjectPopover" :actions="projects" @select="onSelectProject" placement="bottom-start">
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
    </div>
    <div class="user-info">
      <p class="address">浙江杭州市余杭区xxxx</p>
      <p class="user-detail">admin 18888888888</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
</script>

<style scoped>
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

.right-group {
  display: flex;
  align-items: center;
  gap: 12px;
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
</style>
