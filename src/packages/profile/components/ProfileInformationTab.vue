<template>
    <v-tabs-window-item value="personal_information">
      <v-card flat>
        <v-card-title> Profile Information </v-card-title>
        <v-card-text>
          <v-row>
            <v-col :cols="mdAndDown ? 12 : 6">
                <v-label>
                    First Name
                </v-label>
              <v-text-field v-model="formData.firstName" variant="outlined"> </v-text-field>
            </v-col>
            <v-col :cols="mdAndDown ? 12 : 6">
                <v-label> Last Name</v-label>
              <v-text-field v-model="formData.lastName" variant="outlined"> </v-text-field>
            </v-col>
            <v-col :cols="mdAndDown ? 12 : 6">
                <v-label>Email</v-label>
              <v-text-field v-model="formData.email" variant="outlined"> </v-text-field>
            </v-col>
            <v-col :cols="mdAndDown ? 12 : 6">
                <v-label>Phone Number</v-label>
              <v-text-field v-model="formData.phoneNumber" variant="outlined"> </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <h4>Address</h4>
            <v-col :cols="mdAndDown ? 12 : 6">
                <p v-if="!formData.address.length">
                  No address
                </p>
                <template v-else>
                  <address v-for="addr in formData.address" :key="addr.addressId">
                    {{ addr.appartment }},
                      {{ addr.streetCode }}
                      {{ addr.street }},
                      {{ addr.town }}
                      {{ addr.city }}
                      {{ addr.zip }}, {{ setupStore.getCountry(addr.country)}}
                  </address>
                </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
</template>

<script setup>
import { useProfile, useSetupStore } from '@/store'
import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'


// VUETIFY UTILITIES
const { mdAndDown } = useDisplay()

// APP sTORE
const profileStore = useProfile()
const setupStore = useSetupStore()
const { profile, address } = storeToRefs(profileStore)

// ASYNC CALLS
await profileStore.fetchProfile();
await profileStore.fetchAddress();
// COMPONENT STATE

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: []
})

// EFFECTS
watchEffect(() => {
  formData.value = {
   ...profile.value,
    address: address.value,
  }
})
</script>