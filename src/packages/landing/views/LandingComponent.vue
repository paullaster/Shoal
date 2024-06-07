<template>
    <main class="landing-wrapper">
        <LogoComponent />
        <DisplayCard />
    </main>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue';
import DisplayCard from '../components/DisplayCard.vue';
import {useGlobalStore, useCategoryStore } from "@/store";
import { onBeforeRouteLeave } from "vue-router";

// STORE
const globalStore = useGlobalStore();
const categoryStore = useCategoryStore();

// STORE ACTIONS
const { setMenu } = globalStore;
const { setProductList } = categoryStore;

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
    setProductList();
} );

</script>

<style scoped>

</style>