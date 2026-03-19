<template>
  <div class="main-layout">
    <div class="main-content">
      <router-view />
    </div>
    <div class="tabbar-wrapper">
      <van-tabbar route class="custom-tabbar" :fixed="false">
        <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/operation">运维</van-tabbar-item>
        <van-tabbar-item to="/bind" class="prominent-item">
          <template #icon>
            <div class="prominent-icon">
              <van-icon name="plus" />
            </div>
          </template>
          绑定
        </van-tabbar-item>
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
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.tabbar-wrapper {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 34px;
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
  background: rgba(45, 114, 241, 0.05);
  color: #2d72f1;
  font-weight: 900;
}

:deep(.van-tabbar-item--active .van-tabbar-item__icon) {
  font-size: 26px;
  transform: translateY(-4px);
  filter: drop-shadow(0 2px 4px rgba(45, 114, 241, 0.3));
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

:deep(.van-tabbar-item) {
  background: transparent;
  color: #646566;
  transition: all 0.3s;
}

.prominent-item {
  position: relative;
}

.prominent-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #1989fa 0%, #00d2ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(25, 137, 250, 0.4);
  margin-top: -30px;
  border: 4px solid white;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.prominent-icon .van-icon {
  color: white;
  font-size: 26px;
}

.van-tabbar-item--active .prominent-icon {
  transform: scale(1.15) translateY(-4px);
  box-shadow: 0 8px 20px rgba(25, 137, 250, 0.5);
}
</style>
