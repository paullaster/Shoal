<template>
  <main class="auth-wrapper min-h-screen bg-grey-lighten-5 d-flex align-center justify-center py-10 px-4">
    <v-card class="auth-card w-full max-w-md rounded-xl overflow-hidden" elevation="0" border>
      <!-- Navigation Header -->
      <div class="d-flex align-center justify-space-between px-4 pt-4">
        <v-btn icon variant="text" color="grey-darken-1" @click="() => router.back()">
          <v-icon size="24">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="text-caption font-weight-bold text-uppercase text-grey">Login / Sign Up</div>
        <div style="width: 40px"></div> <!-- Spacer for centering -->
      </div>

      <div class="px-6 pb-8 pt-2 text-center">
        <!-- Logo -->
        <div class="mb-6 d-flex justify-center">
          <LogoComponent width="120px" @click="() => router.push({ name: 'landing' })"
            class="cursor-pointer hover-scale" />
        </div>

        <!-- Intro -->
        <h1 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">Welcome to Noels</h1>
        <p class="text-body-2 text-grey-darken-1 mb-8">
          Fresh L.Victoria food and local favorites, delivered.
        </p>

        <!-- Login Form -->
        <v-form ref="customerLogin" @submit.prevent="checkUser">
          <div class="mb-6 text-left">
            <label class="text-caption font-weight-bold text-grey-darken-2 ml-1 mb-1 d-block">Email or Phone
              Number</label>
            <v-text-field v-model="formData.username" placeholder="e.g. john@example.com or +254..." variant="outlined"
              rounded="pill" density="comfortable" bg-color="grey-lighten-5" color="primary" :rules="rules.username"
              hide-details="auto">
              <template v-slot:prepend-inner>
                <v-icon color="grey" size="small" class="ml-2">mdi-account-outline</v-icon>
              </template>
            </v-text-field>
          </div>

          <v-btn @click="checkUser" color="primary" block rounded="pill" size="x-large" elevation="4"
            class="font-weight-bold mb-8 text-capitalize tracking-wide">
            Continue
          </v-btn>
        </v-form>

        <!-- Divider -->
        <div class="d-flex align-center mb-8">
          <v-divider class="flex-grow-1"></v-divider>
          <span class="mx-4 text-caption text-grey">OR CONTINUE WITH</span>
          <v-divider class="flex-grow-1"></v-divider>
        </div>

        <!-- Social Login -->
        <div class="social-login-grid d-flex flex-column gap-3">
          <v-btn block rounded="pill" variant="outlined" color="grey-lighten-1" class="text-grey-darken-2" height="48">
            <v-img :src="googleIcon" width="20" height="20" class="mr-3"></v-img>
            <span class="font-weight-medium">Google</span>
          </v-btn>

          <v-btn block rounded="pill" variant="outlined" color="grey-lighten-1" class="text-grey-darken-2" height="48">
            <v-icon color="#1877F2" class="mr-3">mdi-facebook</v-icon>
            <span class="font-weight-medium">Facebook</span>
          </v-btn>

          <!-- Hidden Instagram for now to clean up UI, or keep if essential -->
        </div>

        <!-- Terms -->
        <div class="mt-8 text-caption text-grey text-center px-4" style="line-height: 1.4;">
          By continuing, you agree to our
          <a href="#" class="text-primary font-weight-bold text-decoration-none">Terms of Service</a>
          and
          <a href="#" class="text-primary font-weight-bold text-decoration-none">Privacy Policy</a>.
        </div>
      </div>
    </v-card>
  </main>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue'
import { useAuth } from '@/store';
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { globalEventBus, useToast } from 'vue-toastification';
import googleIcon from "@/assets/images/google.svg";

const router = useRouter();
const route = useRoute();

// STORES
const authStore = useAuth();

// COMPONENT STATE
const customerLogin = ref(null);
const formData = ref({
  username: ''
});


// HOOKS
onMounted(() => {
  globalEventBus.on("set-otp-screen", (payload) => {
    const uniqueCode = `${payload.username}:${payload.type}:${payload.loginType}:${payload.id}:${payload.purpose}`;
    router.push({ name: 'verifyAccount', params: { uniquCode: btoa(uniqueCode) }, query: { ...route.query } });
  })
  globalEventBus.on("user-credentials", (payload) => {
    const uniqueCode = `${payload.email}:${payload.phoneNumber}:${payload.type}:${payload.id}`;
    router.push({ name: 'userCredentials', params: { uniquCode: btoa(uniqueCode) }, query: { ...route.query } });
  })
});


// COMPUTED
const rules = computed(() => {
  return {
    username: [
      v => !!v || 'Username is required',
      v => /^\S+@\S+\.\S+$/.test(v) || /^\+\d{1,4}\s\d{1,15}$/.test(v) || 'Invalid phone number or email'
    ],
    password: [
      v => !!v || 'Password is required',
      v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) ||
        `Password must be at least 8 characters long
       and contain at least one uppercase letter, 
       one lowercase letter, one number, and one special character`
    ]
  }
})

// COMPONENT METHODS
async function checkUser() {
  try {
    const { valid } = await customerLogin.value.validate();
    if (!valid) {
      return useToast().error("Please make sure you're providing a valid email address or phone number");
    }
    const payload = {
      username: formData.value.username,
      type: 'customer',
    };
    authStore.getUser(payload);
  } catch (error) {
    useToast().error("We had an error, please try again later!");
  }
}
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
</style>
