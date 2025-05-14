<template>
  <v-form ref="form" v-model="valid" @submit.prevent="save">
    <v-text-field v-model="formData.title" label="Title" variant="outlined" density="compact"
      :rules="[v => !!v || 'Title is required']" required />
    <v-text-field v-model="formData.code" label="Code" variant="outlined" density="compact"
      :rules="[v => !!v || 'Code is required']" required class="mt-4" />
    <v-row>
      <v-col cols="6">
        <v-text-field v-model.number="formData.amount" label="Amount" type="number" variant="outlined" density="compact"
          :rules="[v => v > 0 || 'Amount must be greater than 0']" required />
      </v-col>
      <v-col cols="6">
        <v-select v-model="formData.type" :items="['Percentage', 'Fixed']" label="Type" variant="outlined"
          density="compact" :rules="[v => !!v || 'Type is required']" required />
      </v-col>
    </v-row>
    <v-text-field v-model.number="formData.usageLimit" label="Usage Limit" type="number" variant="outlined"
      density="compact" :rules="[v => v > 0 || 'Usage Limit must be greater than 0']" required class="mt-4" />
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="formData.startPublishing" label="Start Date" type="datetime-local" variant="outlined"
          density="compact" :rules="[v => !!v || 'Start Date is required']" required />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="formData.endPublishing" label="End Date" type="datetime-local" variant="outlined"
          density="compact" :rules="[v => !!v || 'End Date is required']" required />
      </v-col>
    </v-row>
    <v-select v-model="formData.status" :items="['Published', 'UnPublished']" label="Status" variant="outlined"
      density="compact" :rules="[v => !!v || 'Status is required']" required class="mt-4" />
    <v-row class="mt-6">
      <v-col cols="6">
        <v-btn color="grey" text block @click="$emit('cancel')">Cancel</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="pink" class="white--text" block type="submit">Save</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  discount: { type: Object, default: null },
});

const emit = defineEmits(['save', 'cancel']);

const valid = ref(false);
const formData = ref({
  id: null,
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
        id: null,
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

function save() {
  if (valid.value) {
    emit('save', { ...formData.value });
  }
}
</script>