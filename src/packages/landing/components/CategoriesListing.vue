<template>
  <div class="categories">
    <ul>
      <li v-for="category in categories" :key="category.cid">
        <router-link :to="{ name: 'category', params: { category: category.cid } }">
          <img :src="category.image" alt="category" />
          <span>{{ category.description }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    cid: 'Fried',
    description: 'Fried Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'Fried2',
    description: 'This is Fried Two Pane Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'Fried3',
    description: 'Fried Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'Fried4',
    description: 'Fried Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'Fried6',
    description: 'Fried Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'Fried5',
    description: 'Fried Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'Fried7',
    description: 'Fried Foods',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  },
  {
    cid: 'FriedLastly',
    description: 'Fried Lastly Food Today',
    image: 'http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
  }
])
</script>

<style lang="scss" scoped>
</style>