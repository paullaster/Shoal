<template>
    <div class="search-page-wrapper">
        <div  class="search-input-control">
            <input type="text" placeholder="search products, categories and catalogues">
        </div>
        <div class="search-page-result" v-if="focused">
            search page
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const focused = ref(false);
</script>

<style lang="scss" scoped>

</style>