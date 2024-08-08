<template>
  <HeaderComponent v-if="showHeader"/>
  <RouterView />
</template>
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { ref, watch } from 'vue';


// ROUTES
const route = useRoute();

const showHeader = ref(null);
// WATCH
watch(
  () =>route,
  (route) => {
  if (route.name === 'auth') {
    return showHeader.value = false;
  } 
  if (route.name === 'search'){
    return showHeader.value = false;
  }else {
    return showHeader.value = true;
  }
}, {deep: true, immediate: true});

</script>

<style scoped>
</style>
