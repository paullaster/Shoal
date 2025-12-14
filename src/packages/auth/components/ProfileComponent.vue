<template>
  <main class="profile-wrapper min-h-screen bg-grey-lighten-5 d-flex align-center justify-center py-10 px-4">
    <v-card class="profile-card w-full max-w-lg rounded-xl overflow-hidden" elevation="0" border>
      
      <!-- Header -->
      <div class="px-8 pt-8 pb-4 text-center">
        <v-avatar color="primary-lighten-5" size="64" class="mb-4">
          <v-icon size="32" color="primary">
            {{ userData[4] === 'newAccount' ? 'mdi-account-plus' : 'mdi-login-variant' }}
          </v-icon>
        </v-avatar>
        <h3 class="text-h5 font-weight-bold text-grey-darken-3">
          {{ userData[4] === 'newAccount' ? 'Complete Your Profile' : 'Welcome Back' }}
        </h3>
        <p class="text-body-2 text-grey-darken-1 mt-1">
          {{ userData[4] === 'newAccount' ? 'Tell us a bit about yourself to get started.' : 'Please enter your password to continue.' }}
        </p>
      </div>

      <div class="px-8 pb-8">
        <v-form ref="profileForm" @submit.prevent="updateProfile">
          <v-row dense>
            <!-- Email (Read-only usually) -->
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-2 ml-1 mb-1">Email</div>
              <v-text-field
                v-model="user.email"
                variant="outlined"
                rounded="pill"
                density="comfortable"
                bg-color="grey-lighten-4"
                readonly
                hide-details="auto"
                class="mb-2"
              >
                <template v-slot:prepend-inner>
                   <v-icon size="small" color="grey" class="ml-2">mdi-email-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Name Fields (New Account Only) -->
            <template v-if="userData[4] === 'newAccount'">
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-grey-darken-2 ml-1 mb-1">First Name</div>
                <v-text-field
                  v-model="user.firstName"
                  placeholder="e.g. John"
                  variant="outlined"
                  rounded="pill"
                  density="comfortable"
                  color="primary"
                  :rules="rules.firstName"
                  hide-details="auto"
                  class="mb-2"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-grey-darken-2 ml-1 mb-1">Last Name</div>
                <v-text-field
                  v-model="user.lastName"
                  placeholder="e.g. Doe"
                  variant="outlined"
                  rounded="pill"
                  density="comfortable"
                  color="primary"
                  :rules="rules.lastName"
                  hide-details="auto"
                  class="mb-2"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <div class="text-caption font-weight-bold text-grey-darken-2 ml-1 mb-1">Phone Number</div>
                <v-text-field
                  v-model="user.phoneNumber"
                  placeholder="e.g. +254 700 000 000"
                  variant="outlined"
                  rounded="pill"
                  density="comfortable"
                  color="primary"
                  :readonly="userData[2] === 'phone'"
                  :bg-color="userData[2] === 'phone' ? 'grey-lighten-4' : undefined"
                  :rules="rules.phoneNumber"
                  @update:modelValue="formatPhoneNumberInput"
                  hide-details="auto"
                  class="mb-2"
                >
                  <template v-slot:prepend-inner>
                    <v-icon size="small" color="grey" class="ml-2">mdi-phone-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </template>

            <!-- Password Field -->
            <v-col cols="12">
              <div class="text-caption font-weight-bold text-grey-darken-2 ml-1 mb-1">Password</div>
              <v-text-field
                v-model="user.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min 8 chars"
                variant="outlined"
                rounded="pill"
                density="comfortable"
                color="primary"
                :rules="rules.password"
                hide-details="auto"
                class="mb-4"
              >
                <template v-slot:prepend-inner>
                    <v-icon size="small" color="grey" class="ml-2">mdi-lock-outline</v-icon>
                </template>
                <template v-slot:append-inner>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="grey"
                    @click="toggleShowPassword"
                  >
                    <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <!-- Submit Button -->
            <v-col cols="12" class="mt-4">
              <v-btn
                @click="updateProfile"
                color="primary"
                block
                rounded="pill"
                size="x-large"
                elevation="4"
                :loading="loading"
                :disabled="loading"
                class="font-weight-bold tracking-wide"
              >
                {{ userData[4] === 'newAccount' ? 'Create Account' : 'Login' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </main>
</template>

<script setup>
import { useAuth, useCartStore } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { globalEventBus, useToast } from 'vue-toastification';
import { useDisplay } from 'vuetify/lib/framework.mjs';

// VUETIFY
const { mdAndDown } = useDisplay();

// CLIENT ROUTE
const route = useRoute()
const router = useRouter()
// COMPONENT STATE
const user = ref({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
const userData = ref(atob(route.params.uniquCode).split(":"));
const showPassword = ref(false);
const profileForm = ref(null);

// APP STORE
const authStore = useAuth();
const cartStore = useCartStore();
const { loading } = storeToRefs(authStore);

// HOOK
onMounted(() => {
    if (userData.value[4] !== 'newAccount') {
        user.value.email = userData.value[0];
    }
    if (userData.value[2] === 'email') {
        user.value.email = userData.value[0];
    }
    if (userData.value[2] === 'phone') {
        user.value.phoneNumber = userData.value[0];
    }
    globalEventBus.on('redirection', () => {
        router.push(stringToBase64AndReverse.fromBase64String(route.query.redirectTo)) || router.push('/');
        cartStore.checkLocalCacheCart();
        cartStore.getCart();
    })
});

// COMPUTED
const rules = computed(() => {
    return {
        firstName: [
            v => !!v || 'First name is required',
            v => /^[a-zA-Z\s]+$/.test(v) || 'Name should only contain letters and spaces'
        ],
        lastName: [
            v => !!v || 'Last name is required',
            v => /^[a-zA-Z\s]+$/.test(v) || 'Name should only contain letters and spaces'
        ],
        email: [
            v => !!v || 'Email is required',
            v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format'
        ],
        password: [
            v => !!v || 'Password is required',
            v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ],
        phoneNumber: [
            v => !!v || 'Phone number is required',
            v => /^\+\d{1,4}\s\d{1,15}$/.test(v) || 'Invalid phone number format'
        ]
    }
})


// COMPONENT METHODS
async function updateProfile() {
    try {
        const { valid } = await profileForm.value.validate();
        if (!valid) {
            return useToast().warning("The information provided is not valid");
        }

        user.value.password = btoa(user.value.password);
        user.value.completed = true;
        if (userData.value[4] === 'newAccount') {
            await authStore.updateProfile(user.value, userData.value);
            user.value = { ...user.value, name: '', [userData.value[2] === 'email' ? 'phoneNumber' : 'email']: '', password: '' };
        } else {
            await authStore.login({ username: user.value.email, password: user.value.password });
            user.value = { ...user.value, password: '' };
        }
    } catch (error) {
        useToast().error(error?.message);
    }
}
function toggleShowPassword() {
    showPassword.value = !showPassword.value;
}

function formatPhoneNumberInput(val) {
    try {
        const formattedPhoneNumber = val.replace(/[^\d]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '+$1 $2$3');
        user.value.phoneNumber = formattedPhoneNumber;
    } catch (error) {
        useToast().error(error.message);
    }
}
</script>