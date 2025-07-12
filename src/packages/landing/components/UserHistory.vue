<template>
    <div class="user-history-wrapper">
        <component-heading-with-button :history="userHistory" />
        <div class="row">
            <ProductListing v-for="(product, index) in getProducts" :key="index" :product="product" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ComponentHeadingWithButton from '@/components/ComponentHeadingWithButton.vue';
import ProductListing from '@/components/ProductListing.vue';
import useProduct from '@/composables/useProduct';

// Composables
const { getProducts } = useProduct();
const userHistory = ref("Our products");
</script>