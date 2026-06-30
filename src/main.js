import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vant from 'vant';
import 'vant/lib/index.css';

// 刷新页面时重置告警已读状态，保证告警示意数据始终展示
localStorage.removeItem('readAlarmDeviceIds');

const app = createApp(App);

app.use(router);
app.use(Vant);

app.mount('#app');
