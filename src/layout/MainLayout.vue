<template>
  <div class="main-layout">
    <div class="main-content">
      <router-view />
    </div>
    <div class="tabbar-wrapper">
      <van-tabbar route class="custom-tabbar" :fixed="false">
        <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/operation">运维</van-tabbar-item>
        <van-tabbar-item icon="apps-o" to="/bind">绑定</van-tabbar-item>
        <van-tabbar-item icon="chart-trending-o" to="/energy">能耗</van-tabbar-item>
        <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 90px; /* Space for floating tabbar */
}

.tabbar-wrapper {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  z-index: 100;
}

.custom-tabbar {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  height: 64px;
  padding: 0 8px;
}

:deep(.van-tabbar-item--active) {
  background: transparent;
  color: #1989fa;
  font-weight: bold;
}

:deep(.van-tabbar-item) {
  background: transparent;
  color: #646566;
}
</style>
