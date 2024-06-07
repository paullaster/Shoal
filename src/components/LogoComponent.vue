<template>
    <div class="logo-wrapper">
        <img :src="NoelsLogo" alt="Noels Fish Delivery Logo" >
    </div>
</template>

<script setup>
import NoelsLogo from "../assets/logo.svg"

defineProps({
    height: {
        type: String,
    },
    width: {
        type: String,
    },
})
</script>

<style scoped>
/* .logo-wrapper {
    width: 100dvw;
    color: white;
    position: absolute;
    animation: logo-appear 2s ease-in-out linear;
} */
</style>