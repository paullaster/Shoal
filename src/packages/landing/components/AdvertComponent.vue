<template>
  <div class="hero-section">
    <v-carousel
      cycle
      height="400"
      hide-delimiters
      show-arrows="hover"
      interval="6000"
      class="rounded-xl overflow-hidden shadow-lg mt-2"
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
        :src="slide.image"
        cover
        class="hero-slide"
      >
        <div class="d-flex fill-height align-center justify-start px-4 px-md-10 gradient-overlay">
          <div class="text-content text-white" style="max-width: 600px;">
            <div class="text-overline mb-1 font-weight-bold text-yellow-lighten-2 tracking-widest text-uppercase">
              {{ slide.overline }}
            </div>
            <h1 class="text-h5 text-md-h3 font-weight-bold mb-2 leading-tight">
              {{ slide.title }}
            </h1>
            <p class="text-body-2 text-md-body-1 mb-4 font-weight-light opacity-90">
              {{ slide.subtitle }}
            </p>
            <v-btn
              color="primary"
              size="large"
              rounded="pill"
              elevation="4"
              class="px-6 font-weight-bold"
              @click="handleCta"
            >
              Order Now
              <v-icon end icon="mdi-arrow-right" class="ml-2"></v-icon>
            </v-btn>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Assets
import fishImage from '@/assets/images/display_fish.jpeg';
import fishImage2 from '@/assets/images/display_fish2.webp';
// Using the path relative to the alias or file structure. 
// Note: The file name is long, let's try to reference it carefully or use the fish ones for safety if the long name is risky to import directly without rename.
// I will stick to the fish images for now to ensure safety, and maybe the fish3.
import fishImage3 from '@/assets/images/display_fish3.webp';

const router = useRouter();

const slides = ref([
  {
    image: fishImage,
    overline: 'Fresh Catch Daily',
    title: 'Savor the Taste of the Ocean',
    subtitle: 'Expertly prepared fresh fish, delivered piping hot to your doorstep. Experience the finest culinary delight.',
  },
  {
    image: fishImage2,
    overline: 'Authentic Flavors',
    title: 'Traditional Dishes, Modern Comfort',
    subtitle: 'Enjoy our signature Mboga Kienyeji and other local favorites, cooked with love and tradition.',
  },
  {
    image: fishImage3,
    overline: 'Fast Delivery',
    title: 'Hungry? We’re on Our Way',
    subtitle: 'Order now and track your meal in real-time. Satisfaction guaranteed with every bite.',
  }
]);

function handleCta() {
  // Ideally navigate to product listing or specific category
  // router.push({ name: 'products' }); 
  console.log('Navigate to order');
}
</script>

<style scoped>
.hero-section {
  position: relative;
}

.gradient-overlay {
  background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%);
}

.text-content {
  animation: fadeUp 1s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
  