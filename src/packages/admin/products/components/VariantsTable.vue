<template>
    <v-card style="padding-inline: 0 !important;" flat>
        <v-card-text style="padding-inline: 0 !important; display: flex; justify-content: space-between;">
            <div style="width: 80%;">
                <v-text-field placeholder="Search variants" variant="outlined" clearable flat role="search" type="text"
                    density="compact">
                    <template #prepend-inner>
                        <Search :size="16" />
                    </template>
                </v-text-field>
            </div>
            <div>
                <v-btn elevation="1" class="rounded-lg" min-width="12" @click="() => toggleVariantFilter(true)">
                    <Filter :size="20" />
                </v-btn>
            </div>
        </v-card-text>
        <v-card-text style="padding-inline: 0 !important;">
            <div v-if="!variants.length"
                style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p style="margin-bottom: 8px;"> No variants yet</p>
                <v-btn elevation="1" class="rounded-lg bg-secondary" @click="handleAddNewVariant"><span
                        style="text-transform: capitalize;">Add
                        you first
                        Variant</span></v-btn>
            </div>
            <div v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div v-for="(v, i) in variants" :key="varaint.variantId || i">
                        <VariantCard :variant="v" />
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { Filter, Search } from 'lucide-vue-next';
import { ref } from 'vue';
import VariantCard from './VariantCard.vue';
import { globalEventBus } from 'vue-toastification';

const varaint = ref({
    name: "Test",
    sku: "SKU-TEST",
    price: 40,
    quantity: 0,
    attributes: [
        {
            name: "Weigth",
            value: "750g",
        },
        {
            name: "Color",
            value: "Red",
        },
    ]
})
const variants = ref([
    // {
    //     name: "Test",
    //     sku: "SKU-TEST",
    //     price: 120,
    //     quantity: 1,
    //     attributes: [
    //         {
    //             name: "Weigth",
    //             value: "750g",
    //         },
    //         {
    //             name: "Color",
    //             value: "Red",
    //         },
    //     ]
    // },
    // {
    //     name: "Test",
    //     sku: "SKU-TEST",
    //     price: 120,
    //     quantity: 1,
    //     attributes: [
    //         {
    //             name: "Weigth",
    //             value: "750g",
    //         },
    //         {
    //             name: "Color",
    //             value: "Red",
    //         },
    //     ]
    // }
]);


function handleAddNewVariant() {
    globalEventBus.emit('triggerNewForm');
}
function toggleVariantFilter(status) {
    globalEventBus.emit('toggleVariantFilterModal', status);
}

</script>

<style scoped>
::v-deep(.v-field) {
    border-radius: 12px;
}
</style>