<template>
  <router-view />
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #f7f8fa;
}

#app {
  -webkit-tap-highlight-color: transparent;
}

/* 隐藏全局滚动条，但保持可滚动性 */
* {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

*::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari and Opera */
}
</style>
