<template>
        <section :class="onSearchPage">
        <div  class="search-input-wrapper">
            <v-icon>mdi-magnify</v-icon>
            <input type="search" placeholder="search products, categories and catalogues" @focus="setSearchPage">
        </div>
        <div class="search-page-result" v-if="focused">
            search page
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ROUTES & ROUTER
const route = useRoute();
const router = useRouter();
const { name } = route;

// COMPUTED
const  onSearchPage = computed(
    () => route.name === "search" ? "search-page-wrapper onsearch-page" : "search-page-wrapper"
)

function setSearchPage(){
 if (name === 'landing') {
    router.push({name: 'search'});
 }
}

</script>