<script setup>
import { RouterView } from 'vue-router'
import MenusComponentVue from '@/components/MenusComponent.vue'
</script>

<template>
  <RouterView />
  <header class="mobile-view-menus">
    <MenusComponentVue />
  </header>
</template>

<style scoped>
</style>
