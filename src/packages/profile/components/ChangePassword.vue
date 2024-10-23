<template>
    <v-tabs-window-item value="change_password">
        <v-card>
            <h4>Change Password</h4>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-label>Old Password</v-label>
                        <v-text-field placeholder="Enter old password" v-model="formData.oldPassword" variant="outlined" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-label>New Password</v-label>
                        <v-text-field label="Enter new password" v-model="formData.newPassword" variant="outlined" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-label>Confirm New Password</v-label>
                        <v-text-field label="Enter confirm password" v-model="formData.confirmPassword" variant="outlined" />
                    </v-col>
                    <v-col>
                        <h4>
                            New password must contain:
                        </h4>
                        <p>&dash;  At least 8 characters</p>
                        <p>&dash;  At least 1 lower letter &#40;a&dash;z&#41;</p>
                        <p>&dash;  At least 1 uppercase letter &#40;A&dash;Z&#41;</p>
                        <p>&dash;  At least 1 number &#40;0&dash;9&#41;</p>
                        <p>&dash;  At least 1 speacial characters</p>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-btn @click="changePassword" :color="ColorHelper.colorsHelper('secondary')">Change Password</v-btn>
                    </v-col>

                </v-row>
            </v-card-text>
        </v-card>
    </v-tabs-window-item>
</template>

<script setup>
import ColorHelper from '@/util/ColorHelper';
import { ref } from 'vue';



// COMPONENT STATE
const formData = ref(
    {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
)

</script>