<template>
  <div class="billing-address">
    <v-card elevation="0">
      <v-card-text tag="p"> Tell us where to deliver your order </v-card-text>
      <v-card-text tag="div">
        <v-form tag="form" ref="shipping_address_form">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                variant="outlined"
                label="Country/Region"
                :items="countries"
                item-title="name.common"
                return-object
                v-model="checkoutAddress.country"
                clearable
                :loading="countriesLoading"
                :disabled="countriesLoading"
                :rules="rules.country"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" style="position: relative; margin: 2.8rem 0">
              <v-textarea
                label="Address"
                variant="outlined"
                placeholder="Please enter your correct address. We'll use this address to deliver your order! for example, (Nicobon Appartment, Biashara Street, Mlolongo, Machakos County, Kenya)"
                v-model="checkoutAddress.address"
                :rules="rules.address"
                @update:focused="(event) => addressFieldFocused(event)"
              ></v-textarea>
              <div v-if="addressOnFocused">
                <v-btn
                  :color="ColorHelper.colorsHelper('secondary')"
                  style="position: absolute; top: -2.8rem; right: 0.8rem"
                  @click="useCurrentAddress"
                >
                  <v-icon class="mr-2">mdi-map-marker-radius</v-icon>
                  <span> use your current address</span>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="City"
                variant="outlined"
                :rules="rules.city"
                v-model="checkoutAddress.city"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="City Code"
                variant="outlined"
                :rules="rules.zip"
                v-model="checkoutAddress.zip"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Street (Optional)"
                variant="outlined"
                :rules="rules.street"
                v-model="checkoutAddress.street"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Street Number (Optional)"
                variant="outlined"
                :rules="rules.streetCode"
                v-model="checkoutAddress.streetCode"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Appartment, Suite"
                variant="outlined"
                :rules="rules.appartment"
                v-model="checkoutAddress.appartment"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { GEODINGURL, GOOGLEAPIKEY } from '@/environments'
import { useProfile, useSetupStore } from '@/store'
import ColorHelper from '@/util/ColorHelper'
import { GoogleServices } from '@/util/google.service'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { globalEventBus, useToast } from 'vue-toastification'

// APP STORE
const setupStore = useSetupStore()
const profileStore = useProfile()
const { countriesLoading, countries } = storeToRefs(setupStore)

// COMPONENT INERNAL STATE
const checkoutAddress = ref({
  country: '',
  address: '',
  city: '',
  zip: '',
  appartment: '',
  street: '',
  streetCode: '',
})
const addressOnFocused = ref(false)
const shipping_address_form = ref(null)
// HOOKS
onMounted(() => {
  // Fetch countries data
  setupStore.getCountriesList()

  globalEventBus.on('commitAddress', () => {
    saveCheckoutAddress();
  })
})

// COMPUTED
const rules = computed(() => {
  return {
    country: [(v) => !!v || 'Country/Region is required'],
    address: [(v) => !!v || 'Address is required'],
    city: [(v) => !!v || 'City is required'],
    zip: [
      (v) => !!v || 'zip Code is required',
      (v) => v >= 4 || 'Code must be at least 4 characters long'
    ],
    appartment: [
      (v) => !!v || 'Appartment is required',
      (v) =>
        /^[A-Za-z0-9\s]*$/.test(v) ||
        'Appartment can only contain alphanumeric characters and spaces'
    ],
    street: [
      (v) => v.length >= 5 || 'Street must be at least 5 characters long',
      (v) =>
        /^[A-Za-z0-9\s]*$/.test(v) || 'Street can only contain alphanumeric characters and spaces'
    ],
    streetCode: [(v) => v >= 3 || 'Street Code must be at least 3 characters long']
  }
})

// COMPONENT METHODS
function addressFieldFocused(e) {
  try {
    if (e) {
      addressOnFocused.value = true
    }
  } catch (error) {
    useToast().error(error.message)
  }
}
function useCurrentAddress() {
  try {
    if (!navigator.geolocation) {
      useToast().error('Geolocation is not supported by this browser.')
      addressOnFocused.value = false
      return
    }
    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    window.navigator.geolocation.getCurrentPosition(
      onSuccessfulLocationPermission,
      onErrorRequestingLocationPermission,
      locationOptions
    )
  } catch (error) {
    useToast().error(error.message)
  }
}

async function onSuccessfulLocationPermission(pos) {
  try {
    const cords = pos.coords
    const googleService = new GoogleServices(GEODINGURL, GOOGLEAPIKEY)
    const resultAddress = await googleService.geocodingService(
      `latlng=${cords.latitude},${cords.longitude}`
    )
    checkoutAddress.value.latitude = cords.latitude;
    checkoutAddress.value.longitude = cords.longitude;
    if (resultAddress.error_message) {
      useToast().warning(
        'We encountered an error using this service, Please enter your address manually!'
      )
      return
    } else {
      checkoutAddress.value.address = resultAddress?.results[0]?.formatted_address
      checkoutAddress.value.city = resultAddress.results[0]?.address_components[5]?.long_name
      checkoutAddress.value.zip = resultAddress.results[0]?.address_components[7]?.long_name
      checkoutAddress.value.street = resultAddress.results[0]?.address_components[1]?.long_name
      checkoutAddress.value.streetCode = resultAddress.results[0]?.address_components[0]?.long_name
    }
  } catch (error) {
    useToast().error(error.message)
  }
}
function onErrorRequestingLocationPermission(error) {
  useToast().error(`Error: ${error.code}:${error.message}`)
}

async function saveCheckoutAddress() {
  try {
    const { valid } = await shipping_address_form.value.validate()
    if (valid) {
      // Save checkout address to your backend API
      checkoutAddress.value.country = `${checkoutAddress.value.country.cca2}:${checkoutAddress.value.country.cca3}:${checkoutAddress.value.country.name.common}`
      const addressPayload = checkoutAddress.value
      profileStore
        .saveProfileAddress(addressPayload)
        .then((result) => {
          profileStore.$patch({
            address: result.data
          })
          useToast().success('Shipping address saved successfully!');
          globalEventBus.emit('moveToPayments');
        })
        .catch((error) => {
          useToast().error(
            error.response.data.message ||
              error.message ||
              'We ran into an error when saving address!'
          )
        })
    } else {
      useToast().error('Please fill out all required fields correctly.')
      return
    }
  } catch (error) {
    useToast().error(error.message)
  }
}
</script>