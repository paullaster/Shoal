<template>
    <section class="display-card-wrapper">
        <!-- @TODO: ADVERT SECTION -->
        <!-- ADVERT SECTION TO BE DONE -->
        <div class="advert">
           <AdvertComponent />
        </div>
        <CategoriesListing />
        <UserHistory />
    </section>
</template>

<script setup>
import CategoriesListing from './CategoriesListing.vue';
import UserHistory from './UserHistory.vue';
import AdvertComponent from '@/packages/landing/components/AdvertComponent.vue';
</script>

<style scoped>

</style>