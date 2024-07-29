<template>
  <main class="auth-wrapper">
    <section class="btn-section">
      <article class="navigation-btn">
        <v-btn variant="text"  @click="()=>router.back()">
          <v-icon size="30">mdi-keyboard-backspace</v-icon>
        </v-btn>
      </article>
    </section>
    <section class="logo-section">
      <article class="logo">
        <LogoComponent width="100px" />
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
        <v-form>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Email or Phone Number"
                v-model="formData.email"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn @click="checkUser" class="bg-c-primary" block density="default" size="large"
                >Continue</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </article>
    </section>
    <section class="toc">
      <v-row class="my-6">
        <v-col cols="12">
          <p class="text-center">
            <span>By continuing you agree to Noels&apos; Fish Delivery </span
            ><a href="#">Terms and Conditions</a>
          </p>
        </v-col>
      </v-row>
    </section>
    <section class="social-login">
      <v-row class="my-6">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  email: ''
});

</script>

<style lang="scss" scoped>
</style>