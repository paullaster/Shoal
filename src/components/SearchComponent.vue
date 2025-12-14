<template>
  <section :class="['search-container w-full relative', onSearchPage]">
    <div class="search-input-wrapper px-0">
      <v-text-field
        v-model="term"
        placeholder="What are you craving today?"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="pill"
        density="comfortable"
        hide-details
        class="search-field"
        bg-color="grey-lighten-4"
        color="primary"
        base-color="transparent"
        clearable
        @focus="setSearchPage"
        @update:model-value="fetchSearchterm"
      >
        <template v-slot:prepend-inner>
          <v-icon color="primary" class="opacity-80">mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </div>
    
    <!-- Results Dropdown -->
    <transition name="fade-slide">
      <div class="search-page-result absolute top-full left-0 right-0 z-50 mt-2 px-1" v-if="results.length">
        <v-card class="rounded-xl overflow-hidden border border-gray-100" elevation="6">
          <v-list lines="two" class="py-0">
            <v-list-subheader class="text-caption font-weight-bold text-uppercase text-grey-darken-1 px-4 py-2 bg-grey-lighten-5">
              Suggestions
            </v-list-subheader>
            
            <template v-for="(result, index) in results" :key="result.document.id">
              <v-divider v-if="index > 0" class="border-opacity-50"></v-divider>
              <v-list-item
                :title="result.document.name"
                :subtitle="result.document.description"
                class="search-result-item py-3 transition-colors hover:bg-grey-lighten-5"
                @click="navigateToPage(result.document)"
                link
              >
                <template v-slot:prepend>
                  <v-avatar size="56" rounded="lg" class="mr-3 bg-grey-lighten-4">
                    <v-img 
                      :src="result.document.Images[0].url" 
                      cover 
                      alt="Product Image"
                      class="rounded-lg"
                    ></v-img>
                  </v-avatar>
                </template>
                
                <template v-slot:title>
                  <span class="text-body-1 font-weight-bold text-grey-darken-3">{{ result.document.name }}</span>
                </template>
                
                <template v-slot:append>
                  <v-icon size="small" color="grey-lighten-1">mdi-arrow-top-right</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { useSearch } from '@/store'
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// ROUTES & ROUTER
const route = useRoute()
const router = useRouter()
const { name } = route

// APP STORE
const searchStore = useSearch()
const { results } = storeToRefs(searchStore)

// APP STATE
const term = ref('')

// COMPUTED
const onSearchPage = computed(() =>
  route.name === 'search' ? 'search-page-wrapper onsearch-page' : 'search-page-wrapper'
)

function setSearchPage() {
  // If we are on the landing page, redirect to search page immediately on focus
  if (route.name === 'landing') {
    router.push({ name: 'search' })
  }
}

function fetchSearchterm() {
  try {
    searchStore.search(term.value);
  } catch (error) {
    useToast().error(error.message || 'error fetching search term')
  }
}

function navigateToPage (document) {
    try {
        router.push({
            name: 'productDetails',
            params: {productId: stringToBase64AndReverse.toBase64String(document.pid), category: stringToBase64AndReverse.toBase64String(document.category)}
        })
    } catch (error) {
        useToast().error(error.message || 'error navigating to page')
    }
}
</script>

<style scoped>
.search-field :deep(.v-field__outline__start),
.search-field :deep(.v-field__outline__end) {
  border-color: transparent !important; /* Remove default outlined borders for cleaner look */
}

.search-field :deep(.v-field) {
  box-shadow: none !important;
  transition: all 0.2s ease;
}

/* Add a subtle ring on focus to support accessibility and focus state without heavy borders */
.search-field :deep(.v-field--focused) {
  background-color: white !important;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2) !important;
}

.search-field :deep(.v-field__input) {
  font-size: 0.95rem;
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.onsearch-page {
  /* specific styles for when on search page if needed */
}
</style>