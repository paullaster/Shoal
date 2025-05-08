<template>
  <main class="auth-wrapper">
    <section class="btn-section">
      <article class="navigation-btn">
        <v-btn variant="text" @click="() => router.back()">
          <v-icon size="30">mdi-keyboard-backspace</v-icon>
        </v-btn>
      </article>
    </section>
    <section class="logo-section">
      <article class="logo">
        <LogoComponent width="100px" @click="() => router.push({ name: 'landing' })" />
      </article>
    </section>
    <section class="auth-intro">
      <article>
        <p>Welcome to Noels Fish Delivery</p>
      </article>
    </section>
    <section class="auth-content">
      <!-- Login form -->
      <article class="form-container">
        <p>Type your email or phone number to login or create an account</p>
        <!-- Form -->
        <v-form ref="customerLogin">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Email or Phone Number" v-model="formData.username"
                hint="If using a phone number, you must provide country code followed by white space then your phone number"
                variant="outlined" :rules="rules.username" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn @click="checkUser" class="bg-c-primary" block density="default" size="large">Continue</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </article>
    </section>
    <section class="toc">
      <v-row class="my-6">
        <v-col cols="12">
          <p class="text-center">
            <span>By continuing you agree to Noels&apos; Fish Delivery </span><a href="#">Terms and Conditions</a>
          </p>
        </v-col>
      </v-row>
    </section>
    <section class="social-login">
      <v-row class="my-6">
        <v-col col="12" class="my-4">
          <v-btn block density="default" size="large" elevation="0" class="google-bg">
            <v-img :src="googleIcon" width="1"></v-img>
            <span class="social-login-caption" style="color: #ED1E79 !important;">Login with Google</span>
          </v-btn>
        </v-col>
        <v-col col="12" class="my-4">
          <v-btn block density="default" size="large" class="facebook-bg">
            <v-icon> mdi-facebook </v-icon>
            <span class="social-login-caption">Login with Facebook</span>
          </v-btn>
        </v-col>
        <v-col col="12" class="my-4">
          <v-btn block density="default" size="large" class="instagram-bg">
            <v-icon>mdi-instagram</v-icon>
            <span class="social-login-caption">Login with Instagram</span>
          </v-btn>
        </v-col>
      </v-row>
    </section>
    <section class="support">
      <article>
        <p>Need help? Call us at <a href="tel:+254 799 049181">+254 (799) &dash; 049181</a></p>
      </article>
    </section>
  </main>
  <footer class="footer">
    <LogoComponent width="150px" height="150px" />
  </footer>
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
