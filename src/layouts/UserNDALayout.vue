<template>
   <v-app>
    <SideBarComponent />
    <v-main tag="main">
        <router-view />
    </v-main>
   </v-app>
</template>

<script setup>
import SideBarComponent from '@/packages/admin/components/SideBarComponent.vue';

</script>