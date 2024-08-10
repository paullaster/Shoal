<template>
    <v-navigation-drawer 
    app class="align-center" 
    :color="ColorHelper.colorsHelper('primary')" 
    v-model="toggleNavBar"
    @update:modelValue="()=>!lgAndUp && dashboardStore.setToggleNavbar(null)"
    >
      <div>
        <v-avatar class="avatar mr-2" :color="ColorHelper.colorsHelper(user?.role === 'lead' ? 'accent' : user?.role)" size="60">
        <span class="white--text text-h5">{{
       ` ${user?.name.split(" ")[0][0]}${user?.name.split(" ")[1][0]}`
      }}</span>
      </v-avatar>
      <span>{{ user?.role?.toUpperCase() }}</span>
      <span class="sidebar-active-spot"></span>
      </div>
      <v-list dense>
        <v-list-item
          v-for="(item, index) in links"
          :key="index"
          :value="item"
          @click="navigateTo(item.path)"
          class="d-flex align-center justify-start"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
      <v-btn variant="text logout-btn-position" @click="async() => await authStore.logout()" :color="ColorHelper.colorsHelper('light')">
        <v-icon class="mr-2">mdi-logout</v-icon>
        <span>Logout</span>
      </v-btn>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboard, useAuth } from '@/store'
  import ColorHelper from '@/util/ColorHelper';
  import { useDisplay } from 'vuetify/lib/framework.mjs';
  
//   VUETIFY UTILS

  const { lgAndUp } = useDisplay()
  
  // ROUTES
  const router = useRouter()
  
  // STORE
  const dashboardStore = useDashboard()
  const authStore = useAuth()
  const { user } = storeToRefs(authStore);
  
  const { links, toggleNavBar } = storeToRefs(dashboardStore)
  const navigateTo = (route) => {
      router.push(route)
    }
    // REFS



    </script>
  
  <style scoped>
  .align-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    margin-top: 2rem;
    margin-bottom: 2rem;
    position: relative
  }
  .logout-btn-position {
    position: absolute;
    right:25%;
    bottom: 1.2rem;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .sidebar-active-spot {
      display: block;
      position: absolute;
      top: 8.8%;
      left: 30%;
      width: .8rem !important;
      height: .8rem !important;
      background-color:#00c853;
      border-radius: 100%;
  
  }
  </style>