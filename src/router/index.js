import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import Home from '../views/Home.vue';
import Operation from '../views/Operation.vue';
import Bind from '../views/Bind.vue';
import Energy from '../views/Energy.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import DeviceDetail from '../views/DeviceDetail.vue';
import ReplaceDevice from '../views/ReplaceDevice.vue';
import AlarmRecord from '../views/AlarmRecord.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/device-detail',
    name: 'DeviceDetail',
    component: DeviceDetail,
  },
  {
    path: '/replace-device',
    name: 'ReplaceDevice',
    component: ReplaceDevice,
  },
  {
    path: '/alarm-record',
    name: 'AlarmRecord',
    component: AlarmRecord,
  },
  {
    path: '/bind',
    name: 'Bind',
    component: Bind,
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'Home',
        component: Home,
      },
      {
        path: 'operation',
        name: 'Operation',
        component: Operation,
      },
      {
        path: 'energy',
        name: 'Energy',
        component: Energy,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
