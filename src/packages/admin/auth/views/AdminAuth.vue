<template>
  <main class="admin-auth">
    <section>
      <v-card elevation="0">
        <v-card-title>
          <div class="admin-auth__logo">
            <LogoComponent />
          </div>
          <h2>Admin Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="loginForm" class="mx-auto" v-model:valid="loginFormValid">
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="Email"
              required
              auto-fill-disable
              variant="outlined"
            />
            <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              label="Password"
              type="password"
              required
              auto-fill-disable
              variant="outlined"
            />
            <v-btn @click="login" :disabled="!loginFormValid" v-if="mdAndUp" size="large" :color="ColorHelper.colorsHelper('primary')">Login</v-btn>
            <v-btn @click="login" :disabled="!loginFormValid" v-if="!mdAndUp" block size="large" :color="ColorHelper.colorsHelper('primary')" >Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </section>
  </main>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue';
import ColorHelper from '@/util/ColorHelper';
import { useDisplay } from 'vuetify/lib/framework.mjs';

// VUETIFY UTILS
const { mdAndUp } = useDisplay();
</script>
