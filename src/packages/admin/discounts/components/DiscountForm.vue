<template>
  <v-form ref="form" v-model="valid" @submit.prevent="save" class="discount-form">
    <v-text-field v-model="formData.title" label="Title" variant="outlined" density="comfortable"
      :rules="[v => !!v || 'Title is required']" required class="premium-input" />
    <v-text-field v-model="formData.code" label="Code" variant="outlined" density="comfortable"
      :rules="[v => !!v || 'Code is required']" required class="premium-input mt-4" />
    <v-row class="my-1">
      <v-col cols="6">
        <v-text-field v-model.number="formData.amount" label="Amount" type="number" variant="outlined"
          density="comfortable" :rules="[v => v > 0 || 'Amount must be greater than 0']" required
          class="premium-input" />
      </v-col>
      <v-col cols="6">
        <v-select v-model="formData.type" :items="['Percentage', 'Fixed']" label="Type" variant="outlined"
          density="comfortable" :rules="[v => !!v || 'Type is required']" required class="premium-input" />
      </v-col>
    </v-row>
    <v-text-field v-model.number="formData.usageLimit" label="Usage Limit" type="number" variant="outlined"
      density="comfortable" :rules="[v => v > 0 || 'Usage Limit must be greater than 0']" required
      class="premium-input mt-4" />
    <v-row class="my-1">
      <v-col cols="12">
        <v-text-field v-model="formData.startPublishing" label="Start Date" type="datetime-local" variant="outlined"
          density="comfortable" :rules="[v => !!v || 'Start Date is required']" required class="premium-input" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="formData.endPublishing" label="End Date" type="datetime-local" variant="outlined"
          density="comfortable" :rules="[v => !!v || 'End Date is required']" required class="premium-input" />
      </v-col>
    </v-row>
    <v-autocomplete v-model="formData.status" :items="['Published', 'UnPublished']" label="Status" variant="outlined"
      density="comfortable" :rules="[v => !!v || 'Status is required']" required class="premium-input mt-4" />
    <v-row class="mt-6">
      <v-col cols="6">
        <v-btn color="grey-darken-1" variant="tonal" block
          @click="() => ($emit('closeQuickDiscountDialog'), $emit('cancel'))" class="cancel-btn">
          <v-icon start>mdi-close</v-icon>
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="primary" block type="submit" class="save-btn" :disabled="!valid">
          <v-icon start>mdi-check</v-icon>
          Save
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { useDiscount } from '@/composables/useDiscount';
import { ref, watch } from 'vue';
import { globalEventBus, useToast } from 'vue-toastification';

const props = defineProps({
  discount: { type: Object, default: null },
  editMode: { type: Boolean, default: false },
});

const emit = defineEmits(['save', 'cancel', 'closeQuickDiscountDialog']);

// Composables
const { createDiscount } = useDiscount();

const valid = ref(false);
const formData = ref({
  title: '',
  code: '',
  amount: 0,
  type: 'Percentage',
  usageLimit: 0,
  startPublishing: '',
  endPublishing: '',
  status: 'UnPublished',
});

watch(
  () => props.discount,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal };
    } else {
      formData.value = {
        title: '',
        code: '',
        amount: 0,
        type: 'Percentage',
        usageLimit: 0,
        startPublishing: '',
        endPublishing: '',
        status: 'UnPublished',
      };
    }
  },
  { immediate: true }
);

async function save() {
  if (valid.value) {
    if (props.editMode) {
      console.log('values of edit mode: ', props.editMode);
      emit('save', { ...formData.value });
    } else {
      try {
        await createDiscount({ ...formData.value });
        useToast().success('Discount created successfully');
        globalEventBus.emit('closeDiscountForm');
      } catch (error) {
        useToast().error(error.message);
      }
    }
  }
}
</script>

<style scoped>
.discount-form {
  padding: 2px;
}

.premium-input {
  border-radius: 12px !important;
  background: rgba(245, 247, 255, 0.9) !important;
  border: 1px solid rgba(123, 97, 255, 0.12) !important;
  transition: all 0.3s ease;
}

.premium-input:hover {
  background: #fff !important;
  border-color: rgba(123, 97, 255, 0.2) !important;
}

/* .premium-input:focus-within {
  background: #fff !important;
  border-bottom-color: #7b61ff !important;
  
} */

.cancel-btn {
  height: 44px !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.cancel-btn:hover {
  background: rgba(123, 97, 255, 0.08) !important;
  transform: translateY(-2px);
}

.save-btn {
  height: 44px !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #7b61ff 0%, #ff6f91 100%) !important;
  color: white !important;
  transition: all 0.3s ease !important;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(123, 97, 255, 0.25) !important;
}

.save-btn:disabled {
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.5) 0%, rgba(255, 111, 145, 0.5) 100%) !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .premium-input {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }

  .premium-input:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }

  .premium-input:focus-within {
    background: rgba(255, 255, 255, 0.15) !important;
    /* border-bottom-color: #7b61ff !important; */
    /* box-shadow: 0 2px 12px rgba(123, 97, 255, 0.15) !important; */
  }

  .cancel-btn:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }
}

/* High contrast mode */
@media (forced-colors: active) {

  .premium-input,
  .cancel-btn,
  .save-btn {
    border: 2px solid CanvasText !important;
  }

  .save-btn {
    background: Canvas !important;
    color: CanvasText !important;
  }
}
</style>