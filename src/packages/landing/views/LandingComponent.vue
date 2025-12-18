<template>
    <section class="landing-wrapper bg-grey-lighten-5 min-h-screen pb-6">
        <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-4 md:pt-8">
            <!-- Mobile Search Bar -->
            <div v-if="!lgAndUp" class="sticky top-0 z-50 bg-grey-lighten-5 pt-2">
                <SearchComponent />
            </div>

            <DisplayCard />
        </div>
    </section>
</template>

<script setup>
import DisplayCard from '../components/DisplayCard.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import useProduct from '@/composables/useProduct';
import { onMounted } from 'vue';
import { useDisplay } from 'vuetify';

// composables
const { lgAndUp } = useDisplay();
const { fetchProducts } = useProduct();


onMounted(() => {
    fetchProducts({ eager: true });
});

</script>

<style scoped>
/* Ensure smooth sticky transition if needed */
.sticky {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: rgb(249, 250, 251);
    /* Match bg-grey-lighten-5 */
}
</style>