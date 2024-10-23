<template>
    <main class="my-profile">
        <section class="my-profile-wrapper">
            <ProfileCompleteCard />
            <ProfileInformation :key="tab"/>
            <v-card>
                <v-tabs-window v-model="tab">
                    <ProfileInformationTab />
                    <ChangePassword />
                </v-tabs-window>
            </v-card>
        </section>
    </main>
</template>

<script setup>
import { useDashboard } from '@/store';
import links from '../links';
import ProfileCompleteCard from '../components/EditProfile.vue';
import ProfileInformation from '../components/ProfileInformation.vue';
import ProfileInformationTab from '../components/ProfileInformationTab.vue';
import { provide, ref } from 'vue';
import { useToast } from 'vue-toastification';
import ChangePassword from '../components/ChangePassword.vue';


// APP STORE
const dashboardStore = useDashboard();
dashboardStore.addLinks(links)

// COMPONENT STATE
const tab = ref(0)

// COMPONENT METHODS
function updateCurrentTab(currentTab) {
    try {
        tab.value = currentTab;
    } catch (error) {
        useToast().error(error.message || "Error");
    }
}
// PROVIDER
provide('tab', {tab, updateCurrentTab});

</script>