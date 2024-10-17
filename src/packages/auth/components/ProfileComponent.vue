<template>
   <main class="complete-profile">
    <section class="complete-profile-card">
        <v-card elevation="0">
            <v-card-title class="headline">{{userData[3] === 'newAccount' ? 'Complete Profile' : 'Enter your password'}}</v-card-title>
            <v-card-text>
               <v-form ref="profileForm">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-label>Email</v-label>
                        <v-text-field variant="outlined" v-model="user.email" :readonly="userData[2] === 'email'" :rules="rules.email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="userData[3] === 'newAccount'">
                        <v-label>First Name</v-label>
                        <v-text-field variant="outlined" v-model="user.firstName" placeholder="for example: John" :rules="rules.firstName"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="userData[3] === 'newAccount'">
                        <v-label>Last Name</v-label>
                        <v-text-field variant="outlined" v-model="user.lastName" placeholder="for example: Doe" :rules="rules.lastName"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="userData[3] === 'newAccount'">
                        <v-label>Phone number</v-label>
                        <v-text-field 
                        variant="outlined" 
                        v-model="user.phoneNumber" 
                        placeholder="for example: +254 700258098" 
                        :readonly="userData[2] === 'phone'"
                        :rules="rules.phoneNumber"
                        @update:modelValue="formatPhoneNumberInput"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-label>Password</v-label>
                        <v-text-field 
                        variant="outlined" 
                        v-model="user.password" 
                        :type="showPassword? 'text' : 'password'" 
                        placeholder="minimum 8 characters" 
                        :rules="rules.password"
                        
                        >
                        <template v-slot:append-inner>
                            <v-icon 
                            @click="toggleShowPassword" 
                            :color="ColorHelper.colorsHelper('secondary')"
                            style="
                            background-color: #ED1E79 !important;
                            padding: 1rem !important;
                            border-radius: .4rem !important;
                            "
                            >{{ showPassword? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline' }}</v-icon>
                        </template>
                    </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-btn
                        :color="ColorHelper.colorsHelper('primary')"
                        @click="updateProfile"
                        :loading="loading"
                        :disabled="loading"
                        :block="mdAndDown"
                        size="x-large"
                        >
                           {{userData[3] === 'newAccount' ? 'Update Profile' : 'Continue'}}
                        </v-btn>
                    </v-col>
                </v-row>
               </v-form>
            </v-card-text>
        </v-card>

    </section>
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
const cartStore  = useCartStore();
const { loading } = storeToRefs(authStore);

// HOOK
onMounted(() => {
    if (userData.value[3] !== 'newAccount') {
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
            v =>!!v || 'First name is required',
            v => /^[a-zA-Z\s]+$/.test(v) || 'Name should only contain letters and spaces'
        ],
        lastName: [
            v =>!!v || 'Last name is required',
            v => /^[a-zA-Z\s]+$/.test(v) || 'Name should only contain letters and spaces'
        ],
        email: [
            v =>!!v || 'Email is required',
            v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format'
        ],
        password: [
            v =>!!v || 'Password is required',
            v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ],
        phoneNumber: [
            v =>!!v || 'Phone number is required',
            v => /^\+\d{1,4}\s\d{1,15}$/.test(v) || 'Invalid phone number format'
        ]
    }
})


// COMPONENT METHODS
async function updateProfile () {
    try {
        const { valid } = await profileForm.value.validate();
        if (!valid) {
            return useToast().warning("The information provided is not valid");
        }

        user.value.password = btoa(user.value.password);
        if(userData.value[3] === 'newAccount') {
            await authStore.updateProfile(user.value, userData.value);
            user.value =  { ... user.value, name: '', [userData.value[2] === 'email' ? 'phoneNumber' : 'email']: '', password: ''};
        }else {
            await authStore.login({username: user.value.email, password: user.value.password});
            user.value =  { ... user.value, password: ''};
        }
    } catch (error) {
        useToast().error(error?.message);
    }
}
function toggleShowPassword () {
    showPassword.value =!showPassword.value;
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