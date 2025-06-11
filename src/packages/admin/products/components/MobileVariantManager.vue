<template>
    <v-card flat style="padding-inline: 0;" min-height="50vh">
        <v-card-title style="padding-inline: 0 !important;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <h4>Product Variants</h4>
                <div>
                    <v-btn elevation="1" class="rounded-lg mr-2 p-0" min-width="16" @click="openNewAttributeForm">
                        <Settings :size="16" />
                    </v-btn>
                    <v-btn elevation="1" class="rounded-lg" min-width="16" color="black">
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
                <AttributeTable v-if="tab === 'attribute'" />
            </v-tabs-window-item>
        </v-tabs-window>
        <div className="fixed bottom-6 right-6 z-(--floating-btn-z-index)">
            <v-btn className="h-14 w-14 rounded-full shadow-lg bg-secondary" @click="handleFloatingBtnClick">
                <Plus className="h-6 w-6" />
            </v-btn>
        </div>
    </v-card>
    <v-bottom-sheet v-model="variantFormSheet" scrollable>
        <v-card width="85%" class="mx-auto rounded-xl" style="padding-inline: 0 !important;">
            <v-card-text style="padding-inline: 0;">
                <VariantForm />
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="attributeFormSheet" scrollable>
        <v-card width="85%" class="mx-auto rounded-xl" style="padding-inline: 0 !important;" min-height="55vh">
            <v-card-text style="padding-inline: 0;">
                <AttributeForm />
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="variantFilterModalState" scrollable>
        <v-card width="100%" class="mx-auto rounded-xl" style="padding-inline: 0 !important;" min-height="40vh">
            <v-card-text style="padding-inline: 0;">
                <VariantFilterModal />
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
</template>

<script setup>
import { Settings, Wand2, Plus } from 'lucide-vue-next';
import { onMounted, provide, ref, watchEffect } from 'vue';
import VariantsTable from './VariantsTable.vue';
import { globalEventBus, useToast } from 'vue-toastification';
import VariantForm from './VariantForm.vue';
import AttributeTable from './AttributeTable.vue';
import AttributeForm from './AttributeForm.vue';
import useProduct from '@/composables/useProduct';
import VariantFilterModal from './VariantFilterModal.vue';

// Macros
defineEmits(['editVariantForm']);

const { getAttributeCount } = useProduct();

// tabs
const tab = ref('variant');
const tabs = ref([
    {
        title: `Variants(${0})`,
        key: "variant",
    },
    {
        title: `Attributes(${getAttributeCount.value || 0})`,
        key: "attribute",
    }
]);
const variantFormSheet = ref(false);
const isVariantEdit = ref(false);
const isAttributeEdit = ref(false);
const attributeFormSheet = ref(false);
const editableAttribute = ref({});
const variantFilterModalState = ref(false);

// Providers
provide('variantFormSheet', variantFormSheet);
provide('isVariantEdit', isVariantEdit);
provide('isAttributeEdit', isAttributeEdit);
provide('attributeFormSheet', attributeFormSheet);
provide('editableAttribute', editableAttribute);

function closeVariantFormDialog() {
    isVariantEdit.value = false;
    variantFormSheet.value = false;
    isAttributeEdit.value = false;
    attributeFormSheet.value = false;
}

function editVariant() {
    isVariantEdit.value = true;
    variantFormSheet.value = true;
}

function editAttribute(attr) {
    isAttributeEdit.value = true;
    attributeFormSheet.value = true;
    editableAttribute.value = attr;
}
function openNewAttributeForm() {
    isAttributeEdit.value = false;
    attributeFormSheet.value = true;
    editableAttribute.value = {};
}
function handleFloatingBtnClick() {
    switch (tab.value) {
        case 'variant': {
            isVariantEdit.value = false;
            variantFormSheet.value = true;
            break;
        };
        case 'attribute': {
            openNewAttributeForm();
            break;
        }
    }
}
function toggleVariantFilterModal(status) {
    variantFilterModalState.value = status;
}

function cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])), [[]])
}
function handleGenerateVariants() {
    if (attributes.length === 0) {
        useToast().info({
            title: "No attributes",
            description: "Please add attributes first.",
            variant: "destructive",
        });
        return
    }

    const combinations = cartesianProduct(
        attributes.map((attr) => attr.values.map((value) => ({ [attr.name]: value }))),
    )

    const newVariants = combinations
        .map((combo) => {
            const attrs = Object.assign({}, ...combo)
            const name = Object.entries(attrs)
                .map(([, value]) => `${value}`)
                .join(" / ")

            if (
                variants.some(
                    (v) =>
                        Object.entries(v.attributes).every(([key, value]) => attrs[key] === value) &&
                        Object.keys(v.attributes).length === Object.keys(attrs).length,
                )
            ) {
                return null
            }

            return {
                name: `Variant ${name}`,
                sku: `SKU-${Object.values(attrs).join("-")}`,
                price: 0,
                quantity: 0,
                attributes: attrs,
            }
        })
        .filter(Boolean)

    if (newVariants.length === 0) {
        useToast().info({
            title: "No new variants",
            description: "All combinations already exist.",
        })
        return
    }

    globalEventBus.emit('setVariants', newVariants);
    useToast().info({
        title: "Variants generated",
        description: `${newVariants.length} new variants created.`,
    })
}

// Lifecycle
onMounted(() => {
    globalEventBus.on('editVariantForm', () => editVariant());
    globalEventBus.on('closeVariantForm', () => closeVariantFormDialog());
    globalEventBus.on('triggerNewForm', () => handleFloatingBtnClick());
    globalEventBus.on('editAttribute', (attribute) => editAttribute(attribute));
    globalEventBus.on('toggleVariantFilterModal', (status) => toggleVariantFilterModal(status))
});


// Effects
watchEffect(() => {
    tabs.value = tabs.value.map((tab) => {
        if (getAttributeCount.value && tab.key === 'attribute') {
            tab.title = `Attributes(${getAttributeCount.value})`;
        }
        return tab;
    });
});
</script>

<style lang="scss" scoped></style>