<template>
  <section :class="onSearchPage">
    <div class="search-input-wrapper">
      <v-icon>mdi-magnify</v-icon>
      <input
        type="search"
        placeholder="search our products"
        @focus="setSearchPage"
        @input="fetchSearchterm"
        v-model="term"
      />
    </div>
    <div class="search-page-result" v-if="results.length">
      <v-list lines="two">
        <v-list-item
          v-for="result in results"
          :key="result.document.id"
          :title="result.document.name"
          :subtitle="result.document.description"
          class="search-result-item"
          @click="navigateToPage(result.document)"
        >
          <template v-slot:prepend>
            <v-avatar >
              <v-img :src="result.document.Images[0].url"></v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </div>
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
  if (name === 'landing') {
    console.log('setSearchPage')
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