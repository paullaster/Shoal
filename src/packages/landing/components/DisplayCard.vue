<template>
    <section class="display-card-wrapper">
        <div class="advert">
            <AdvertComponent />
        </div>
        <UserHistory />
    </section>
</template>

<script setup>
import UserHistory from './UserHistory.vue';
import AdvertComponent from '@/packages/landing/components/AdvertComponent.vue';
</script>

<style scoped></style>