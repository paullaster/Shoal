<template>
  <v-container fluid class="advert-container">
    <!-- Full-Width Hero Section -->
    <v-carousel height="500px" cycle show-arrows="hover" hide-delimiter-background>
      <v-carousel-item v-for="(item, i) in featuredProducts" :key="i">
        <v-sheet height="100%" class="advert-hero d-flex align-center justify-center" elevation="0">
          <v-row class="text-center white--text">
            <v-col cols="12">
              <div
                style="
                  background-color: white;
                  width: max-content;
                  margin: auto auto;
                  padding-inline: 0.8rem;
                  border-radius: 0.4rem;
                "
              >
                <h1 class="display-1 font-weight-bold">Savor Freshness, Delivered!</h1>
                <h3 class="subtitle-1 mb-5">Order now and enjoy exclusive offers</h3>
              </div>
              <v-btn class="cta-btn" color="yellow darken-3" large elevation="12" @click="orderNow">
                Order Now & Get 20% Off!
              </v-btn>
            </v-col>
            <v-chip
              color="pink"
              text-color="white"
              large
              class="promo-timer"
              style="background-color: white; position: absolute; bottom: 2%; left: 25%"
            >
              Limited Offer! Only <span>{{ timeLeft }}</span> left
            </v-chip>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>
  
  <script setup>
import { ref } from 'vue'

// COMPONENT VARIABLE
const timeLeft = ref('24:00:00')
const featuredProducts = ref([
  {
    name: 'Grilled Chicken Deluxe',
    description: 'Succulent chicken served with a side of fresh veggies.',
    image: 'https://your-image-link.com/chicken.jpg'
  },
  {
    name: 'Veggie Pizza',
    description: 'A delicious mix of fresh vegetables on a crispy base.',
    image: 'https://your-image-link.com/pizza.jpg'
  },
  {
    name: 'Sushi Platter',
    description: 'Freshly prepared sushi with the finest ingredients.',
    image: 'https://your-image-link.com/sushi.jpg'
  }
])
function orderNow() {
  // Implement order functionality
  alert('Redirecting to the order page...')
}
</script>
  
  <style scoped>
.advert-container {
  color: #f5f5f5;
  padding: 20px;
}

.advert-hero {
  background-image: url('../../../assets/images/display_fish.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.cta-btn:hover {
  transform: scale(1.1);
  transition: all 0.3s ease;
}

.promo-timer {
  font-size: 18px;
  font-weight: bold;
}

.dish-img {
  max-height: 200px;
  object-fit: cover;
}
</style>
  