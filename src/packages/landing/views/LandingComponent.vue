<template>
    <main class="landing-wrapper">
        <SearchComponent />
        <DisplayCard />
    </main>
</template>

<script setup>
import DisplayCard from '../components/DisplayCard.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import { useProductStore } from "@/store";
import { onMounted } from 'vue';

// STORE
const categoryStore = useProductStore();

// STORE ACTIONS
const { getProducts } = categoryStore;

onMounted(() => {
    getProducts();
})

</script>

<style scoped>

</style>