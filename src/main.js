import './assets/style/main.css'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'

import App from './App.vue'
import router from './router'

const app = createApp(App);


const toastOptions = {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
};

const pinia = createPinia();
pinia.use(({store}) => {
    store.toast = markRaw(useToast());
});

app.use(pinia);
app.use(Toast, toastOptions);
app.use(router);
app.use(vuetify);
app.mount('#app')
