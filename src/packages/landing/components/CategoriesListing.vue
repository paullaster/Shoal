<template>
  <div class="categories">
    <ul>
      <li v-for="category in categories" :key="category.categoryId">
        <RouterLink :to="{ name: 'category', params: { category: category.categoryId } }">
          <v-icon :color="category.color">{{ category.icon }}</v-icon>
          <span>{{ category.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useSetupStore } from '@/store';
import { storeToRefs } from 'pinia';


const setupStore = useSetupStore();
const { categories } = storeToRefs(setupStore);

</script>