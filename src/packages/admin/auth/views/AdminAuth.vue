<template>
  <main class="admin-auth">
    <section>
      <v-card elevation="0" style=" height: 100vh;">
        <v-card-title >
          <div class="admin-auth__logo"  @click="()=>router.push({name: 'landing'})">
            <LogoComponent width="250px" />
          </div>
          <h2>Admin Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="loginForm" class="mx-auto" v-model:valid="loginFormValid">
            <v-text-field
              v-model="formData.username"
              :error-messages="emailErrors"
              label="Username"
              :rules="rules.username"
              auto-fill-disable
              variant="outlined"
              placeholder="Email or Phone Number"
              hint="If using a phone number, you must provide country code followed by white space then your phone number"
              class="my-4"
            />
            <v-text-field
              v-model="formData.password"
              :error-messages="passwordErrors"
              label="Password"
              type="password"
              :rules="rules.password"
              auto-fill-disable
              variant="outlined"
            />
            <v-btn @click="login" v-if="mdAndUp" size="large" :color="ColorHelper.colorsHelper('primary')">Login</v-btn>
            <v-btn @click="login" v-if="!mdAndUp" block size="large" :color="ColorHelper.colorsHelper('primary')" >Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </section>
  </main>
</template>

<script setup>
import LogoComponent from '@/components/LogoComponent.vue';
import { useAuth } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useDisplay } from 'vuetify/lib/framework.mjs';

// VUETIFY UTILS
const { mdAndUp } = useDisplay();


// ROUTE & ROUTER
const router = useRouter()

// STORE
const authStore = useAuth();
const { user } = storeToRefs(authStore);


// COMPONENT STATE
const formData = ref({
  username: '',
  password: ''
})
const loginForm = ref(null);



// COMPUTED PROPERTIES
const rules = computed(()=>{
  return {
    username: [
      v =>!!v || 'Username is required',
      v => /^\S+@\S+\.\S+$/.test(v) || /^\+\d{1,4}\s\d{1,15}$/.test(v) || 'Invalid phone number or email'
    ],
    password: [
      v =>!!v || 'Password is required',
      v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 
      `Password must be at least 8 characters long
       and contain at least one uppercase letter, 
       one lowercase letter, one number, and one special character`
    ]
  }
})


// WATCHERS
// WATCHERS
watch(
  () => user.value,
  (newUser) => {
    if (newUser && Object.keys(newUser).length) {
      router.push({
        name: 'adminUserLayout',
        params: { adminId: btoa(newUser.userId) }
      })
    }
  },
  { deep: true, immediate: true }
)

// COMPONENT METHODS
async function login() {
  try {
    const { valid } = await loginForm.value.validate();
    if (!valid) {
      useToast.error("Invalid information, please check the information provided to make sure it's correct");
      return;
    }
    formData.value.password = btoa(formData.value.password);
    authStore.login(formData.value);
  } catch (error) {
    useToast().error("Sorry, We could not sign you in. Please try again later.");
  }
}
</script>