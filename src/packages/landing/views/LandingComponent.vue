<template>
    <main class="landing-wrapper">
        <SearchComponent />
        <DisplayCard />
    </main>
</template>

<script setup>
import DisplayCard from '../components/DisplayCard.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import {useGlobalStore, useProductStore } from "@/store";
import { onMounted } from 'vue';

// STORE
const globalStore = useGlobalStore();
const categoryStore = useProductStore();

// STORE ACTIONS
const { setMenu } = globalStore;
const { getCategories, getProducts } = categoryStore;

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

onMounted(() => {
    // getProducts();
    // getCategories();

})

</script>

<style scoped>

</style>