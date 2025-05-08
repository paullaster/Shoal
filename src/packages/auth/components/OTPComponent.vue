<template>
  <main class="otp-main-view">
    <section class="otp-main-view-card">
      <v-card class="py-8 px-6 text-center mx-auto ma-4" elevation="0" max-width="400" width="100%">
        <h3 class="text-h6 mb-4">Verify Your Account</h3>

        <div class="text-body-2">
          We sent a verification code to {{ Helper.mask(uniqueUserCode[0]) }} <br />

          Please check your {{ uniqueUserCode[2] }} and paste the code below.
        </div>

        <v-sheet color="surface">
          <v-otp-input v-model="otp" type="text" variant="solo"></v-otp-input>
        </v-sheet>

        <v-btn class="my-4" :color="ColorHelper.colorsHelper('primary')" height="40" text="Verify" variant="flat"
          :block="mdAndDown" :disabled="otp.length !== 6" @click.prevent="verifyOTP()"></v-btn>

        <div class="text-caption">
          Didn't receive the code? <span v-if="otpTimer"> resend after {{ Helper.countDownDisplay(otpTimer) }} </span>
          <a href="#" @click.prevent="() => (otp = '', resendOtp({ datapoint: route.params.uniquCode }))"
            v-else>Resend</a>
        </div>
      </v-card>
    </section>
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


// VUETIFY
const { mdAndDown } = useDisplay();

// CLIENT ROUTING
const route = useRoute()
const router = useRouter()

// Composables
const { resendOtp } = useAuthentication()


// APP STATE
const authStore = useAuth();



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