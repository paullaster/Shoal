<template>
    <footer :class="mdAndDown ? 'app-footer mobile-app-footer': 'app-footer'">
        <div class="footer-container">
            <h4>
                What We do
            </h4>
            <p style="text-align: justify;">
                Our company specializes in providing high-quality and affordable food items. <br />
                We aim to provide you with fresh, healthy, and nutritious meals. <br />
                We sell fish to fund our charity program for supporting children living with cerebral palsy <br />
        
            </p>
        </div>
        <div class="footer-container">
            <h4>
                Contact Us
            </h4>
            <p>
                Address: 00100 South B, Nairobi, Kenya <br />
                Phone: (+254) 990- 49181 <br />
                Email: {{CONTACTEMAIL}} <br />
            </p>
        </div>
        <div class="footer-container">
            <h4>
                Quick links
            </h4>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
            </ul>
        </div>
        <div class="footer-container">
            <h4>
                Social Media
            </h4>
            <p class="social-media-platforms">
                <a href="https://www.facebook.com/{{ APPNAME }}"><v-img :src="facebooSVG" width="15"></v-img></a> <br />
                <a href="https://www.instagram.com/{{ APPNAME }}"><v-img :src="instagramSVG" width="15"></v-img></a> <br />
                <a href="https://www.twitter.com/{{ APPNAME }}"><v-img :src="tiktokSVG" width="15"></v-img></a> <br />
                <a href="https://www.youtube.com/{{ APPNAME }}"><v-img :src="youtubeSVG" width="15"></v-img></a> <br />
                <a href="https://www.linkedin.com/{{ APPNAME }}"><v-img :src="xDotCOMSVG" width="15"></v-img></a> <br />
            </p>
        </div>
        <div class="footer-container">
            &copy;{{  new Date().getFullYear() }} - <strong>{{  APPNAME }}</strong>
        </div>
    </footer>
</template>

<script setup>
import { CONTACTEMAIL, APPNAME } from '@/environments';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import tiktokSVG from "@/assets/images/tiktok.svg";
import xDotCOMSVG from "@/assets/images/X_logo_2023_original.svg"
import facebooSVG from "@/assets/images/2021_Facebook_icon.svg"
import instagramSVG from "@/assets/images/Instagram_logo_2016.svg"
import youtubeSVG from "@/assets/images/YouTube_full-color_icon_(2017).svg"

const { mdAndDown } = useDisplay()


</script>