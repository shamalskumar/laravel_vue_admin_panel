<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue';
import type { User, MerchantCategory, BusinessType, BillerCategory, Biller } from '@/models/userModel'; // Import your User type
import {
    BuildingFactory2Icon,
    BuildingIcon,
    BusinessplanIcon,
    CurrencyDollarAustralianIcon,
    FileCertificateIcon,
    FileIcon,
    GenderFemaleIcon,
    GenderMaleIcon,
    PhoneCallIcon,
    UserDollarIcon,
    UserIcon
} from 'vue-tabler-icons';
import { apiService } from '@/api/apiService';

import { useAuthStore } from '@/stores/auth';
import { useVoucherStore } from '@/stores/voucherStore';
import type { Country, Income } from '@/models/userModel';
import type { VoucherDetails } from '@/models/voucherModel';
import { useUserStore } from '@/stores/userStore'; // Adjust the path as necessary
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const authStore = useAuthStore();
const token = authStore.token;
const useVoucher = useVoucherStore();

const income = ref<Income[]>([]); // Reactive income array
const country = ref<string>(''); // Reactive country string
const merchantCategory = ref<MerchantCategory[]>([]); // Reactive merchant category array
const billerCategory = ref<BillerCategory[]>([]); // Reactive merchant category array
const businessType = ref<BusinessType[]>([]); // Reactive business type array
const filteredIncomeSource = ref<string | null>(null); // Reactive to store filtered income source
const filteredMerchantCategoryData = ref<string | null>(null); // Reactive to store filtered merchant category
const filteredBillerCategoryData = ref<string | null>(null); // Reactive to store filtered merchant category
const filteredBusinessCategoryData = ref<string | null>(null); // Reactive to store filtered business category
const userStore = useUserStore();
const isLoading = ref(false); // Loading state
const merchantName = ref(''); // Reactive variable for merchant name
const billerName = ref(''); // Reactive variable for biller name

const props = defineProps({
    voucherData: {
        type: Object as () => VoucherDetails | null,
        required: true
    }
});

function getNumber(): number {
    const result = 42; // Example data
    return result;
}

async function getMerchantUsers() {
    try {
        isLoading.value = true; // Start loading
        if (token && props.voucherData?.voucher.data.user_id) {
            const userData = await apiService.searchUsersByID(token, Number(props.voucherData?.voucher.data.user_id));
            // userStore.setUserData(userData[0]); // Update the user data in the store

            merchantName.value = userData[0].business.business_name; // Store the merchant name
        } else {
            console.error('No token or user data found');
        }
    } catch (error) {
        console.error('Error fetching merchant data:', error);
    } finally {
        isLoading.value = false; // End loading
    }
}

async function getBillerUsers() {
    try {
        isLoading.value = true; // Start loading
        if (token && props.voucherData?.voucher.data.user_id) {
            const userData = await apiService.getBillerByID(token, Number(props.voucherData?.voucher.data.user_id));

            billerName.value = userData.biller_name; // Store the biller name
        } else {
            console.error('No token or user data found');
        }
    } catch (error) {
        console.error('Error fetching biller data:', error);
    } finally {
        isLoading.value = false; // End loading
    }
}
// Fetch data when the component is mounted
onMounted(() => {
    if (props.voucherData?.voucher.data.voucher_for === 'MERCHANT_PAYMENT') {
        getMerchantUsers();
    } else if (props.voucherData?.voucher.data.voucher_for === 'BILL_PAYMENT') {
        getBillerUsers();
    }
});

//Method to convert string to Title Case

const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
</script>

<template>
    <v-card elevation="0">
        <v-card-item>
            <v-row>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Voucher For: {{ voucherData?.voucher.data.voucher_for }}</span>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    v-if="
                        voucherData?.voucher.data.voucher_for === 'BILL_PAYMENT' ||
                        voucherData?.voucher.data.voucher_for === 'MERCHANT_PAYMENT'
                    "
                >
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6" v-if="voucherData?.voucher.data.voucher_for === 'BILL_PAYMENT'">
                            Voucher For: {{ billerName }}
                        </span>
                        <span class="text-h6" v-if="voucherData?.voucher.data.voucher_for === 'MERCHANT_PAYMENT'">
                            Voucher For: {{ merchantName }}
                        </span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Voucher Code: {{ voucherData?.voucher.code }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Voucher Type: {{ voucherData?.voucher.data.voucher_type }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Cashback Type: {{ voucherData?.voucher.data.cashback_type }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Min Transaction Amount: ${{ voucherData?.voucher.data.min_txn_amount }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span v-if="voucherData?.voucher.data.cashback_type === 'FIXED_AMOUNT'" class="text-h6"
                            >Cashback Amount: ${{ voucherData?.voucher.data.cashback_amount }}</span
                        >
                        <span v-if="voucherData?.voucher.data.cashback_type === 'PERCENTAGE'" class="text-h6"
                            >Cashback Amount: {{ voucherData?.voucher.data.cashback_amount }}%</span
                        >
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Reward Upto Max Amount: ${{ voucherData?.voucher.data.reward_upto_max_amount }}</span>
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Creation Date: {{ formatDate(voucherData!.created_at) }}</span>
                    </div>
                </v-col>

                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Expiry Date: {{ formatDate(voucherData!.voucher.expires_at) }}</span>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
