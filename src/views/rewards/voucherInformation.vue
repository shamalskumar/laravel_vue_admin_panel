<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';
import { UserCircleIcon, ReportIcon, WalletIcon, DetailsIcon, FileInfoIcon, EditCircleIcon, UserEditIcon } from 'vue-tabler-icons';

// components
import InformationCard from '@/components/apps/user-profile/InformationCard.vue';
import VoucherReportTab from '@/components/ui-components/tabs/VoucherReportTab.vue';
import { useVoucherStore } from '@/stores/voucherStore'; // Adjust the path as necessary
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';

import type { City, Country, Income } from '@/models/userModel';
import type { VoucherDetails } from '@/models/voucherModel';

// Dialog state
const sendFundDialog = ref(false);
const rejectKYCDialog = ref(false);
const editVoucherDialog = ref(false);
const remark = ref(''); // To hold the input remark
const cashBackType = ref(['FIXED_AMOUNT', 'PERCENTAGE']);

const vouchers = ref<VoucherDetails[]>([]); // Store vouchers from the API with the correct type

const tab = ref(0);
const items = shallowRef([
    { tab: 'Information', icon: UserCircleIcon, value: '0' },

    { tab: 'Report', icon: ReportIcon, value: '1' }
]);

const voucherStore = useVoucherStore();
const voucherData = computed(() => voucherStore.voucherData); // Use computed for reactivity

const page = ref({ title: 'Voucher Information' });
const breadcrumbs = ref([
    {
        text: 'Rewards',
        disabled: true,
        href: '#'
    }
]);

const countries = ref<Country[]>([]); // Store countries from the API with the correct type
const cities = ref<City[]>([]); // Store cities from the API with the correct type
const incomeSources = ref<Income[]>([]); // Store cities from the API with the correct type

// Reactive object to hold form data
const formvoucherData = ref({
    promotion_name: '',
    expiry_date: '',
    min_txn_amount: '',
    cashback_amount: '',
    voucher_description: '',
    cashback_type: '',
    reward_upto_max_amount: ''
});

