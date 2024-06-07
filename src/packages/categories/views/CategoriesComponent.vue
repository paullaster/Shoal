<template>
    <main class="categories-wrapper">
        
    </main>
</template>

<script setup>
import { useCategoryStore } from "@/store";
import { computed } from "vue";


// STORE
const categoryStroe = useCategoryStore();
const  { categoryGetter } = categoryStroe;


// STORE ACTIONS

// Computed Properties
const productsList = computed(() => categoryGetter("productList"))

// Lifecycle Hooks

</script>

<style lang="scss" scoped>

</style>