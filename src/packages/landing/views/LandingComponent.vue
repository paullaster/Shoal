<template>
    <main class="landing-wrapper">
        <SearchComponent />
        <DisplayCard />
    </main>
</template>

<script setup>
import DisplayCard from '../components/DisplayCard.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import useProduct from '@/composables/useProduct';
import { onMounted } from 'vue';

// composables
const { fetchProducts } = useProduct();


onMounted(() => {
    fetchProducts({ eager: true });
});

</script>

<style scoped></style>