// Reactive object to hold form data
const formSendFundData = ref({
    amount: '',
    send_to: voucherStore.voucherData?.id,
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
const openEditVoucherDialog = async () => {
    editVoucherDialog.value = true;

    if (voucherStore) {
        (formvoucherData.value.promotion_name = voucherStore.voucherData!.promotion_name || ''),
            (formvoucherData.value.expiry_date = voucherStore.voucherData!.voucher.data.expiry_date || ''),
            (formvoucherData.value.min_txn_amount = voucherStore.voucherData!.voucher.data.min_txn_amount || ''),
            (formvoucherData.value.cashback_amount = voucherStore.voucherData!.voucher.data.cashback_amount || ''),
            (formvoucherData.value.voucher_description = voucherStore.voucherData!.voucher.data.voucher_description || ''),
            (formvoucherData.value.cashback_type = voucherStore.voucherData!.voucher.data.cashback_type || ''),
            (formvoucherData.value.reward_upto_max_amount = voucherStore.voucherData!.voucher.data.reward_upto_max_amount || '');
    }
};

// Close the KYC rejection dialog
const closeRemarkDialog = () => {
    rejectKYCDialog.value = false;
    remark.value = ''; // Reset the remark field when closing
};

// Close the KYC rejection dialog
const closeVoucherDialog = () => {
    editVoucherDialog.value = false;
    (formvoucherData.value.promotion_name = ''),
        (formvoucherData.value.expiry_date = ''),
        (formvoucherData.value.voucher_description = ''),
        (formvoucherData.value.cashback_type = ''),
        (formvoucherData.value.min_txn_amount = ''),
        (formvoucherData.value.cashback_amount = ''),
        (formvoucherData.value.reward_upto_max_amount = '');
};

const gender = ref(['MALE', 'FEMALE']);

// Method to handle form submission
const submitForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (voucherStore.voucherData?.id) {
            // Send formData in the API request
            const response = await apiService.updateVoucherInformation(token, voucherStore.voucherData?.id, formvoucherData.value);

            if (!response) {
                throw new Error('Error updating user');
            }
            getvouchers(voucherStore.voucherData?.id);
            closeVoucherDialog();
            console.log('Voucher updated successfully:', response);
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error updating Voucher:', error);
        // Handle error (e.g., show an error message)
    }
};

const disableItem = async (id: number) => {
    if (token && id) {
        try {
            // Update the transfer limit scheme (assuming you have a method for this)
            await apiService.updateVoucher(false, id, token);
            // Fetch the updated schemes again if necessary
            getvouchers(id);
        } catch (error) {
            console.error('Error saving transfer limit scheme:', error);
        }
    } else {
        console.error('No token found');
    }
};

const enableItem = async (id: number) => {
    if (token && id) {
        try {
            // Update the transfer limit scheme (assuming you have a method for this)
            await apiService.updateVoucher(true, id, token);
            // Fetch the updated schemes again if necessary
            getvouchers(id);
        } catch (error) {
            console.error('Error saving transfer limit scheme:', error);
        }
    } else {
        console.error('No token found');
    }
};

const getvouchers = async (id: number) => {
    try {
        if (token) {
            const updatedVoucherData = await apiService.getVoucherByID(token, id);

            voucherStore.setUserData(updatedVoucherData[0]);
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching vouchers:', error);
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
        <div>
            <v-row class="mt-1">
                <v-col cols="12" lg="8" sm="12" class="order-sm-second">
                    <div class="px-4 py-1">
                        <v-row class="justify-center">
                            <v-col cols="4" class="text-center"
                                ><br />
                                <h4 class="text-h4">{{ voucherData?.promotion_name }}</h4>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>

                <!-- Social and Action Buttons -->
                <v-col cols="12" lg="4" sm="12" class="d-flex align-center justify-center justify-lg-end order-sm-third">
                    <div class="d-flex flex-column align-center px-10 py-1">
                        <!-- Social Buttons Row -->
                        <div class="d-flex justify-space-between mb-3">
                            <v-btn icon variant="flat" size="x-small" color="secondary" class="mx-1" @click="openEditVoucherDialog">
                                <EditIcon size="16" />
                            </v-btn>
                        </div>
                        <!-- Action Buttons Row -->
                        <div class="d-flex justify-space-between">
                            <v-btn
                                v-if="voucherData?.voucher.data.is_active === false"
                                @click="enableItem(voucherData.id)"
                                variant="flat"
                                color="success"
                                size="small"
                                class="mx-1"
                                >Enable Voucher</v-btn
                            >
                            <v-btn
                                v-if="voucherData?.voucher.data.is_active === true"
                                @click="disableItem(voucherData.id)"
                                variant="flat"
                                color="error"
                                size="small"
                                class="mx-1"
                                >Disable Voucher</v-btn
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
            <UiChildCard title="Information">
                <InformationCard :voucherData="voucherData" />
            </UiChildCard>
        </v-col>

        <v-col v-if="tab === 1" cols="12" lg="12">
            <UiChildCard title="Voucher Redeem Report">
                <VoucherReportTab />
            </UiChildCard>
        </v-col>
    </v-row>

    <v-dialog v-model="editVoucherDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Update Details</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Promotion Name" v-model="formvoucherData.promotion_name" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Edit Expiry Date"
                                v-model="formvoucherData.expiry_date"
                                required
                                type="Date"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Edit Voucher Description"
                                v-model="formvoucherData.voucher_description"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit Cashback Type"
                                :items="cashBackType"
                                v-model="formvoucherData.cashback_type"
                                item-title="gender"
                                item-value="gender"
                                variant="outlined"
                            ></v-select>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Edit Minimum Transaction Amount"
                                v-model="formvoucherData.min_txn_amount"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Edit Cashback Amount" v-model="formvoucherData.cashback_amount" required></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Edit Reward Upto Max Amount"
                                v-model="formvoucherData.reward_upto_max_amount"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeVoucherDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitForm()" variant="tonal" flat> Update </v-btn>
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
