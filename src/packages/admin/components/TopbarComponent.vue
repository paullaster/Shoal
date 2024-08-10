<template>
    <v-app-bar app class="app-top-header">
      <v-btn icon :color="ColorHelper.colorsHelper('primary')" @click="()=> !lgAndUp && dashboardStore.setToggleNavbar(true)">
        <v-icon>mdi-view-module</v-icon>
      </v-btn>
      <v-toolbar-title v-if="mdAndUp">{{ APPNAME }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <span style="margin-inline: 0.8rem;">
        Role: <v-chip :color="ColorHelper.colorsHelper(user?.role)">{{ user?.role?.toUpperCase() }}</v-chip>
      </span>
      <span style="margin-inline: 0.8rem;" v-if="mdAndUp">
        Title: <v-chip :color="ColorHelper.colorsHelper(user?.role)">{{ user?.title?.toUpperCase() }}</v-chip>
      </span>
      <span v-if="mdAndUp">{{ user.name }}</span>
      <v-btn icon class="ml-2" :color="ColorHelper.colorsHelper('primary')" @click="globalStore.setProfileToggle" id="activate-toggle-btn-ctl">
        <v-icon id="activate-toggle-btn-ctl-icon">mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>
  </template> 
  
  <script setup>
  import { storeToRefs } from 'pinia';
  import { useAuth, useDashboard, useGlobalStore } from '@/store';
  import AuthService from '@/packages/auth/AuthService';
  import { APPNAME } from '@/environments';
  import { useDisplay } from 'vuetify/lib/framework.mjs';
  import ColorHelper from '@/util/ColorHelper';
  
  
  // VUETIFY RESPONSIVE CLASSES
  const { mdAndUp, lgAndUp } = useDisplay();
  
  // STORES
  const authStore = useAuth();
  const globalStore = useGlobalStore();
  const dashboardStore = useDashboard();
  const {user} = storeToRefs(authStore);
  authStore.setUser(AuthService.getUser());
  
  
  // Component helpers
  function isAdmin() {
    return user.value?.role === 'admin';
  }
  </script>