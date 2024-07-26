<template>
   <header class="header-wrapper">
     <h1 class="header-title">Noels Fish Delivery!</h1>
     <nav class="header-nav">
       <ul>
         <li><v-icon>mdi-menu</v-icon></li>
         <li><a href="#"><img :src="HeaderLogo" alt="Noel Fish Delivery"/></a></li>
       </ul>
       <ul class="reare-nav">
        <li><a href="#"><v-icon>mdi-account-outline</v-icon><span v-if="lgAndUp">account</span></a></li>
        <li><a href="#"><v-icon>mdi-cart-outline</v-icon><span v-if="lgAndUp">cart</span></a></li>
       </ul>
     </nav>
   </header>
</template>

<script setup>
import HeaderLogo from "@/assets/logo/logo-header.png";
import { useDisplay } from "vuetify/lib/framework.mjs";

const { lgAndUp } = useDisplay();

</script>

<style lang="scss" scoped>

</style>