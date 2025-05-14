<template>
  <v-row>
    <v-col cols="12">
      <v-list dense>
        <v-list-item>
          <v-list-item-title>Title:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.title }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Code:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.code }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Amount:</v-list-item-title>
          <v-list-item-subtitle>
            {{ discount.type === 'Percentage' ? `${discount.amount}%` : `$${discount.amount}` }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Type:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.type }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Usage Limit:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.usageLimit }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Status:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.status }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Start:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.startPublishing }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>End:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.endPublishing }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Created At:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.createdAt }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Updated At:</v-list-item-title>
          <v-list-item-subtitle>{{ discount.updatedAt }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  discount: { type: Object, required: true },
});
</script>