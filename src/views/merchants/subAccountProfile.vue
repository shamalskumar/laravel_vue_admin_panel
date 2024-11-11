<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';
import { UserCircleIcon, ReportIcon, WalletIcon, DetailsIcon, FileInfoIcon, EditCircleIcon, UserEditIcon } from 'vue-tabler-icons';
import profilePictureDialog from '@/components/ui-components/dialogs/profilePictureDialog.vue'; // Import your signatureiaDialog component

// components
import IntroCard from '@/components/apps/user-profile/IntroCard.vue';
import UserAccountDetailsTab from '@/components/ui-components/tabs/UserAccountDetailsTab.vue';
import UserAccountDocumentsTab from '@/components/ui-components/tabs/UserAccountDocumentsTab.vue';
import UserAccountTransactionalReportTab from '@/components/ui-components/tabs/UserAccountTransactionalReportTab.vue';
import profileBg from '@/assets/images/backgrounds/profilebg.jpg';
import { useUserStore } from '@/stores/userStore'; // Adjust the path as necessary
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';

import type { City, Country, Income, BusinessType, MerchantCategory } from '@/models/userModel';

import VueQrcode from 'vue-qrcode';
const qrLink = ref<string | undefined>(undefined); // qrLink can be string or undefined

onMounted(async () => {
    qrLink.value = await getQrLink();
});
const getQrLink = async () => {
    if (userStore.userData?.id) {
        return 'https://link.visionpay.app/pay?user_id=' + userStore.userData.id;
    }
};

// Dialog state
const sendFundDialog = ref(false);
const rejectKYCDialog = ref(false);
const editProfileDialog = ref(false);
const remark = ref(''); // To hold the input remark

const tab = ref(0);
const items = shallowRef([
    { tab: 'Details', icon: UserCircleIcon, value: '0' },
    { tab: 'Account Information', icon: DetailsIcon, value: '1' },
    { tab: 'KYC Documents', icon: FileInfoIcon, value: '2' },
    { tab: 'Report', icon: ReportIcon, value: '3' }
]);

const userStore = useUserStore();
const userData = computed(() => userStore.userData); // Use computed for reactivity

const page = ref({ title: 'Merchant Profile' });
const breadcrumbs = ref([
    {
        text: 'Merchants',
        disabled: true,
        href: '#'
    }
]);

const countries = ref<Country[]>([]); // Store countries from the API with the correct type
const cities = ref<City[]>([]); // Store cities from the API with the correct type
const incomeSources = ref<Income[]>([]); // Store cities from the API with the correct type
const businessTypes = ref<BusinessType[]>([]); // Store cities from the API with the correct type
const merchantTypes = ref<MerchantCategory[]>([]); // Store cities from the API with the correct type

// Reactive object to hold form data
const formUserData = ref({
    city_id: 0,
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    address: '',
    country: 0, // This will hold the selected country ID or object
    company_tin_no: '',
    business_name: '',
    business_type_id: 0,
    merchant_category_id: 0
});

// Reactive object to hold form data
const formSendFundData = ref({
    amount: '',
    send_to: userStore.userData?.id,
    transaction_pin: '',
    description: '',
    is_wallet_refill: 1
});

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Reactive object to hold form data
const formData = ref({
    remark: '',
    event: 'KYC_REJECTED'
});

// Open the KYC rejection dialog
const openRemarkDialog = () => {
    rejectKYCDialog.value = true;
};

// Open the Send Func dialog
const openSendFundDialog = () => {
    sendFundDialog.value = true;
};
// Close the Send Func dialog
const closeSendFundDialog = () => {
    sendFundDialog.value = false;

    (formSendFundData.value.amount = ''), (formSendFundData.value.transaction_pin = ''), (formSendFundData.value.description = '');
};

