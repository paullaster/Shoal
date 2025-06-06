<template>
    <div
        class="variant-card bg-white rounded-xl shadow-md pa-4 w-full flex flex-col gap-3 font-sans border border-gray-100">
        <!-- Header -->
        <div class="variant-header flex justify-between items-start">
            <div>
                <div class="variant-title text-sm font-semibold text-gray-900">
                    {{ variant.name }}
                </div>
                <div class="variant-sku text-xs text-gray-500 mt-0.5">
                    {{ variant.sku }}
                </div>
            </div>
            <div class="variant-menu">
                <v-bottom-sheet v-model="sheet">
                    <template v-slot:activator="{ props: activatorProps }">
                        <div class="text-center p-0">
                            <v-btn v-bind="activatorProps" flat class="min-w-0 p-0 h-auto">
                                <MoreVertical :size="16" />
                            </v-btn>
                        </div>
                    </template>

                    <v-list>
                        <v-list-item v-for="action in cardActions" :key="action.title" :title="action.title"
                            @click="() => handleAction(action)">
                            <template #prepend>
                                <component :is="action.icon" class="w-5 h-5 text-gray-700 mr-2" />
                            </template>
                        </v-list-item>
                    </v-list>
                </v-bottom-sheet>
            </div>
        </div>

        <!-- Body -->
        <div class="variant-body flex justify-between items-center">
            <div class="variant-price text-base font-bold text-gray-900">
                KES{{ variant.price }}
            </div>
            <div>
                <v-chip color="error" text-color="white" class="text-xs font-medium px-2 py-1 rounded-full">
                    Stock: {{ variant.quantity }}
                </v-chip>
            </div>
        </div>

        <!-- Attributes -->
        <v-row>
            <v-col cols="6" v-for="(attribute, i) in variant.attributes" :key="attribute.id || i">
                <v-chip variant="outlined" color="black" class="vchip text-xs font-medium px-2 py-1 rounded-md">
                    {{ attribute.name }}: {{ attribute.value }}
                </v-chip>
            </v-col>
        </v-row>
    </div>
    <v-bottom-sheet v-model="variantFormSheet" scrollable>
        <v-card width="85%" class="mx-auto rounded-xl" style="padding-inline: 0 !important;">
            <v-card-text style="padding-inline: 0;">
                <VariantForm />
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
</template>

<script setup>
import { MoreVertical, Edit, Trash } from 'lucide-vue-next';
import VariantForm from './VariantForm.vue';
import { inject, ref } from 'vue';
import { globalEventBus } from 'vue-toastification';

// Injections
const variantFormSheet = inject('variantFormSheet');
// Macros
defineProps({
    variant: {
        type: Object
    }
});

const sheet = ref(false);

const cardActions = [
    {
        id: 1,
        title: 'Edit',
        icon: Edit,
        action: () => {
            globalEventBus.emit('editVariantForm')
        }
    },
    {
        id: 2,
        title: 'Delete',
        icon: Trash,
        action: () => {
            console.log('delete clicked');
        }
    }
];


function handleAction(action) {
    sheet.value = false;
    action['action']();
}
</script>

<style scoped></style>