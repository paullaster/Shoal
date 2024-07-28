<template>
  <div class="section-component-heading">
    <h1>{{ history }}</h1>
    <v-btn  variant="text" @click="fetchHistory((history.split(' ')).join(''))">SEE ALL</v-btn>
  </div>
</template>

<script setup>
defineProps({
    history: {
      type: String,
      required: true
    }
});

function fetchHistory(type) {
 console.log(type);
}
</script>

<style lang="scss" scoped>
</style>