// Open the Edit User dialog
const openEditUserDialog = async () => {
    editProfileDialog.value = true;
    try {
        if (token) {
            const fetchedCountries = await apiService.getAllCountry(token);
            countries.value = fetchedCountries; // Store fetched countries

            const fetchedSources = await apiService.getIncomeSource(token);
            incomeSources.value = fetchedSources; // Store fetched income sources

            const fetchedBusinessTypes = await apiService.getBusinessTypeData(token);
            businessTypes.value = fetchedBusinessTypes; // Store fetched income sources

            const fetchedMerchantCategories = await apiService.getMerchantCategoryData(token);
            merchantTypes.value = fetchedMerchantCategories; // Store fetched income sources
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
    if (userStore) {
        (formUserData.value.first_name = userStore.userData!.first_name || ''),
            (formUserData.value.middle_name = userStore.userData!.middle_name || ''),
            (formUserData.value.last_name = userStore.userData!.last_name || ''),
            (formUserData.value.date_of_birth = userStore.userData!.date_of_birth || ''),
            (formUserData.value.address = userStore.userData!.address || ''),
            (formUserData.value.company_tin_no = userStore.userData!.business.company_tin_no || ''),
            (formUserData.value.country = userStore.userData!.city.country_id),
            (formUserData.value.city_id = userStore.userData!.city_id);
        formUserData.value.business_name = userStore.userData!.business.business_name;
        formUserData.value.business_type_id = userStore.userData!.business.business_type_id;
        formUserData.value.merchant_category_id = userStore.userData!.business.merchant_category_id;
    }
};

// Watch for changes in the selected country
watch(
    () => formUserData.value.country,
    async (newCountry) => {
        if (newCountry && token) {
            // Fetch cities for the selected country
            try {
                const fetchedCities = await apiService.getCitiesByCountryId(token, Number(newCountry));
                cities.value = fetchedCities; // Store fetched cities
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        } else {
            cities.value = []; // Clear cities if no country is selected
        }
    }
);

// Close the KYC rejection dialog
const closeRemarkDialog = () => {
    rejectKYCDialog.value = false;
    remark.value = ''; // Reset the remark field when closing
};

// Close the KYC rejection dialog
const closeProfileDialog = () => {
    editProfileDialog.value = false;
    (formUserData.value.city_id = 0),
        (formUserData.value.first_name = ''),
        (formUserData.value.last_name = ''),
        (formUserData.value.middle_name = ''),
        (formUserData.value.date_of_birth = ''),
        (formUserData.value.address = ''),
        (formUserData.value.country = 0), // This will hold the selected country ID or object
        (formUserData.value.company_tin_no = '');
    formUserData.value.business_name = '';
    formUserData.value.business_type_id = 0;
    formUserData.value.merchant_category_id = 0;
};

const gender = ref(['MALE', 'FEMALE']);

// Upload image to external API
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

// Method to handle form submission
const submitForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        // Ensure the username starts with $

        if (userStore.userData?.id) {
            // Send formData in the API request
            const response = await apiService.updateUser(token, userStore.userData?.id, formUserData.value);

            if (!response) {
                throw new Error('Error updating user');
            }
            searchUsersByID();
            closeProfileDialog();
            console.log('User updated successfully:', response);
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error updating user:', error);
        // Handle error (e.g., show an error message)
    }
};

// Method to handle form submission
const submitAddFundForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (userStore.userData?.id) {
            // Send formData in the API request
            const response = await apiService.sendFunds(token, formSendFundData.value);

            if (!response) {
                throw new Error('Error adding fund');
            }
            searchUsersByID();
            closeSendFundDialog();
            console.log('User funds added successfully:', response);
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding fund:', error);
        // Handle error (e.g., show an error message)
    }
};

// Handle the image uploaded event
const handleImageUploaded = async () => {
    if (token && userStore.userData?.id) {
        try {
            // Fetch the updated user data
            searchUsersByID();
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    } else {
        console.error('No token found');
    }
};

const searchUsersByID = async () => {
    // Fetch the updated user data

    if (token && userStore.userData?.id) {
        const updatedUserData = await apiService.searchUsersByID(token, userStore.userData.id);
        userStore.setUserData(updatedUserData[0]); // Update the user data in the store
    }
};

const showDialog = ref(false);

// Open the dialog
const openDialog = () => {
    showDialog.value = true;
};

// Update dialog visibility
const updateDialog = (value: boolean) => {
    showDialog.value = value;
};

const limitInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Remove any non-digit characters
    input.value = input.value.replace(/\D/g, '').slice(0, 4); // Limit to 4 digits
    formSendFundData.value.transaction_pin = input.value; // Update model
};
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="overflow-hidden">
        <img :src="profileBg" alt="profile" class="w-100" />
        <div>
            <v-row class="mt-1">
                <v-col cols="12" lg="4" sm="4" class="order-sm-second">
                    <div class="px-4 py-1">
                        <v-row class="justify-center">
                            <v-col class="text-center">
                                <WalletIcon size="20" />
                                <h4 class="text-h4">${{ userData?.wallet.balance }}</h4>
                                <h6 class="text-h6 font-weight-regular">Balance</h6>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>

                <!-- Avatar and Username -->
                <v-col cols="12" lg="4" sm="4" class="d-flex justify-center order-sml-first">
                    <div class="text-center top-spacer">
                        <div class="avatar-border">
                            <v-avatar size="100" class="userImage">
                                <img :src="userData?.master_account.profile_pic_img_url" width="100" alt="Profile Image" />
                            </v-avatar>
                        </div>
                        <h5 class="text-h5 mt-3">{{ userData?.full_name }}</h5>
                        <span class="textSecondary font-weight-regular">{{ userData?.username }}</span>
                    </div>
                </v-col>
                <v-col cols="12" lg="2" sm="2" class="order-sm-third">
                    <div class="px-4 py-1">
                        <v-row class="justify-center">
                            <v-col cols="4" class="text-center">
                                <vue-qrcode
                                    v-if="qrLink"
                                    :value="qrLink"
                                    type="image/png"
                                    :color="{ dark: '#000000', light: '#ffffff' }"
                                    style="width: 100px; height: 100px"
                                />
                            </v-col>
                        </v-row>
                    </div>
                </v-col>

                <!-- Social and Action Buttons -->
                <v-col cols="12" lg="12" class="d-flex align-center justify-center justify-lg-center order-sm-third">
                    <div class="d-flex flex-column align-center px-10 py-1">
                        <!-- Social Buttons Row -->
                        <div class="d-flex justify-space-between mb-3">
                            <v-btn icon variant="flat" size="x-small" color="secondary" class="mx-1" @click="openEditUserDialog">
                                <UserEditIcon size="16" />
                            </v-btn>
                            <v-btn icon variant="flat" size="x-small" color="secondary" class="mx-1" @click="openDialog">
                                <PhotoEditIcon size="16" />
                            </v-btn>

                            <!-- Dialog Component -->
                            <profilePictureDialog
                                :show-dialog="showDialog"
                                @update:showDialog="updateDialog"
                                @profilePictureImageUploaded="handleImageUploaded"
                            />
                            <v-btn icon variant="flat" size="x-small" color="secondary" class="mx-1" @click="openSendFundDialog">
                                <UserDollarIcon size="16" />
                            </v-btn>
                        </div>
                        <!-- Action Buttons Row -->
                        <div class="d-flex justify-space-between">
                            <v-btn variant="flat" color="primary" size="small" class="mx-1">Block Account</v-btn>
                            <v-btn variant="flat" color="primary" size="small" class="mx-1">Block Wallet</v-btn>
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
                                >Reject KYC</v-btn
                            >
                        </div>
                    </div>
                </v-col>

                <!-- Tabs -->
                <v-col md="12" class="order-sm-last">
                    <v-tabs v-model="tab" color="primary" class="profiletab bg-lightprimary">
                        <v-tab v-for="item in items" :key="item.tab" class="font-weight-regular text-subtitle-1">
                            <component :is="item.icon" size="18" stroke-width="1.5" class="mr-2"></component>
                            {{ item.tab }}
                        </v-tab>
                    </v-tabs>
                </v-col>
            </v-row>
        </div>
    </v-card>

    <v-row class="mt-4">
        <v-col v-if="tab === 0" cols="12" lg="12" md="12">
            <UiChildCard title="Details">
                <IntroCard :userData="userData" />
            </UiChildCard>
        </v-col>
        <v-col v-if="tab === 1" cols="12" lg="12">
            <UiChildCard title="Account Information">
                <UserAccountDetailsTab />
            </UiChildCard>
        </v-col>
        <v-col v-if="tab === 2" cols="12" lg="12">
            <UiChildCard title="KYC Documents">
                <UserAccountDocumentsTab />
            </UiChildCard>
        </v-col>
        <v-col v-if="tab === 3" cols="12" lg="12">
            <UiChildCard title="Report">
                <UserAccountTransactionalReportTab />
            </UiChildCard>
        </v-col>
    </v-row>

    <!-- Send Fund Dialog -->

    <v-dialog v-model="sendFundDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add Funds</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Please enter amount*"
                                v-model="formSendFundData.amount"
                                required
                                type="number"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Please provide Description*"
                                v-model="formSendFundData.description"
                                required
                                type="text"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <!-- <v-text-field
                                label="Please enter transaction pin*"
                                v-model="formSendFundData.transaction_pin"
                                required
                                type="text"
                                maxlength="4"
                                @input="limitInput"
                            ></v-text-field> -->

                            <v-otp-input
                                length="4"
                                label="Please enter transaction pin*"
                                required
                                v-model="formSendFundData.transaction_pin"
                                focus-all
                                focused
                            ></v-otp-input>
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeSendFundDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitAddFundForm" variant="tonal" flat> Add </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>

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

    <!-- Edit Profile Dialog -->

    <v-dialog v-model="editProfileDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Update Details</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit First Name" v-model="formUserData.first_name" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Middle Name" v-model="formUserData.middle_name" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Last Name" v-model="formUserData.last_name" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Business Name" v-model="formUserData.business_name" required></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                color="primary"
                                variant="outlined"
                                type="date"
                                label="Edit Date of Birth"
                                v-model="formUserData.date_of_birth"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Address" v-model="formUserData.address" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Business TIN" v-model="formUserData.company_tin_no" required></v-text-field>
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit Gender"
                                :items="gender"
                                v-model="formUserData.gender"
                                item-title="gender"
                                item-value="gender"
                                variant="outlined"
                            ></v-select>
                        </v-col>
                    </v-row> -->
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit Country"
                                v-model="formUserData.country"
                                :items="countries"
                                item-value="id"
                                item-title="country_name"
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit City"
                                v-if="formUserData.country"
                                v-model="formUserData.city_id"
                                :items="cities"
                                item-value="id"
                                item-title="city_name"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit Business Type"
                                v-model="formUserData.business_type_id"
                                :items="businessTypes"
                                item-value="id"
                                item-title="business_type"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit Merchant Category"
                                v-model="formUserData.merchant_category_id"
                                :items="merchantTypes"
                                item-value="id"
                                item-title="category_name"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeProfileDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitForm" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<!-- // amount, transaction_pin, send_to, description,is_wallet_refill -->
<style lang="scss">
.avatar-border {
    background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
    border-radius: 50%;
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    .userImage {
        border: 4px solid rgb(255, 255, 255);
    }
}

.top-spacer {
    margin-top: -95px;
}

.profiletab .v-slide-group__content {
    justify-content: end;
    .v-btn--variant-text .v-btn__overlay {
        background: transparent;
    }
}

@media (max-width: 1023px) {
    .order-sm-second {
        order: 2;
    }
    .order-sml-first {
        order: 1;
    }
    .order-sm-third {
        order: 3;
    }
    .order-sm-last {
        order: 4;
    }
}

.btn-brand-facebook {
    background-color: rgb(24, 119, 242) !important;
}

.btn-brand-twitter {
    background-color: rgb(29, 161, 242) !important;
}
.btn-brand-dribbble {
    background-color: rgb(234, 76, 137) !important;
}
.btn-brand-youtube {
    background-color: rgb(205, 32, 31) !important;
}
</style>
