<template>
  <div class="billing-address" :key="forceChangeUpgate">
    <v-card elevation="0">
      <v-row>
        <v-col cols="12" v-if="address.length && !addNewOrUpdateAddress">
          <v-card-title>
            <p>Address information</p>
            <v-btn
              v-if="address.length < 2"
              class="my-4"
              elevation="0"
              :style="`border: .1rem solid ${ColorHelper.colorsHelper('primary')}`"
              :block="mdAndDown"
              @click="addNewAddressAction"
            >
              <v-icon class="mr-2"> mdi-plus </v-icon>
              <span>Add new address</span>
            </v-btn>
          </v-card-title>
          <v-card-text tag="div">
            <v-alert
              :text="`
                ${
                  address.length >= 2
                    ? 'You can have upto a maximum of 2 addresses at a time, you can always delete the one you do not need and add a new one.'
                    : ''
                } \n
                Active address is marked in pink color at the top right corner
              `"
              title="Address tips"
              type="info"
              variant="tonal"
              class="mb-4"
            ></v-alert>
            <v-row>
              <v-col cols="12" v-for="address in address" :key="address.addressId">
                <div
                  style="
                    border-radius: 0.8rem;
                    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
                    padding: 1.6rem;
                    min-height: 10rem;
                    margin-bottom: 1.6rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                  "
                >
                  <p>
                    {{ address.appartment }},
                    {{ address.streetCode }}
                    {{ address.street }},
                    {{ address.town }}
                    {{ address.city }}
                    {{ address.zip }}, {{ setupStore.getCountry(address.country) }}
                  </p>
                  <div
                    v-if="address.default"
                    style="
                      position: absolute;
                      top: 0;
                      right: 0;
                      width: 50px;
                      height: 50px;
                      background-color: #ed1e79;
                      clip-path: polygon(100% 0, 0% 0%, 100% 100%);
                    "
                  ></div>
                  <div style="position: absolute; bottom: 0; right: 0">
                    <v-btn elevation="0" @click="editAddress(address)" icon>
                      <v-icon
                        size="20"
                        :color="ColorHelper.colorsHelper('info')"
                        v-tooltip="'Edit address'"
                        >mdi-pen</v-icon
                      >
                    </v-btn>
                    <v-btn
                      elevation="0"
                      @click="profileStore.setDefaultAddress(address)"
                      icon
                      v-tooltip="'Set the default address'"
                    >
                      <v-icon size="20" :color="ColorHelper.colorsHelper('primary')"
                        >mdi-cog</v-icon
                      >
                    </v-btn>
                    <v-btn
                      elevation="0"
                      @click="profileStore.deleteProfileAddress(address)"
                      icon
                      v-tooltip="'Delete address'"
                    >
                      <v-icon size="20" :color="ColorHelper.colorsHelper('error')"
                        >mdi-delete</v-icon
                      >
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-col cols="12" v-if="!address.length || addNewOrUpdateAddress">
          <div style="display: flex; align-items: center">
            <v-card-text tag="p">Tell us where to deliver your order</v-card-text>
            <v-btn
              v-if="route.query?.edit === true || addNewOrUpdateAddress"
              elevation="0"
              style="background-color: #828282"
              icon
              size="30"
              v-tooltip="'Close Address form'"
              @click="CloseAddressForm"
            >
              <v-icon :color="ColorHelper.colorsHelper('light')"> mdi-close </v-icon>
            </v-btn>
          </div>
          <v-card-text tag="div">
            <v-form tag="form" ref="shipping_address_form">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    variant="outlined"
                    label="Country/Region"
                    :items="countries"
                    :item-title="
                      (item) => (item?.name ? `${item?.flag} ${item?.name?.common}` : ``)
                    "
                    return-object
                    v-model="checkoutAddress.country"
                    clearable
                    :loading="countriesLoading"
                    :disabled="countriesLoading"
                    :rules="rules.country"
                    placeholder="Select Country"
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
                      style="position: absolute; top: -2.8rem; right: 0.4rem"
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
                    placeholder="Machakos"
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
                    label="Town"
                    variant="outlined"
                    placeholder="Mlolongo"
                    :rules="rules.town"
                    v-model="checkoutAddress.town"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Street"
                    placeholder="Biashara street"
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
                    label="Appartment/Suite/House Number"
                    variant="outlined"
                    :rules="rules.appartment"
                    v-model="checkoutAddress.appartment"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ACTIVEMAPSERVICE } from '@/environments'
import { useGlobalStore, useProfile, useSetupStore } from '@/store'
import ColorHelper from '@/util/ColorHelper'
import mapService from '@/util/map.service'
import stringToBase64AndReverse from '@/util/stringToBase64AndReverse'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { globalEventBus, useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify/lib/framework.mjs'

// VUETIFY
const { mdAndDown } = useDisplay()

// ROUTES
const route = useRoute()

// APP STORE
const setupStore = useSetupStore()
const profileStore = useProfile()
const globalStore = useGlobalStore()
const { countriesLoading, countries } = storeToRefs(setupStore)
const { address, addressSelected, addAnotherAddress, forceChangeUpgate } = storeToRefs(profileStore)

// COMPONENT INERNAL STATE
const checkoutAddress = ref({
  country: '',
  address: '',
  city: '',
  zip: '',
  appartment: '',
  street: '',
  streetCode: '',
  town: '',
  latitude: '',
  longitude: ''
})
const addressOnFocused = ref(false)
const shipping_address_form = ref(null)
const addNewOrUpdateAddress = ref(false)
const tempCountry = ref('')
// HOOKS
onMounted(() => {
  // Fetch countries data

  setupStore.getCountriesList()
  profileStore.fetchAddress()
  profileStore.$patch({
    addAnotherAddress: false,
    editAddressform: false,
    forceChangeUpgate: 1
  })
  globalEventBus.on('commitAddress', () => {
    saveCheckoutAddress()
  })
  globalEventBus.on('updateAddress', () => {
    updatecheckoutAddress()
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
      (v) => !!v || 'Street is required',
      (v) => v.length >= 2 || 'Street must be at least 5 characters long',
      (v) =>
        /^[A-Za-z0-9\s]*$/.test(v) || 'Street can only contain alphanumeric characters and spaces'
    ],
    // streetCode: [(v) => v >= 3 || 'Street Code must be at least 3 characters long'],
    town: [(v) => !!v || 'Town is required']
  }
})

// UI UPDATES
watch(
  () => route,
  async (route) => {
    if (route.name === 'checkout') {
      if (route.query.address && route.query.edit === 'true') {
        const addr = address.value.length
          ? address.value.find(
              (ad) =>
                ad.addressId === stringToBase64AndReverse.fromBase64String(route.query.address)
            )
          : await profileStore.fetchAddressById(
              stringToBase64AndReverse.fromBase64String(route.query.address)
            )
        await profileStore.setSelectedAddress(addr)
      } else {
        checkoutAddress.value = {
          country: '',
          address: '',
          city: '',
          zip: '',
          appartment: '',
          street: '',
          streetCode: '',
          town: ''
        }
      }
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => addressSelected.value,
  async (selected) => {
    if (Object.keys(selected).length) {
      checkoutAddress.value = {
        ...selected,
        country: JSON.parse(selected.country)
      }
      tempCountry.value = checkoutAddress.value.country
      addNewOrUpdateAddress.value = true
      profileStore.$patch({
        editAddressform: true
      })
    } else {
      profileStore.$patch({
        editAddressform: false
      })
      tempCountry.value = ''
      checkoutAddress.value = {
        country: '',
        address: '',
        city: '',
        zip: '',
        appartment: '',
        street: '',
        streetCode: '',
        town: ''
      }
      addNewOrUpdateAddress.value = false
    }
  },
  { immediate: true, deep: true }
)

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
    globalStore.setLoading(true)
    if (!navigator.geolocation) {
      useToast().error('Geolocation is not supported by this browser.')
      addressOnFocused.value = false
      globalStore.setLoading(false)
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
    const resultAddress = await mapService.reverseGeocoding(cords.longitude, cords.latitude, {
      country: checkoutAddress.value.country?.cca2?.toLowerCase(),
      language: 'en'
    })
    console.log({
      ACTIVEMAPSERVICE,
      resultAddress
    })
    if (ACTIVEMAPSERVICE === 'MAPBOX') {
      checkoutAddress.value.address = resultAddress.data.properties.full_address
      checkoutAddress.value.city = resultAddress.data.properties.context.region.name
      checkoutAddress.value.zip = resultAddress.data.properties.context.region.region_code
      checkoutAddress.value.street = resultAddress.data.properties.context.place.name
      checkoutAddress.value.streetCode = resultAddress.data.properties.context.postcode.name
      checkoutAddress.value.town = resultAddress.data.properties.context.place.name
    }
    checkoutAddress.value.latitude = cords.latitude
    checkoutAddress.value.longitude = cords.longitude

    if (ACTIVEMAPSERVICE === 'GOOGLE') {
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
    }
    globalStore.setLoading(false)
  } catch (error) {
    globalStore.setLoading(false)
    useToast().error(error.message)
  }
}
function onErrorRequestingLocationPermission(error) {
  globalStore.setLoading(false)
  useToast().error(`Error: ${error.code}:${error.message}`)
}

async function saveCheckoutAddress() {
  try {
    const { valid } = await shipping_address_form.value.validate()
    if (valid) {
      // Save checkout address to your backend API
      if (typeof checkoutAddress.value.country === 'object') {
        checkoutAddress.value.country = JSON.stringify({
          flag: checkoutAddress.value.country.flag,
          cca2: checkoutAddress.value.country.cca2,
          cca3: checkoutAddress.value.country.cca3,
          name: { common: checkoutAddress.value.country.name.common }
        })
      }
      const addressPayload = checkoutAddress.value
      profileStore
        .saveProfileAddress(addressPayload)
        .then((result) => {
          profileStore.$patch({
            address: result.data
          })
          useToast().success('Shipping address saved successfully!')
          addAnotherAddress.value ? CloseAddressForm() : globalEventBus.emit('moveToNext', 1)
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
function addNewAddressAction() {
  try {
    addNewOrUpdateAddress.value = true
    tempCountry.value = ''
    checkoutAddress.value = {
      country: '',
      address: '',
      city: '',
      zip: '',
      appartment: '',
      street: '',
      streetCode: '',
      town: ''
    }
    profileStore.$patch({
      addAnotherAddress: true
    })
  } catch (error) {
    useToast().error(error.message)
  }
}
function editAddress(address) {
  try {
    profileStore.setSelectedAddress(address)
    const url = new URL(location)
    url.searchParams.set('edit', 'true')
    url.searchParams.set('address', stringToBase64AndReverse.toBase64String(address.addressId))
    window.history.pushState({}, '', url)
  } catch (error) {
    profileStore.$patch({
      editAddressform: false
    })
    useToast().error(error.message)
  }
}
function CloseAddressForm() {
  try {
    addNewOrUpdateAddress.value = false
    checkoutAddress.value = {
      country: '',
      address: '',
      city: '',
      zip: '',
      appartment: '',
      street: '',
      streetCode: '',
      town: ''
    }
    profileStore.setSelectedAddress({})
    const url = new URL(location)
    url.searchParams.delete('edit')
    url.searchParams.delete('address')
    window.history.pushState({}, '', url)
    profileStore.$patch({
      editAddressform: false,
      forceChangeUpgate: 3,
      addAnotherAddress: false
    })
  } catch (error) {
    profileStore.$patch({
      editAddressform: false,
      forceChangeUpgate: 4,
      addAnotherAddress: false
    })
    useToast().error(error.message)
  }
}
async function updatecheckoutAddress() {
  try {
    const { valid } = await shipping_address_form.value.validate()
    if (!valid) {
      useToast().error('Please fill out all required fields correctly.')
      return
    }
    // Update checkout address to your backend API
    if (typeof checkoutAddress.value.country === 'object') {
      checkoutAddress.value.country = JSON.stringify({
        flag: checkoutAddress.value.country.flag,
        cca2: checkoutAddress.value.country.cca2,
        cca3: checkoutAddress.value.country.cca3,
        name: { common: checkoutAddress.value.country.name.common }
      })
    }
    const addressPayload = checkoutAddress.value
    profileStore
      .updateProfileAddress(addressPayload)
      .then((result) => {
        profileStore.$patch({
          address: result.data,
          forceChangeUpgate: 2
        })
        CloseAddressForm()
        useToast().success('Shipping address updated successfully!')
      })
      .catch((error) => {
        useToast().error(
          error.response.data.message ||
            error.message ||
            'We ran into an error when updating address!'
        )
      })
  } catch (error) {
    useToast().error(error.message)
  }
}
</script>