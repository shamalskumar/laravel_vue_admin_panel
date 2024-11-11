<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore';
import { apiService } from '@/api/apiService';
const authStore = useAuthStore();
const token = authStore.token;

const props = defineProps({
    title: String
});

const userData = computed(() => userStore.userData); // Use computed for reactivity
const userStore = useUserStore();
const rejectKYCDialog = ref(false);
const formData = ref({
    remark: '',
    event: 'KYC_REJECTED'
});
const remark = ref(''); // To hold the input remark

const rejectKYC = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        if (userStore.userData?.id) {
            formData.value.remark = remark.value; // Set the remark from the textbox

            // Send formData in the API request
            const response = await apiService.rejectKyc(token, userStore.userData?.id, formData.value);

            if (!response) {
                throw new Error('Error rejecting user');
            }
            searchUsersByID();
            console.log('User KYC rejected successfully:', response);
            closeRemarkDialog(); // Close the dialog on success
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding user:', error);
        // Handle error (e.g., show an error message)
    }
};

// Upload image to external API
const verifyKYC = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        if (userStore.userData?.id) {
            // Send formData in the API request
            const response = await apiService.verifyKyc(token, userStore.userData?.id);

            if (!response) {
                throw new Error('Error verifying KYC user');
            }
            searchUsersByID();
            console.log('User KYC verified successfully:', response);
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        // Handle error (e.g., show an error message)
    }
};

const searchUsersByID = async () => {
    // Fetch the updated user data

    if (token && userStore.userData?.id) {
        const updatedUserData = await apiService.searchUsersByID(token, userStore.userData.id);
        userStore.setUserData(updatedUserData[0]); // Update the user data in the store
    }
};

const openRemarkDialog = () => {
    rejectKYCDialog.value = true;
};
// Close the KYC rejection dialog
const closeRemarkDialog = () => {
    rejectKYCDialog.value = false;
    remark.value = ''; // Reset the remark field when closing
};
</script>
<template>
    <v-card variant="outlined">
        <v-card-item class="py-4 px-6">
            <v-row align="center" no-gutters>
                <v-col>
                    <v-card-title class="text-h5 mb-0">{{ title }}</v-card-title>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-btn
                        v-if="userData?.is_kyc_verified === false"
                        variant="flat"
                        color="primary"
                        size="small"
                        class="mx-1"
                        @click="verifyKYC"
                        >Approve KYC</v-btn
                    >
                    <v-btn
                        v-if="userData?.is_kyc_verified === false"
                        variant="flat"
                        color="error"
                        size="small"
                        class="mx-1"
                        @click="openRemarkDialog"
                        >Reject KYC
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-item>
        <v-divider />
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>

    <!-- KYC Remark Dialog -->

    <v-dialog v-model="rejectKYCDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Reject KYC</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Please provide remarks for KYC rejection*" v-model="remark" required></v-text-field>
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeRemarkDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="rejectKYC" variant="tonal" flat> Submit </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>
