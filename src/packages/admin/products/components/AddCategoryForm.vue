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
                <v-autocomplete v-model="category.icon" :items="iconOptions" label="Icon" variant="outlined"
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
                </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
                <v-color-picker v-model="category.color" mode="hex" hide-inputs class="mb-4" :rules="rules.color" />
            </v-col>
            <v-col cols="12">
                <v-switch v-model="category.isActive" label="Active" color="primary" hide-details class="mb-4" />
            </v-col>
        </v-row>

        <div class="mt-4"
            style="width: 100%; display: flex !important; flex-direction: row !important; justify-content: space-between !important;">
            <v-btn variant="tonal" @click="$emit('cancel')">
                Cancel
            </v-btn>
            <v-btn class="primary-gradient-button" type="submit" :loading="saving" :disabled="saving">
                <v-icon start>mdi-content-save</v-icon>
                Save
            </v-btn>
        </div>
    </v-form>
</template>

<script setup>
import useGlobal from '@/composables/useGlobal';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

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

// Compsabled
const { iconOptions } = useGlobal();

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


async function saveCategory() {
    try {
        const { valid } = await form.value.validate();
        if (!valid) {
            useToast().warning('Make sure you have added all the required fields!.')
            return;
        };

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