<template>
  <div class="categories-section py-4 px-2 md:px-4">
    <div class="d-flex align-center justify-space-between mb-3 px-2">
      <h2 class="text-h6 font-weight-bold">Explore Menu</h2>
      <!-- Optional: 'View All' link could go here -->
    </div>
    
    <!-- Mobile/Tablet: Horizontal Scroll -->
    <ul class="d-flex flex-nowrap overflow-x-auto hide-scrollbar category-list pb-2 gap-4">
      <li v-for="category in categories" :key="category.categoryId" class="flex-shrink-0 text-center category-item">
        <RouterLink 
          :to="{ name: 'category', params: { category: category.categoryId } }"
          class="text-decoration-none d-flex flex-column align-center"
        >
          <div class="icon-wrapper d-flex align-center justify-center rounded-circle elevation-2 mb-2 transition-transform">
            <v-icon :color="category.color" size="28">{{ category.icon }}</v-icon>
          </div>
          <span class="text-caption font-weight-medium text-truncate" style="max-width: 80px;">
            {{ category.name }}
          </span>
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

<style scoped>
.category-list {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
  padding-left: 4px; /* subtle spacing */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.category-item {
  width: 80px; /* Fixed width for consistency */
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background-color: white;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.05);
}

.category-item:hover .icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>