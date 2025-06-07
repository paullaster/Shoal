<template>
    <v-card style="padding-inline: 0 !important;" flat>
        <v-card-text style="padding-inline: 0 !important;">
            <div v-if="!getAttributes.length"
                style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p style="margin-bottom: 8px;"> No attribute defined yet</p>
                <v-btn elevation="1" class="rounded-lg bg-secondary" @click="handleAddNewAttribute"><span
                        style="text-transform: capitalize;">Add
                        you first
                        attribute</span></v-btn>
            </div>
            <div v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div v-for="(attribute, index) in getAttributes"
                        :key="attribute.attributeId || attribute.name + index"
                        class="border border-gray-200 p-4 rounded-xl bg-white shadow-sm flex flex-col gap-3">
                        <AttributeCard :attribute="attribute" />
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { onMounted } from 'vue';
import { globalEventBus } from 'vue-toastification';
import AttributeCard from './AttributeCard.vue';
import useProduct from '@/composables/useProduct';

// Composable
const { fetchAttributes, getAttributes } = useProduct();



// Providers


function handleAddNewAttribute() {
    globalEventBus.emit('triggerNewForm');
}

// lifecycle
onMounted(() => {
    (async () => await fetchAttributes({ eager: true }))();
});

</script>

<style scoped>
::v-deep(.v-field) {
    border-radius: 12px;
}
</style>