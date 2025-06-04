<template>
    <img :src="NoelsLogo" :width="width" :height="height" alt="Noels Fish Delivery Logo">
</template>

<script setup>
import NoelsLogo from "../assets/logo.png"

defineProps({
    height: {
        type: String,
    },
    width: {
        type: String,
    },
})
</script>
<style></style>