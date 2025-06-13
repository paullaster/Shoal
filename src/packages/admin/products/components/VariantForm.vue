<template>
    <div class="w-full max-w-xl mx-auto pa-6 bg-white rounded-lg shadow-lg">
        <button @click="() => closeVariantForm()" aria-label="Close"
            class="absolute top-4 right-4 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black rounded-full">
            <XCircle />
        </button>
        <h2 class="text-xl font-semibold text-center mb-6" id="form-title">
            {{ isVariantEdit ? 'Edit Variant' : 'Add Variant' }}
        </h2>

        <form @submit.prevent="updateVariant" aria-labelledby="form-title">
            <!-- Variant Name -->
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Variant Name</label>
                <input type="text" id="name" v-model="form.name"
                    class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                    required aria-required="true" />
            </div>

            <!-- SKU -->
            <div class="mb-4">
                <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" id="sku" v-model="form.sku"
                    class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                    required aria-required="true" />
            </div>

            <!-- Price & Stock -->
            <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
                    <div class="relative mt-1">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">{{
                            currency.description }}</span>
                        <input type="number" id="price" v-model.number="form.price"
                            class="pl-16 pr-3 h-12 rounded-md w-full border border-gray-300 text-sm focus:ring-black focus:border-black"
                            required aria-required="true" min="0" />
                    </div>
                </div>

                <div>
                    <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
                    <input type="number" id="stock" v-model.number="form.stock"
                        class="mt-1 block w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:ring-black focus:border-black"
                        required aria-required="true" min="0" />
                </div>
            </div>

            <hr class="my-6 border-gray-200" />

            <!-- Attributes -->
            <div class="mb-12" v-if="getAttributes.length">
                <h3 class="text-sm font-semibold mb-2">Attributes</h3>
                <div class="space-y-8">
                    <v-autocomplete variant="outlined" v-for="(attribute) in getAttributes" :key="attribute.attributeId"
                        class="w-full rounded-xl" :placeholder="`Select ${attribute.name}`" :items="attribute.values"
                        @update:modelValue="(value) => handleAttributeChange(value)" clearable
                        @click:clear="(value) => handleRemoveAttribute(value)" auto-select-first item-props>
                        <template #label>
                            <label>
                                {{ attribute.name }}
                            </label>
                        </template>
                    </v-autocomplete>
                </div>
            </div>

            <!-- Submit -->
            <div>
                <button type="submit"
                    :class="[
                        buttonDisabled && 'disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50',
                        'w-full h-12 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2']"
                    aria-label="Update Variant" :disabled="!form.attributes.length">
                    {{ isVariantEdit ? 'Update Variant' : 'Add Variant' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import useProduct from '@/composables/useProduct'
import { XCircle } from 'lucide-vue-next'
import { computed, inject, reactive, ref, watch } from 'vue'
import { globalEventBus } from 'vue-toastification'

// Injections
const isVariantEdit = inject('isVariantEdit')

// Macros
// Props
defineProps({})

// Composables
const { getAttributes, getProduct, setProduct } = useProduct();

const form = reactive({
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    attributes: [],
})
const selectedAttributes = ref({

});
const currency = ref({
    description: 'KES',
});

const formValid = ref(false);

// computed
const buttonDisabled = computed(() => !formValid.value || !form.attributes.length);

function closeVariantForm() {
    globalEventBus.emit('closeVariantForm');
}

function updateVariant() {
    const prod = {
        ...getProduct.value,
        variants: [...getProduct.value.variants, { ...form }]
    }
    setProduct(prod);
    closeVariantForm();

}
function handleAttributeChange(value) {
    console.log(value);
    form.attributes.push(value);
}
function handleRemoveAttribute(value) {
    console.log(value);
    form.attributes = form.attributes.filter((attr) => attr.value !== value);
}
// effects
watch(
    () => getAttributes.value,
    () => {
        getAttributes?.value?.length &&
            getAttributes.value.forEach((attr) => {
                selectedAttributes.value[attr.attributeId] = ""
            });
    },
    {
        immediate: true,
        deep: true,
    }
);
watch(
    () => form,
    () => {
        let isValid = true;
        for (const prop in form) {
            if (!form[prop]) {
                isValid = false;
                break;
            }
        }
        formValid.value = isValid;
    },
    {
        deep: true,
        immediate: true,
    }
);
</script>
