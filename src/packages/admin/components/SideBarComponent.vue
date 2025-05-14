<template>
  <v-navigation-drawer app class="align-center" :color="ColorHelper.colorsHelper('primary')" v-model="toggleNavBar"
    @update:modelValue="() => !lgAndUp && dashboardStore.setToggleNavbar(null)">
    <div>
      <v-avatar class="avatar mr-2" :color="ColorHelper.colorsHelper(user?.type === 'admin' ? 'accent' : 'customer')"
        size="60">
        <span class="white--text text-h5">{{
          ` ${user?.firstName[0]}${user?.lastName[0]}`
          }}</span>
      </v-avatar>
      <span>{{ user?.firstName[0] + user?.lastName }}</span>
      <span class="sidebar-active-spot"></span>
    </div>
    <v-list dense>
      <template v-for="(item) in links" :key="item.id">
        <v-list-item v-if="!item.hasSubs" :value="item" @click="item.path && navigateTo(item.path)"
          :class="['d-flex align-center justify-start', isActive(item) ? 'active-parent' : '']" v-ripple>
          <template #prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
        <div v-else>
          <v-list-item :class="['d-flex align-center justify-start', isActiveParent(item) ? 'active-parent' : '']"
            @click="toggleExpand(item.id)" v-ripple>
            <template #prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <template #append>
              <v-icon :icon="expandedParentId === item.id ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                class="expand-icon" />
            </template>
          </v-list-item>
          <v-expand-transition>
            <div v-show="expandedParentId === item.id" class="sidebar-subs">
              <v-list dense>
                <v-list-item v-for="sub in item.subs" :key="sub.id"
                  :class="['sidebar-sub-item', isActive(sub) ? 'active-child' : '']"
                  @click="sub.path && navigateTo(sub.path)" v-ripple>
                  <template #prepend>
                    <v-icon :icon="sub.icon"></v-icon>
                  </template>
                  <v-list-item-title v-text="sub.title"></v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </div>
      </template>
    </v-list>
    <v-btn variant="text logout-btn-position" @click="async () => await authStore.logout()"
      :color="ColorHelper.colorsHelper('light')">
      <v-icon class="mr-2">mdi-logout</v-icon>
      <span>Logout</span>
    </v-btn>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDashboard, useAuth } from '@/store'
import ColorHelper from '@/util/ColorHelper';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const { lgAndUp } = useDisplay()
const router = useRouter()
const route = useRoute()
const dashboardStore = useDashboard()
const authStore = useAuth()
const { user } = storeToRefs(authStore);
const { links, toggleNavBar } = storeToRefs(dashboardStore)

const expandedParentId = ref(null)

const toggleExpand = (id) => {
  expandedParentId.value = expandedParentId.value === id ? null : id
}

const isActive = (item) => {
  if (!item.path) return false
  return route.path === item.path
}

const isActiveParent = (item) => {
  if (item.hasSubs && item.subs) {
    return item.subs.some(sub => isActive(sub))
  }
  return isActive(item)
}

const navigateTo = (path) => {
  if (path && route.path !== path) {
    router.push(path)
  }
}
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
  right: 25%;
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
  background-color: #00c853;
  border-radius: 100%;
}

.v-navigation-drawer {
  background: #1a2236 !important;
  /* deep navy for modern contrast */
}

.active-parent {
  background: linear-gradient(90deg, #00c85322 0%, #00c85311 100%);
  color: #00c853 !important;
  font-weight: bold;
}

.active-child {
  background: linear-gradient(90deg, #00bfae22 0%, #00bfae11 100%);
  color: #00bfae !important;
  font-weight: bold;
}

.sidebar-subs {
  padding-left: 2.2rem;
  border-left: 2px solid #00c85333;
  margin-left: 0.5rem;
}

.sidebar-sub-item {
  margin-bottom: 0.2rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.sidebar-sub-item:hover {
  background: #64dd17 !important;
  /* soft lime for hover */
  color: #1a2236 !important;
}

.v-list-item:hover:not(.active-parent):not(.active-child) {
  background: #64dd17 !important;
  /* soft lime for hover */
  color: #1a2236 !important;
}

.expand-icon {
  transition: transform 0.2s cubic-bezier(.4, 2, .6, 1);
  color: #c8004e;
}
</style>