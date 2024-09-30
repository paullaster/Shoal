<template>
    <div class="user-history-wrapper">
        <component-heading-with-button :history="userHistory"/>
        <div class="row">
            <ProductListing v-for="product in products" :key="product.pid" :product="product"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ComponentHeadingWithButton from '@/components/ComponentHeadingWithButton.vue';
import ProductListing from '@/components/ProductListing.vue';
import { useProductStore } from '@/store';
import { storeToRefs } from 'pinia';

// STORE
const productStore = useProductStore();
const {products} = storeToRefs(productStore);
const userHistory = ref("Our products");
</script>