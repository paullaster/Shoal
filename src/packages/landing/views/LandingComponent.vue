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
const { getCategories, getProducts } = categoryStore;

onMounted(() => {
    // getProducts();
    // getCategories();

})

</script>

<style scoped>

</style>