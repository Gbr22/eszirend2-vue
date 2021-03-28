import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

export let appInstance = createApp(App).use(router);
appInstance.mount("#app");