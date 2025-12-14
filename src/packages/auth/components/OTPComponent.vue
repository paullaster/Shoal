<template>
  <main class="otp-wrapper min-h-screen bg-grey-lighten-5 d-flex align-center justify-center py-10 px-4">
    <v-card class="otp-card w-full max-w-md rounded-xl overflow-hidden" elevation="0" border>
      <!-- Header -->
      <div class="px-6 pt-8 pb-2 text-center">
        <div class="mb-4">
           <v-icon size="48" color="primary" class="mb-2">mdi-shield-check-outline</v-icon>
        </div>
        <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">Verify Your Account</h3>
        <p class="text-body-2 text-grey-darken-1 px-4">
          We sent a code to <span class="font-weight-bold text-primary">{{ Helper.mask(uniqueUserCode[0]) }}</span>.
          <br>Please enter it below to continue.
        </p>
      </div>

      <div class="px-6 pb-8">
        <v-sheet class="py-4">
          <v-otp-input
            v-model="otp"
            length="6"
            variant="outlined"
            base-color="primary"
            class="mb-4"
          ></v-otp-input>
        </v-sheet>

        <v-btn
          @click.prevent="verifyOTP()"
          color="primary"
          block
          rounded="pill"
          size="x-large"
          elevation="4"
          class="font-weight-bold mb-6 tracking-wide"
          :disabled="otp.length !== 6"
          :loading="loading"
        >
          Verify Code
        </v-btn>

        <div class="text-center text-body-2 text-grey-darken-1">
          Didn't receive code? 
          <span v-if="otpTimer > 0" class="font-weight-bold text-orange">
            Resend in {{ Helper.countDownDisplay(otpTimer) }}
          </span>
          <a
            v-else
            href="#"
            @click.prevent="() => { otp = ''; resendOtp({ datapoint: route.params.uniquCode }) }"
            class="text-primary font-weight-bold text-decoration-none hover-underline"
          >
            Resend Code
          </a>
        </div>
      </div>
    </v-card>
  </main>
</template>

<script setup>
import { useAuth } from '@/store';
import ColorHelper from '@/util/ColorHelper'
import Helper from '@/util/Helper';
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalEventBus } from 'vue-toastification';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import useAuthentication from '@/composables/useAuthentication';
import { storeToRefs } from 'pinia'; // Added for loading state

// VUETIFY
const { mdAndDown } = useDisplay();

// CLIENT ROUTING
const route = useRoute()
const router = useRouter()

// Composables
const { resendOtp } = useAuthentication()


// APP STATE
const authStore = useAuth();
const { loading } = storeToRefs(authStore); // Assuming authStore has loading state


// COMPONENT STATE
const uniqueUserCode = ref(atob(route.params.uniquCode).split(':'))
const otp = ref('');
const otpTimer = ref(0);

// HOOKS
onMounted(() => {
  otp.value = '';
  otpTimer.value = 0;
  globalEventBus.on('start-otp-resend-timer', () => {
    setResendOTPTimer();
  });
  globalEventBus.on("complete-profile", (data) => {
    router.push({ name: 'completeProfile', params: { uniquCode: data }, query: { ...route.query } })
  })
});

// COMPONENT METHODS
function setResendOTPTimer() {
  const timer = 180;
  otpTimer.value = timer;
  const interval = setInterval(() => {
    otpTimer.value--;
    if (otpTimer.value < 0) {
      clearInterval(interval);
      stopOTPTimer(interval);
    }
  }, 1000);

}
function stopOTPTimer(interval) {
  clearInterval(interval);
  otpTimer.value = 0;
}
function verifyOTP() {
  // Verify OTP and handle success/failure
  const payload = {
    datapoint: route.params.uniquCode,
    otp: otp.value,
  };
  // Call API to verify OTP
  authStore.verifyOtp(payload)
}
</script>

<style scoped>
.hover-underline:hover {
  text-decoration: underline !important;
}
</style>