<template>
    <main class="landing-wrapper">
        <LogoComponent />
        <DisplayCard />
    </main>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue';
import DisplayCard from '../components/DisplayCard.vue';
import {useGlobalStore, useProductStore } from "@/store";
import { onBeforeRouteLeave } from "vue-router";

// STORE
const globalStore = useGlobalStore();
const categoryStore = useProductStore();

// STORE ACTIONS
const { setMenu } = globalStore;
const { getProducts } = categoryStore;

const menus = [
    {
        name: 'Home',
        path: '/',
        icon: 'mdi-home-circle-outline',
    },
    {
        name: 'Categories',
        path: '/categories',
        icon: '',
    },
    {
        name: 'Account',
        path: '/Help',
        icon: '',
    },
    {
        name: 'More',
        path: '/more',
        icon: '',
    }
];
setMenu(menus);


// LIFECYCLE HOOKS
onBeforeRouteLeave( () => {
    getProducts();
} );

</script>

<style scoped>

</style>