<template>
    <div class="mobile-menu-wrapper">
        <ul>
            <li v-for=" menu in menus " :key="menu.path">
                <router-link :to="menu.path">
                    <v-icon>{{menu.icon}}</v-icon>
                    <span>{{ menu.name }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useGlobalStore } from "@/store";
import { computed } from "vue";

// STORE
const globalStore = useGlobalStore();

// STORE GETTERS
const { globalGetter } = globalStore;


// STORE ACTIONS

// computed property
const menus = computed(() => globalGetter('menus'));
</script>

<style scoped>

</style>