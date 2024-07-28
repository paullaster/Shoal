<template>
    <section class="search-page-wrapper">
        <div  class="search-input-wrapper">
            <v-icon>mdi-magnify</v-icon>
            <input type="search" placeholder="search products, categories and catalogues">
        </div>
        <div class="search-page-result" v-if="focused">
            search page
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const focused = ref(false);
</script>

<style lang="scss" scoped>

</style>