<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref, computed, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import KycDialog from '@/components/ui-components/dialogs/KycDialog.vue'; // Import your KycDialog component
import selfieDialog from '@/components/ui-components/dialogs/selfieDialog.vue'; // Import your selfieDialog component
import signatureDialog from '@/components/ui-components/dialogs/signatureDialog.vue'; // Import your signatureiaDialog component
import businessRegistrationDialog from '@/components/ui-components/dialogs/businessRegistrationDialog.vue'; // Import your signatureiaDialog component
import businessTINDialog from '@/components/ui-components/dialogs/businessTINDialog.vue'; // Import your signatureiaDialog component
import type { UserActivity } from '@/models/systemModel';

// Refs and user data
const tab = ref(0);
const userStore = useUserStore();
const userData = computed(() => userStore.userData); // Use computed for reactivity
const authStore = useAuthStore();
const token = authStore.token;

const dialog = ref(false);
const kycDialog = ref(false);
const userActivity = ref<UserActivity[]>([]);

const verifierInformation = ref({
    name: '',
    userID: '',
    email: '',
    phone: '',
    username: ''
});

const kycDocument = ref({
    docURL: '',
    type: ''
});

// Watch for changes in userData (if you need to trigger any additional logic)
watch(
    () => userStore.userData?.is_kyc_verified,
    (newValue, oldValue) => {
        // Perform any additional actions on data update
        getVerifierInfo();
    }
);

watch(
    () => tab.value,
    (newValue) => {
        // Perform additional actions when tab changes
        if (newValue == 2) {
            // Perform actions specifically when tab equals 2
            getUserRejection();
        }
    }
);

onMounted(() => {
    if (userStore.userData?.is_kyc_verified) {
        getVerifierInfo();
    }
});

const viewItem = (item: string, type: string) => {
    kycDialog.value = true;

    console.log('item', item);

    kycDocument.value.docURL = item;
    kycDocument.value.type = type;
};

const closeKycDialog = () => {
    kycDocument.value.docURL = '';
    kycDialog.value = false;
};

const getDocType = (type: string) => {
    switch (type) {
        case 'VOTERID':
            return 'Voter ID';
        case 'DRIVING_LICENSE':
            return 'Driving License';
        case 'JOINT_CARD':
            return 'Joint Card';
        case 'PASSPORT':
            return 'Passport';
        default:
            return 'Unknown Status Code';
    }
};

