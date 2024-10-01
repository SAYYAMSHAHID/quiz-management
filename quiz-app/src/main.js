import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Ensure the path is correct
import router from './router'; // If using Vue Router

const app = createApp(App);
app.use(store); // Integrate Vuex store
app.use(router); // Integrate Vue Router if needed
app.mount('#app');
