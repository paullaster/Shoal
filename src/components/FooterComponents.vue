<template>
    <footer class="app-footer flex flex-col py-8 px-4 md:flex-row md:flex-wrap md:justify-between md:gap-8">
        <div class="footer-container w-full md:w-1/2 lg:w-1/4 p-4">
            <h4>
                What We do
            </h4>
            <p style="text-align: justify;">
                Our company specializes in providing high-quality and affordable food items. <br />
                We aim to provide you with fresh, healthy, and nutritious meals. <br />
                We sell fish to fund our charity program for supporting children living with cerebral palsy <br />

            </p>
        </div>
        <div class="footer-container w-full md:w-1/2 lg:w-1/4 p-4">
            <h4>
                Contact Us
            </h4>
            <p>
                Address: 00100 South B, Nairobi, Kenya <br />
                Phone: (+254) 990- 49181 <br />
                Email: {{ CONTACTEMAIL }} <br />
            </p>
        </div>
        <div class="footer-container w-full md:w-1/2 lg:w-1/4 p-4">
            <h4>
                Quick links
            </h4>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
            </ul>
        </div>
        <div class="footer-container w-full md:w-1/2 lg:w-1/4 p-4 flex items-center">
            <h4>
                Social Media
            </h4>
            <p class="social-media-platforms">
                <a href="https://www.facebook.com/{{ APPNAME }}" class="w-6 h-6 md:w-8 md:h-8"><v-img
                        :src="facebooSVG"></v-img></a>
                <a href="https://www.instagram.com/{{ APPNAME }}" class="w-6 h-6 md:w-8 md:h-8"><v-img
                        :src="instagramSVG"></v-img></a>
                <a href="https://www.twitter.com/{{ APPNAME }}" class="w-6 h-6 md:w-8 md:h-8"><v-img
                        :src="tiktokSVG"></v-img></a>
                <a href="https://www.youtube.com/{{ APPNAME }}" class="w-6 h-6 md:w-8 md:h-8"><v-img
                        :src="youtubeSVG"></v-img></a>
                <a href="https://www.linkedin.com/{{ APPNAME }}" class="w-6 h-6 md:w-8 md:h-8"><v-img
                        :src="xDotCOMSVG"></v-img></a>
            </p>
        </div>
        <div class="footer-container w-full p-4 text-center">
            &copy;{{ new Date().getFullYear() }} - <strong>{{ APPNAME }}</strong>
        </div>
    </footer>
</template>

<script setup>
import { CONTACTEMAIL, APPNAME } from '@/environments';
import tiktokSVG from "@/assets/images/tiktok.svg";
import xDotCOMSVG from "@/assets/images/X_logo_2023_original.svg"
import facebooSVG from "@/assets/images/2021_Facebook_icon.svg"
import instagramSVG from "@/assets/images/Instagram_logo_2016.svg"
import youtubeSVG from "@/assets/images/YouTube_full-color_icon_(2017).svg"



</script>