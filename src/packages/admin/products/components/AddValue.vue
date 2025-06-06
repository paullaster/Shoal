<template>
    <v-dialog v-model="isOpen" max-width="500">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>Add Attribute</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="isOpen = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="py-4">
                <div class="space-y-4">
                    <div class="space-y-2">
                        <v-label for="attribute-name-dialog">Attribute Name</v-label>
                        <v-text-field id="attribute-name-dialog" v-model="name"
                            placeholder="e.g., Size, Color, Material" variant="outlined" density="comfortable"
                            hide-details :error-messages="nameError" @input="nameError = ''"></v-text-field>
                    </div>

                    <div class="space-y-2">
                        <v-label for="attribute-values-dialog">Values</v-label>
                        <div class="d-flex gap-2">
                            <v-text-field id="attribute-values-dialog" v-model="currentValue"
                                placeholder="e.g., Small, Red, Cotton" variant="outlined" density="comfortable"
                                hide-details @keydown.enter.prevent="handleAddValue"></v-text-field>
                            <v-btn @click="handleAddValue" color="primary" size="default">
                                Add
                            </v-btn>
                        </div>
                        <p v-if="values.length === 0" class="text-sm text-muted-foreground">
                            Add at least one value for this attribute
                        </p>
                    </div>

                    <div v-if="values.length > 0" class="d-flex flex-wrap ga-2 mt-2">
                        <v-chip v-for="value in values" :key="value" closable @click:close="handleRemoveValue(value)"
                            color="secondary" label>
                            {{ value }}
                        </v-chip>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions class="justify-end px-4 pb-4">
                <v-btn color="primary" variant="flat" :disabled="!name.trim() || values.length === 0"
                    @click="handleSave">
                    Save Attribute
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'


const props = defineProps()
const emit = defineEmits(['update:open', 'save'])

const isOpen = computed({
    get: () => props.open,
    set: (val) => emit('update:open', val),
})

const name = ref('')
const currentValue = ref('')
const values = ref([])
const nameError = ref('')

watch(
    () => props.open,
    (newVal) => {
        if (newVal) {
            // Reset form when dialog opens
            name.value = ''
            currentValue.value = ''
            values.value = []
            nameError.value = ''
        }
    },
)

const handleAddValue = () => {
    if (!currentValue.value.trim()) return
    if (values.value.includes(currentValue.value.trim())) return

    values.value.push(currentValue.value.trim())
    currentValue.value = ''
}

const handleRemoveValue = (value) => {
    values.value = values.value.filter((v) => v !== value)
}

const handleSave = () => {
    if (!name.value.trim()) {
        nameError.value = 'Attribute name is required'
        return
    }

    if (props.existingAttributes.includes(name.value.trim())) {
        nameError.value = 'An attribute with this name already exists'
        return
    }

    if (values.value.length === 0) {
        // Optionally show an error or toast for no values
        return
    }

    emit('save', {
        name: name.value.trim(),
        values: values.value,
    })

    isOpen.value = false
}
</script>

<style scoped>
.text-muted-foreground {
    color: #64748b;
    /* Tailwind gray-500 or similar */
}

.text-destructive {
    color: #ef4444;
    /* Tailwind red-500 or similar */
}

.bg-secondary {
    background-color: #e2e8f0;
    /* Tailwind gray-200 or similar */
}

.text-secondary-foreground {
    color: #1e293b;
    /* Tailwind slate-800 or similar */
}
</style>
