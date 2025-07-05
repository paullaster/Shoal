<template>
    <div class="flex pa-4 justify-between items-center">
        <h3 class="font-semibold text-gray-800 text-base">{{ attribute.name }}</h3>
        <div class="flex items-center gap-2">
            <v-btn @click="editAttributes(attribute)"
                class="text-gray-600 hover:text-black text-sm font-medium focus:outline-none" color="secondary"
                variant="text" aria-label="Edit attribute">
                <span class="capitalize">Edit</span>
            </v-btn>
            <v-btn @click="onRemove(attribute)"
                class="text-red-500 hover:text-red-600 text-sm font-medium focus:outline-none" variant="text"
                color="danger" aria-label="Remove attribute">
                <span class="capitalize">Remove</span>
            </v-btn>
        </div>
    </div>
    <div class="flex pa-2 flex-wrap gap-2">
        <span v-for="(val, vIndex) in attribute.values" :key="val + vIndex"
            class="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full">
            {{ val.value }}
        </span>
    </div>
</template>

<script setup>
import useProduct from '@/composables/useProduct';
import { globalEventBus, useToast } from 'vue-toastification';

// Injections

// Macros
// Props
const { attribute } = defineProps({
    attribute: Object
});

// Composables
const { deleteAttribute } = useProduct();

async function onRemove(attribute) {
    try {
        if (!attribute.attributeId) return useToast().error('Invalid request!');
        await deleteAttribute({
            attributeId: attribute.attributeId,
        });
        useToast().success('Attribute deleted successfully!');
    } catch (error) {
        useToast().error(error.message);
    }
}

function editAttributes(attribute) {
    globalEventBus.emit('editAttribute', attribute);
}
</script>

<style scoped>
button:focus {
    outline: 2px solid black;
    outline-offset: 2px;
}
</style>
