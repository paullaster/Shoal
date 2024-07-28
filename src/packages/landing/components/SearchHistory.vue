<template>
    <div class="search-history-wrapper">
        <component-heading-with-button :history="searchHistory"/>
        <div class="row">
            <ProductListing v-for="product in products" :key="product.pid" :product="product"/>
        </div>
    </div>
</template>

<script setup>
import ComponentHeadingWithButton from '@/components/ComponentHeadingWithButton.vue';
import ProductListing from '@/components/ProductListing.vue';
import { ref } from 'vue';
import { useProductStore } from '@/store';
import { storeToRefs } from 'pinia';

// STORE
const productStore = useProductStore()
const { products } = storeToRefs(productStore);

const searchHistory = ref("Top Search")

</script>