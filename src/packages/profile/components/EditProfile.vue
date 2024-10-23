<template>
    <v-card elevation="1">
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-list lines="three">
                            <v-list-item>
                               <template v-slot:prepend>
                                <v-progress-circular model-value="profileComplete" :size="100" :color="ColorHelper.colorsHelper('primary')">
                                    {{ profileComplete }}%
                                </v-progress-circular>
                               </template>
                               <v-list-item-title class="ml-6">Edit Your Profile</v-list-item-title>
                               <v-list-item-subtitle class="ml-6">Change your profile picture, name, and more.</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                </v-col>
                <v-col cols="12">
                        <v-btn small color="primary" @click="editProfile()" block>Edit Your profile</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
import ColorHelper from '@/util/ColorHelper';
import { ref } from 'vue';

// APP STATE
const profileComplete = ref(100)

</script>