<template>
  <HeaderComponent v-if="showHeader"/>
  <RouterView />
</template>
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue';
import { useCartStore, useGlobalStore, useSetupStore } from './store';


// ROUTES
const route = useRoute();


// STORE AND STORE ACTIONS
const globalStore = useGlobalStore();
const setupStore = useSetupStore();
const cartStore = useCartStore();
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


const showHeader = ref(null);
// WATCH
watch(
  () =>route,
  (route) => {
  if (route.name === 'auth') {
    return showHeader.value = false;
  } 
  if (route.name === 'search'){
    return showHeader.value = false;
  }else {
    return showHeader.value = true;
  }
}, {deep: true, immediate: true});

onMounted(() => {
  // setupStore.getCategories();
});

</script>

<style scoped>
</style>
