<template>
    <button :class="classProp"  :disabled="disabled">
        {{ caption }}
    </button>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    caption: {
        type: String,
        required: true
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