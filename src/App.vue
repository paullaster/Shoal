<template>
  <HeaderComponent v-if="showHeader"/>
  <router-view v-slot="{Component}">
    <transition>
     <component :is="Component"/>
    </transition>
  </router-view>
  <FooterComponents />
  <DynamicDialog />
  <LoaderComponent v-if="loading" />
</template>
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { onMounted, ref, watch, defineAsyncComponent } from 'vue';
import { useAuth, useCartStore, useGlobalStore, useSetupStore } from './store';
import AuthService from './packages/auth/AuthService';
const DynamicDialog = defineAsyncComponent(() => import("@/components/DynamicDialog.vue"));
import FooterComponents from './components/FooterComponents.vue';
import LoaderComponent from './components/LoaderComponent.vue';
import { storeToRefs } from 'pinia';


// ROUTES
const route = useRoute();


// STORE AND STORE ACTIONS
const globalStore = useGlobalStore();
const setupStore = useSetupStore();
const cartStore = useCartStore();
const authStore = useAuth();
const { loading } = storeToRefs(globalStore);
const { setMenu } = globalStore;

const menus = [
    {
        name: 'Orders',
        path: '/account/orders',
        icon: 'mdi-hoop-house',
        enabled: AuthService.isAuthenticated()
    },
    // {
    //     name: 'Vouchers',
    //     path: '/vouchers',
    //     icon: 'mdi-ticket-percent-outline',
    // enabled: true
    // },
    {
        name: 'Saved Items',
        path: '/saved-items',
        icon: 'mdi-bookmark-outline',
        enabled: AuthService.isAuthenticated()
    },
    {
        name: 'More',
        path: '/more',
        icon: 'mdi-unfold-more-vertical',
        enabled: true
    }
];

setMenu(menus);
cartStore.getCart();
authStore.setUser(AuthService.getUser());


const showHeader = ref(true);
// WATCH

//@TODO:  Handle this route guards
watch(
  () =>route,
  (route) => {
    const headerless = route.matched.some((record) => record.meta.headerless);
    showHeader.value = !headerless;
}, {deep: true, immediate: true});

onMounted(() => {
  setupStore.getCategories();
  const headerless = route.matched.some((record) => record.meta.headerless);
  showHeader.value = !headerless;
});

</script>

<style scoped>
</style>
