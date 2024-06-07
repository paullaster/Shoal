<template>
    <div class="display-card-wrapper">
        <img :src="DisplayFish" alt="Display fish">
        <div>
            <h1>Display Fish</h1>
            <p>This is the display fish page</p>
            <Button caption="order now"/>
        </div>
    </div>
</template>

<script setup>
import DisplayFish from "@/assets/images/display_fish.jpeg";
import Button from "@/components/ButtonComponent.vue";

</script>

<style scoped>

</style>