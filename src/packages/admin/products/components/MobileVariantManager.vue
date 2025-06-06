<template>
    <v-card flat style="padding-inline: 0;">
        <v-card-title style="padding-inline: 0 !important;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <h4>Product Variants</h4>
                <div>
                    <v-btn elevation="1" class="rounded-lg mr-2 p-0" min-width="16">
                        <Settings :size="16" />
                    </v-btn>
                    <v-btn elevation="1" class="rounded-lg" min-width="16">
                        <Wand2 :size="16" />
                    </v-btn>
                </div>
            </div>
            <v-tabs v-model="tab" align-tabs="center">
                <v-tab v-for="tab in tabs" :key="tab.key" :text="tab.title" :value="tab.key">
                </v-tab>
            </v-tabs>
        </v-card-title>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item v-for="t in tabs" :key="t.key" :text="tab.title" :value="t.key">
                <VariantsTable v-if="tab === 'variant'" />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>

<script setup>
import { Settings, Wand2 } from 'lucide-vue-next';
import { onMounted, provide, ref } from 'vue';
import VariantsTable from './VariantsTable.vue';
import { globalEventBus } from 'vue-toastification';

// Macros
defineEmits(['editVariantForm']);

// tabs
const tab = ref('variant');
const tabs = ref([
    {
        title: `Variants(${0})`,
        key: "variant",
    },
    {
        title: `Attributes(${0})`,
        key: "attribute",
    }
]);
const variantFormSheet = ref(false);
const isVariantEdit = ref(false);

// Providers
provide('variantFormSheet', variantFormSheet);
provide('isVariantEdit', isVariantEdit);

function closeVariantFormDialog() {
    isVariantEdit.value = false;
    variantFormSheet.value = false;
}
function editVariant() {
    isVariantEdit.value = true;
    variantFormSheet.value = true;
}

// Lifecycle
onMounted(() => {
    globalEventBus.on('editVariantForm', () => editVariant());
    globalEventBus.on('closeVariantForm', () => closeVariantFormDialog())
});

</script>

<style lang="scss" scoped></style>