<template>
   <v-card class="my-6" elevation="1">
    <v-card-text>
        <v-row>
            <v-col cols="12" style="text-align: center;">
                <v-avatar :color="ColorHelper.colorsHelper('customer')" size="100">
                    <span>{{ user?.firstName[0] + user?.lastName[0]  }}</span>
                </v-avatar>
            </v-col>
            <v-col cols="12" style="text-align: center;">
                <p> {{  user?.firstName + " " + user?.lastName}}</p>
            </v-col>
            <v-col cols="12">
                <v-list style="display: flex; justify-content: space-between;">
                    <v-list-item style="text-align: center;" @click="()=>router.push({name:'orders'})">
                        <v-list-item-title>40</v-list-item-title>
                        <v-list-item-subtitle>Orders</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item style="text-align: center;">
                        <v-list-item-title>10</v-list-item-title>
                        <v-list-item-subtitle>Saved Items</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item style="text-align: center;">
                        <v-list-item-title>4</v-list-item-title>
                        <v-list-item-subtitle>Notifications</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-col>

            <v-col :cols="mdAndDown ? '12' : '4'">
                <v-tabs
                v-model="tab"
                background-color="#fff"
                color="primary"
                grow
                direction="vertical"
                @update:modelValue="commitCurrentTabUpdate"
                >
                <v-tab 
                v-for="tb in tabsArray"
                :key="tb.value"
                :prepend-icon="tb.icon"
                :text="tb.title"
                :value="tb.value"
                class="text-none"
                >
                </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
    </v-card-text>
</v-card>
</template>

<script setup>
import router from '@/router';
import { useAuth, /*useProfile*/ } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import { storeToRefs } from 'pinia';
import { inject } from 'vue';
import { useToast } from 'vue-toastification';
import { useDisplay } from 'vuetify/lib/framework.mjs';


// VUETIFY
const { mdAndDown } = useDisplay()

// APP STORE
const authStore = useAuth();
// const profileStore = useProfile();
const { user } = storeToRefs(authStore)


// COMPONENT STATE
const {tab, updateCurrentTab} = inject('tab', {tab: 0, updateCurrentTab: ()=>{}})
const tabsArray = [
    {
        title: 'Personal Information',
        value: 'personal_information',
        icon: 'mdi-account-tie',
    },
    {
        title: 'Change Password',
        value: 'change_password',
        icon:'mdi-lock-reset',
    },
    {
        title: 'Settings',
        value: 'settings',
        icon:'mdi-cog',
    }
]


//COMPONENT METHODS
function commitCurrentTabUpdate (tab) {
    try {
        const index = tabsArray.findIndex(tb => tb.value === tab)
        updateCurrentTab(index);
    } catch (error) {
        useToast().error(error.message || "Error")
    }
}
</script>