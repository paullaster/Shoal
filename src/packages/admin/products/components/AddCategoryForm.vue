<template>
    <v-form ref="form" @submit.prevent="saveCategory">
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="category.name" label="Category Name" :rules="rules.name" variant="outlined"
                    density="comfortable" class="mb-4" />
            </v-col>
            <v-col cols="12">
                <v-textarea v-model="category.description" label="Description" :rules="rules.description"
                    variant="outlined" density="comfortable" class="mb-4" rows="3" />
            </v-col>
            <v-col cols="12" md="6">
                <v-select v-model="category.icon" :items="iconOptions" label="Icon" variant="outlined"
                    density="comfortable" class="mb-4" :rules="rules.icon">
                    <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                            <template v-slot:prepend>
                                <v-icon :icon="item.raw" />
                            </template>
                            <v-list-item-title>{{ item.raw }}</v-list-item-title>
                        </v-list-item>
                    </template>
                    <template v-slot:selection="{ item }">
                        <v-icon :icon="item.raw" class="mr-2" />
                        {{ item.raw }}
                    </template>
                </v-select>
            </v-col>
            <v-col cols="12" md="6">
                <v-color-picker v-model="category.color" mode="hex" hide-inputs class="mb-4" :rules="rules.color" />
            </v-col>
            <v-col cols="12">
                <v-switch v-model="category.isActive" label="Active" color="primary" hide-details class="mb-4" />
            </v-col>
        </v-row>

        <div class="d-flex justify-end gap-2 mt-4">
            <v-btn variant="tonal" @click="$emit('cancel')">
                Cancel
            </v-btn>
            <v-btn color="primary" type="submit" :loading="saving">
                <v-icon start>mdi-content-save</v-icon>
                Save Category
            </v-btn>
        </div>
    </v-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['save', 'cancel']);

const form = ref(null);
const saving = ref(false);

const category = ref({
    name: '',
    description: '',
    icon: 'mdi-folder',
    color: '#7b61ff',
    isActive: true,
    ...props.initialData
});

const rules = {
    name: [
        v => !!v || 'Name is required',
        v => v.length <= 50 || 'Name must be less than 50 characters'
    ],
    description: [
        v => v.length <= 200 || 'Description must be less than 200 characters'
    ],
    icon: [
        v => !!v || 'Icon is required'
    ],
    color: [
        v => !!v || 'Color is required'
    ]
};

const iconOptions = [
    'mdi-folder',
    'mdi-folder-outline',
    'mdi-folder-multiple',
    'mdi-folder-multiple-outline',
    'mdi-folder-plus',
    'mdi-folder-plus-outline',
    'mdi-folder-star',
    'mdi-folder-star-outline',
    'mdi-folder-heart',
    'mdi-folder-heart-outline',
    'mdi-folder-lock',
    'mdi-folder-lock-outline',
    'mdi-folder-cog',
    'mdi-folder-cog-outline',
    'mdi-folder-settings',
    'mdi-folder-settings-outline',
    'mdi-folder-sync',
    'mdi-folder-sync-outline',
    'mdi-folder-search',
    'mdi-folder-search-outline',
    'mdi-folder-download',
    'mdi-folder-download-outline',
    'mdi-folder-upload',
    'mdi-folder-upload-outline',
    'mdi-folder-move',
    'mdi-folder-move-outline',
    'mdi-folder-copy',
    'mdi-folder-copy-outline',
    'mdi-folder-remove',
    'mdi-folder-remove-outline',
    'mdi-folder-open',
    'mdi-folder-open-outline',
    'mdi-folder-zip',
    'mdi-folder-zip-outline',
    'mdi-folder-alert',
    'mdi-folder-alert-outline',
    'mdi-folder-check',
    'mdi-folder-check-outline',
    'mdi-folder-clock',
    'mdi-folder-clock-outline',
    'mdi-folder-cancel',
    'mdi-folder-cancel-outline',
    'mdi-folder-edit',
    'mdi-folder-edit-outline',
    'mdi-folder-key',
    'mdi-folder-key-outline',
    'mdi-folder-marker',
    'mdi-folder-marker-outline',
    'mdi-folder-minus',
    'mdi-folder-minus-outline',
    'mdi-folder-network',
    'mdi-folder-network-outline',
    'mdi-folder-off',
    'mdi-folder-off-outline',
    'mdi-folder-pound',
    'mdi-folder-pound-outline',
    'mdi-folder-question',
    'mdi-folder-question-outline',
    'mdi-folder-refresh',
    'mdi-folder-refresh-outline',
    'mdi-folder-remove',
    'mdi-folder-remove-outline',
    'mdi-folder-restore',
    'mdi-folder-restore-outline',
    'mdi-folder-table',
    'mdi-folder-table-outline',
    'mdi-folder-text',
    'mdi-folder-text-outline',
    'mdi-folder-wrench',
    'mdi-folder-wrench-outline'
];

async function saveCategory() {
    try {
        const { valid } = await form.value.validate();
        if (!valid) return;

        saving.value = true;
        emit('save', { ...category.value });
    } catch (error) {
        console.error('Error saving category:', error);
    } finally {
        saving.value = false;
    }
}

onMounted(() => {
    if (props.initialData.cid) {
        // If editing, load the category data
        category.value = { ...props.initialData };
    }
});
</script>

<style scoped>
.v-color-picker {
    border-radius: 8px;
    overflow: hidden;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .v-color-picker {
        background: #1a1a1a;
    }
}

/* Accessibility */
:deep(.v-form) {
    outline: none;
}

:deep(.v-form:focus-visible) {
    outline: 2px solid #7b61ff;
    outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
    .v-color-picker {
        border: 2px solid CanvasText;
    }
}
</style>