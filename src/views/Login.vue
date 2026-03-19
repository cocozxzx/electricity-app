<template>
  <div class="login-container">
    <div class="login-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
    
    <div class="login-content">
      <div class="login-header">
        <div class="logo-wrapper">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
        </div>
        <h1 class="title">智慧用电管理系统</h1>
      </div>

      <div class="login-card">
        <van-form @submit="onSubmit" class="login-form">
          <div class="form-item-group">
            <van-field
              v-model="username"
              name="username"
              placeholder="请输入用户名"
              left-icon="user-o"
              :rules="[{ required: true, message: '请填写用户名' }]"
              class="custom-field"
            />
            <van-field
              v-model="password"
              type="password"
              name="password"
              placeholder="请输入密码"
              left-icon="lock"
              :rules="[{ required: true, message: '请填写密码' }]"
              class="custom-field"
            />
          </div>
          
          <div class="login-action">
            <van-button round block type="primary" native-type="submit" class="submit-btn">
              登 录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';

const router = useRouter();
const username = ref('admin');
const password = ref('123456');

const onSubmit = (values) => {
  const toast = showLoadingToast({
    message: '正在登录...',
    forbidClick: true,
  });

  // 模拟登录逻辑
  setTimeout(() => {
    toast.close();
    if (username.value === 'admin' && password.value === '123456') {
      showSuccessToast('欢迎回来');
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/home');
    } else {
      showFailToast('用户名或密码不匹配');
    }
  }, 1000);
};
</script>

<style scoped>
.login-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: rgba(25, 137, 250, 0.2);
  top: -50px;
  right: -50px;
}

.circle-2 {
  width: 250px;
  height: 250px;
  background: rgba(0, 210, 255, 0.15);
  top: 300px;
  left: -50px;
}

.login-content {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.logo {
  width: 50px;
  height: 50px;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 1px;
}

.login-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.custom-field {
  background: transparent !important;
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #ebedf0;
  transition: all 0.3s;
}

.custom-field:focus-within {
  border-color: #1989fa;
  background: white !important;
}

.login-action {
  margin-top: 32px;
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 8px 20px rgba(25, 137, 250, 0.3);
}

:deep(.van-field__left-icon) {
  margin-right: 12px;
  color: #1989fa;
}

:deep(.van-cell:after) {
  display: none;
}
</style>
