<template>
    <div class="billing-address">
        <v-card>
            <v-card-text tag="p">
                Tell us where to deliver your order
            </v-card-text>
            <v-card-text tag="div">
                <v-form tag="form">
                    <v-row >
                        <v-col cols="12">
                            <v-text-field 
                            variant=outlined
                            label="Country/Region"
                            >
                                
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea 
                            label="Address"  
                            variant="outlined"
                            placeholder="Please enter your correct address. We'll use this address to deliver your order! for example, (Nicobon Appartment, Biashara Street, Mlolongo, Machakos County, Kenya)
                            "
                            ></v-textarea>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="City"  variant=outlined ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Code"  variant=outlined></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Appartment, Suite (Optional)"  variant=outlined></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="Phone (Optional)"  variant=outlined></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>

</script>