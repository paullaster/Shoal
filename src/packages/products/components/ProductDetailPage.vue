<template>
    <main class="product-wrapper">
        <section class="product-wrapper-card">
            <img :src="product.image" alt="">
            <h1>{{ product.name }}</h1>
            <p>{{ product.description }}</p>
            <p>
                <span> {{ product.defaultCurrency }}</span>
                <span>{{ product.price }}</span>
            </p>
            <p>{{ product.quantity }}</p>
            <p>{{ product.size }}</p>
            <p>{{ product.color }}</p>
            <p>{{ product.description }}</p>
            <ButtonComponent caption="add to cart" @click="()=>router.push({name: 'cart'})"/>
        </section>
    </main>
</template>

<script setup>
import { useProductStore } from '@/store';
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import ButtonComponent from '@/components/ButtonComponent.vue';


// ROUTES
const route = useRoute();
const router = useRouter();
// STORE
const productStore = useProductStore();

// STORE STATES AND GETTERS
const { product } = storeToRefs(productStore);

// STORE ACTIONS
productStore.getProduct(stringToBase64AndReverse.fromBase64String(route.params.productId));
</script>

<style scoped>
</style>