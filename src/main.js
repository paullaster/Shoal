import './assets/style/main.css'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import * as Sentry from '@sentry/vue';
import { SENTRYDNS, APPRELEASE } from './environments'

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
pinia.use(({ store }) => {
    store.toast = markRaw(useToast());
});

Sentry.init({
    app,
    dsn: SENTRYDNS,
    release: APPRELEASE,
    environment: import.meta.env.MODE,
    integrations: [
        Sentry.browserTracingIntegration({ router }),
        Sentry.replayIntegration(),
        Sentry.browserProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 0.1, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/noelsdeliveries\.com:8000\/pisces\/api\/v1/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

app.config.errorHandler = (err, instance, info) => {
    Sentry.captureException(err, { extra: { instance, info } });
}

app.config.productionTip = true;

window.addEventListener('vite:preloadError', () => {
    window.location.reload(true)
})

app.use(pinia);
app.use(Toast, toastOptions);
app.use(router);
app.use(vuetify);
app.mount('#app')
