<template>
  <HeaderComponent v-if="showHeader"/>
  <router-view v-slot="{Component}">
    <transition>
     <component :is="Component"/>
    </transition>
  </router-view>
  <DynamicDialog />
</template>
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { onMounted, ref, watch, defineAsyncComponent } from 'vue';
import { useAuth, useCartStore, useGlobalStore, useSetupStore } from './store';
import AuthService from './packages/auth/AuthService';
const DynamicDialog = defineAsyncComponent(() => import("@/components/DynamicDialog.vue"));


// ROUTES
const route = useRoute();


// STORE AND STORE ACTIONS
const globalStore = useGlobalStore();
const setupStore = useSetupStore();
const cartStore = useCartStore();
const authStore = useAuth();
const { setMenu } = globalStore;

const menus = [
    {
        name: 'Orders',
        path: '/orders',
        icon: 'mdi-hoop-house',
    },
    {
        name: 'Vouchers',
        path: '/vouchers',
        icon: 'mdi-ticket-percent-outline',
    },
    {
        name: 'Saved Items',
        path: '/saved-items',
        icon: 'mdi-bookmark-outline',
    },
    {
        name: 'More',
        path: '/more',
        icon: 'mdi-unfold-more-vertical',
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