const getUserRejection = async () => {
    try {
        if (token) {
            const fetchedUserActivityData = await apiService.getUserRejectActivity(token, Number(userStore.userData?.id));

            userActivity.value = fetchedUserActivityData;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
};

const getVerifierInfo = async () => {
    if (token && userStore.userData?.id) {
        try {
            // Fetch the updated user data
            const fetchedVerifierInformation = await apiService.searchUsersByID(token, userStore.userData.kyc_verified_by);

            verifierInformation.value.name = fetchedVerifierInformation[0].full_name;
            verifierInformation.value.userID = fetchedVerifierInformation[0].id;
            verifierInformation.value.email = fetchedVerifierInformation[0].email;
            verifierInformation.value.username = fetchedVerifierInformation[0].username;

            verifierInformation.value.phone = fetchedVerifierInformation[0].mobile_country_code + fetchedVerifierInformation[0].mobile_no;
            // userStore.setUserData(updatedUserData[0]); // Update the user data in the store
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    } else {
        console.error('No token found');
    }
};

// Handle the image uploaded event
const handleImageUploaded = async () => {
    if (token && userStore.userData?.id) {
        try {
            // Fetch the updated user data
            const updatedUserData = await apiService.searchUsersByID(token, userStore.userData.id);
            userStore.setUserData(updatedUserData[0]); // Update the user data in the store
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    } else {
        console.error('No token found');
    }
};
</script>

<template>
    <v-card elevation="0">
        <v-tabs v-model="tab" color="primary" align-tabs="left">
            <v-tab value="1"> Documents</v-tab>
            <v-tab value="2"> Verification </v-tab>
        </v-tabs>

        <v-card-text class="rounded-md pa-0 mt-6">
            <v-window v-model="tab">
                <!-- Voter ID Section -->
                <v-window-item value="1">
                    <v-card elevation="0">
                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-h6">Document Type</th>
                                    <th class="text-h6 ps-6">ID</th>
                                    <th class="text-h6">Expiry</th>
                                    <th class="text-h6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- KYC Document Section -->
                                <tr class="month-item" v-if="userData?.kyc_document_url !== null">
                                    <td>
                                        <p class="text-16 textPrimary">{{ getDocType(userData?.kyc_document_type || '') }}</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary">{{ userData?.kyc_document_id }}</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary" v-if="userData?.kyc_document_type !== 'VOTERID'">
                                            {{ userData?.kyc_document_expiry_date }}
                                        </p>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                icon
                                                @click="
                                                    viewItem(
                                                        userData?.kyc_document_url || '',
                                                        getDocType(userData?.kyc_document_type || '')
                                                    )
                                                "
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="primary">mdi-eye</v-icon>
                                            </v-btn>
                                            <KycDialog
                                                :show-dialog="dialog"
                                                :document-type="userData?.kyc_document_type || ''"
                                                :document-url="userData?.kyc_document_url || ''"
                                                @update:showDialog="dialog = $event"
                                                @imageUploaded="handleImageUploaded"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr class="month-item" v-if="userData?.kyc_document_url === null">
                                    <td>
                                        <v-alert type="error" density="compact" class="single-line-alert">
                                            <div class="d-flex align-center justify-space-between">
                                                <span>No KYC image found. Please add a new image.</span>
                                                <v-btn flat color="primary" size="small" class="ml-2"> Add Image </v-btn>
                                            </div>
                                        </v-alert>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <!-- Selfie Section -->
                                <tr class="month-item">
                                    <td>
                                        <p class="text-16 textPrimary">Selfie</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                icon
                                                @click="viewItem(userData?.selfie_img_url || '', 'Selfie Image')"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="primary">mdi-eye</v-icon>
                                            </v-btn>

                                            <selfieDialog
                                                :show-dialog="dialog"
                                                @update:showDialog="dialog = $event"
                                                @selfieImageUploaded="handleImageUploaded"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <!-- Signature Section -->
                                <tr class="month-item">
                                    <td>
                                        <p class="text-16 textPrimary">Signature</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                icon
                                                @click="viewItem(userData?.signature_url || '', 'Signature Image')"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="primary">mdi-eye</v-icon>
                                            </v-btn>

                                            <signatureDialog
                                                :show-dialog="dialog"
                                                @update:showDialog="dialog = $event"
                                                @signatureImageUploaded="handleImageUploaded"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <!-- Business Registration Section -->
                                <tr
                                    class="month-item"
                                    v-if="
                                        userData?.company_reg_img_url !== null ||
                                        (userData?.user_type_id !== 2 && userData?.user_type_id !== 1)
                                    "
                                >
                                    <td>
                                        <p class="text-16 textPrimary">Business Registration</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                icon
                                                @click="viewItem(userData?.company_reg_img_url || '', 'Business Registration')"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="primary">mdi-eye</v-icon>
                                            </v-btn>

                                            <businessRegistrationDialog
                                                :show-dialog="dialog"
                                                @update:showDialog="dialog = $event"
                                                @businessRegistrationImageUploaded="handleImageUploaded"
                                            />
                                        </div>
                                    </td>
                                </tr>

                                <tr
                                    class="month-item"
                                    v-if="
                                        userData?.company_reg_img_url === null &&
                                        userData?.user_type_id !== 2 &&
                                        userData?.user_type_id !== 1
                                    "
                                >
                                    <td>
                                        <v-alert type="error" density="compact" class="single-line-alert">
                                            <div class="d-flex align-center justify-space-between">
                                                <span>No Business Registration found. Please add a new image.</span>
                                                <v-btn flat color="primary" size="small" class="ml-2"> Add Image </v-btn>
                                            </div>
                                        </v-alert>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <!-- Company T.I.N Section -->
                                <tr
                                    class="month-item"
                                    v-if="
                                        userData?.company_tin_img_url !== null ||
                                        (userData?.user_type_id !== 2 && userData?.user_type_id !== 1)
                                    "
                                >
                                    <td>
                                        <p class="text-16 textPrimary">Company T.I.N</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary"></p>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                icon
                                                @click="viewItem(userData?.company_tin_img_url || '', 'Company T.I.N')"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="primary">mdi-eye</v-icon>
                                            </v-btn>

                                            <businessTINDialog
                                                :show-dialog="dialog"
                                                @update:showDialog="dialog = $event"
                                                @businessTINImageUploaded="handleImageUploaded"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr
                                    class="month-item"
                                    v-if="
                                        userData?.company_reg_img_url === null &&
                                        userData?.user_type_id !== 2 &&
                                        userData?.user_type_id !== 1
                                    "
                                >
                                    <td>
                                        <v-alert type="error" density="compact" class="single-line-alert">
                                            <div class="d-flex align-center justify-space-between">
                                                <span>No Company T.I.N found. Please add a new image.</span>
                                                <v-btn flat color="primary" size="small" class="ml-2"> Add Image </v-btn>
                                            </div>
                                        </v-alert>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-window-item>

                <v-window-item value="2">
                    <v-card elevation="0" v-if="userData?.is_kyc_verified === true">
                        <v-card-title class="pa-5">
                            <span class="text-h5">Verification Information</span>
                        </v-card-title>
                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-h6">Verifier Name</th>
                                    <th class="text-h6 ps-6">User ID</th>
                                    <th class="text-h6 ps-6">Username</th>
                                    <th class="text-h6 ps-6">Phone Contact</th>
                                    <th class="text-h6 ps-6">Email Contact</th>
                                    <th class="text-h6 ps-6">Verified on</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- KYC Document Section -->
                                <tr class="month-item" v-if="userData?.kyc_document_url !== null">
                                    <td>
                                        <p class="text-16 textPrimary">{{ verifierInformation.name }}</p>
                                    </td>

                                    <td>
                                        <p class="text-16 textPrimary">{{ verifierInformation.userID }}</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary">{{ verifierInformation.username }}</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary">{{ verifierInformation.phone }}</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary">{{ verifierInformation.email }}</p>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary">{{ userData?.kyc_verified_at }}</p>
                                    </td>
                                </tr>
                            </tbody></v-table
                        >
                        <br />
                        <br />
                    </v-card>

                    <v-card elevation="0" v-if="userActivity.length > 0"
                        ><v-card-title class="pa-5">
                            <span class="text-h5">Rejection Information</span>
                        </v-card-title>

                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-h6">Rejected By</th>
                                    <th class="text-h6 ps-6">User ID</th>
                                    <th class="text-h6 ps-6">Rejected on</th>
                                    <th class="text-h6 ps-6">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in userActivity" :key="item.id" class="month-item">
                                    <td>
                                        <p class="text-16 textPrimary">{{ item.action_user_full_name }}</p>
                                    </td>

                                    <td>
                                        <h6 class="text-h6">{{ item.action_user_id }}</h6>
                                    </td>
                                    <td>
                                        <p class="text-16 textPrimary">{{ item.created_at }}</p>
                                    </td>

                                    <td>
                                        <h6 class="text-h6">{{ item.remark }}</h6>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>

    <v-dialog v-model="kycDialog" class="dialog-mw">
        <v-card>
            <v-card-title class="pa-5">
                <span class="text-h5">{{ kycDocument.type }}</span>
            </v-card-title>

            <v-card-text>
                <v-img :src="kycDocument.docURL" alt="Document Image" class="mb-5" max-width="auto" />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer> <v-btn color="primary" @click="closeKycDialog" variant="tonal">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
