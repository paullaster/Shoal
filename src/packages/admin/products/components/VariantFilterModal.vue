<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center" @keydown.esc="closeModal" role="dialog"
        aria-modal="true" aria-labelledby="filter-modal-title">
        <div class="bg-white rounded-md w-full max-w-xs mx-4 pa-4 relative focus:outline-none" tabindex="-1"
            ref="modalRef">
            <!-- Close Button -->
            <button @click="() => toggleVariantFilter(false)"
                class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close filter modal">
                <X :size="16" />
            </button>

            <!-- Modal Title -->
            <h2 id="filter-modal-title" class="text-center text-lg font-semibold text-gray-900 mb-4">
                Filter by Attribute
            </h2>

            <!-- Filter Options -->
            <div class="space-y-2">
                <button v-for="(variant, index) in variants" :key="variant" @click="selectVariant(variant)" :class="[
                    'w-full px-4 py-2 rounded-md border text-left font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4',
                    selectedVariant === variant
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-100',
                ]" :aria-pressed="selectedVariant === variant">
                    {{ variant }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { X } from 'lucide-vue-next'
import { globalEventBus } from 'vue-toastification'

const variants = ['All Variants', 'Red', 'Blue', 'Black']
const selectedVariant = ref('All Variants')
const modalRef = ref(null)

function toggleVariantFilter(status) {
    globalEventBus.emit('toggleVariantFilterModal', status);
}

const selectVariant = (variant) => {
    selectedVariant.value = variant
    console.log('Selected:', variant)
}

// Trap focus inside modal
const trapFocus = (e) => {
    const focusable = modalRef.value?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
        }
    }
}

onMounted(() => {
    nextTick(() => modalRef.value?.focus())
    window.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
    window.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
/* Optional: Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
}
</style>
