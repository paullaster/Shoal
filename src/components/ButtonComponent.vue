<template>
    <button :class="classProp"  :disabled="disabled">
        <span><v-icon :icon="preIcon" class="mr-3"></v-icon></span>
        <span>{{ caption }}</span>
        <span><v-icon :icon="postIcon" class="mr-3"></v-icon></span>
    </button>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    caption: {
        type: String,
        required: true
    },
    preIcon: {
        type: String,
    },
    postIcon: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false
    },
    className: {
        type: String,
        default: 'primary'
    },
    size: {
        type: String,
        default:'md'
    }
})

const classProp = computed(() => {
    return `${props.className} ${props.size}`;
})

</script>

<style scoped>

</style>