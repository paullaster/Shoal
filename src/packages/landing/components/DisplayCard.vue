<template>
    <section class="display-card-wrapper">
        <!-- @TODO: ADVERT SECTION -->
        <!-- ADVERT SECTION TO BE DONE -->
        <div class="advert">
            <h2>Advert</h2>
            <p>This is an advert</p>
        </div>
        <CategoriesListing />
        <UserHistory />
        <SearchHistory />
    </section>
</template>

<script setup>
import CategoriesListing from './CategoriesListing.vue';
import UserHistory from './UserHistory.vue';
import SearchHistory from './SearchHistory.vue';
</script>

<style scoped>

</style>