<template>
    <v-row flex>
        <v-col cols="12">
            <v-dialog v-model="dynamicDialog.show">
                <v-card 
                class="px-2 py-6" 
                tag="div"
                style="
                 position: relative;
                 padding-top: 4rem !important;
                 padding-bottom: 1.6rem !important;
                "
                >
                    <v-card-actions tag="div"
                    style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    "
                    >
                    <v-btn
                    icon
                    v-tooltip="'Close dialog'"
                    tag="button"
                    >
                    <v-icon :color="ColorHelper.colorsHelper('error')" @click="globalStore.setDynamicDialog(null)">mdi-close</v-icon>
                </v-btn>
                </v-card-actions>
                    <v-card-title style="padding-left: 1.4rem !important;">
                        {{ dynamicDialog.description }}
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                        <v-row>
                            <template v-for="(control) in dynamicDialog.controls.inputs" :key="control.prop">
                                <v-col :cols="control.cols">
                                    <component 
                                    :is="getComponent(control.component)" 
                                    :key="control.prop"
                                    v-model="control.model"
                                    v-bind="control.props"
                                    />
                                </v-col>
                            </template>
                            <v-col cols="12">
                                <v-btn 
                                v-for="(action) in dynamicDialog.controls.actions" :key="action.key"
                                v-bind="action.props"
                                >
                                    {{  action.caption }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    </v-card-text>
                    
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script setup>
import { useGlobalStore } from '@/store';
import ColorHelper from '@/util/ColorHelper';
import { storeToRefs } from 'pinia';
import { VTextField } from 'vuetify/components/VTextField'

// STORE
const globalStore = useGlobalStore();
const { dynamicDialog } = storeToRefs(globalStore)


// COMPONENT METHODS
function getComponent(componentID) {
    // Return the component based on the component ID
    // Example:
    if (componentID === 'v-text-field') return VTextField;
}
</script>