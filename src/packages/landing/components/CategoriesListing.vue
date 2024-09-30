<template>
  <div class="categories">
    <ul>
      <li v-for="category in categories" :key="category.cid">
        <router-link :to="{ name: 'category', params: { category: category.cid } }">
          <img :src="category.Images[0].url" alt="category" />
          <span>{{ category.description }}</span>
        </router-link>
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