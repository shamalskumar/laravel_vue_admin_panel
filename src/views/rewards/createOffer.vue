<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';
import type { City, Country, Income, User, Biller } from '@/models/userModel';

const countries = ref<Country[]>([]); // Store countries from the API with the correct type
const cities = ref<City[]>([]); // Store cities from the API with the correct type
const incomeSources = ref<Income[]>([]); // Store cities from the API with the correct type

const billers = ref<Biller[]>([]);
const merchants = ref<User[]>([]);

const voucherFor = ref(['FUND_REQUEST', 'DEPOSIT', 'BILL_PAYMENT', 'MERCHANT_PAYMENT']);
const cashBackType = ref(['FIXED_AMOUNT', 'PERCENTAGE']);
const voucherType = ref(['INSTANT', 'RETURNING']);
const page = ref({ title: 'Create Promotion Offer' });
const breadcrumbs = ref([
    {
        text: 'Rewards',
        disabled: true,
        href: '#'
    }
]);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Validation rules
const requiredRule = (v: any) => !!v || 'This field is required';
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid';

// Reactive object to hold form data
const formData = ref({
    promotion_name: '',
    voucher_for: '',
    expiry_date: '',
    min_txn_amount: '',
    cashback_type: '',
    cashback_amount: '',
    voucher_type: '',
    reward_upto_max_amount: '',
    voucher_description: '',
    user_id: ''
});

const OTPSent = ref(false); // Change OTPSent to ref
const showOTPSentAlert = ref(false); // Change OTPSent to ref

// Fetch users when component is mounted
onMounted(async () => {
    try {
        if (token) {
            const fetchedCountries = await apiService.getAllCountry(token);
            countries.value = fetchedCountries; // Store fetched countries

            const fetchedSources = await apiService.getIncomeSource(token);
            incomeSources.value = fetchedSources; // Store fetched income sources
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
});
// Watch for changes in the selected voucher_for
watch(
    () => formData.value.voucher_for,
    async (newVoucherFor) => {
        // Check if the voucher_for matches 'BILL_PAYMENT' or 'MERCHANT_PAYMENT'
        if (['BILL_PAYMENT', 'MERCHANT_PAYMENT'].includes(newVoucherFor) && token) {
            // Fetch cities for the selected voucher type
            try {
                if (newVoucherFor === 'BILL_PAYMENT') {
                    const fetchedBillers = await apiService.getAllUsers(token, 5);
                    billers.value = fetchedBillers; // Store fetched cities
                } else {
                    const fetchedMerchants = await apiService.getAllUsersVerified(token, 4);
                    merchants.value = fetchedMerchants; // Store fetched cities
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        } else {
            merchants.value = []; // Clear cities if the condition isn't met
            billers.value = []; // Clear cities if the condition isn't met
        }
    }
);

// Method to handle form submission
const submitForm = async () => {
    console.log(formData.value);
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        // Send formData in the API request
        const response = await apiService.createPromotion(token, formData.value);

        if (!response) {
            throw new Error('Error creating promotion');
        }

        console.log('Promotion added successfully:', response);
        // Handle success (e.g., redirect, show a message)
    } catch (error) {
        console.error('Error adding promotion:', error);
        // Handle error (e.g., show an error message)
    }
};
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <UiParentCard title="Enter New Promotion Information" class="mt-6">
                <v-row>
                    <v-col cols="12" lg="12">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Promotion Name</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.promotion_name"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Voucher For</v-label>
                                <v-select
                                    :items="voucherFor"
                                    v-model="formData.voucher_for"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6" v-if="formData.voucher_for === 'MERCHANT_PAYMENT'">
                                <v-label class="mb-2 font-weight-medium">Select Merchant</v-label>
                                <v-select
                                    :items="merchants"
                                    v-model="formData.user_id"
                                    item-title="business.business_name"
                                    item-value="id"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6" v-if="formData.voucher_for === 'BILL_PAYMENT'">
                                <v-label class="mb-2 font-weight-medium">Select Biller</v-label>
                                <v-select
                                    :items="billers"
                                    v-model="formData.user_id"
                                    item-title="biller.biller_name"
                                    item-value="id"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Expiry Date</v-label>
                                <v-text-field
                                    color="primary"
                                    variant="outlined"
                                    type="date"
                                    v-model="formData.expiry_date"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Min Transaction Amount</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.min_txn_amount"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Cashback Type</v-label>
                                <v-select
                                    :items="cashBackType"
                                    v-model="formData.cashback_type"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6" v-if="formData.cashback_type === 'FIXED_AMOUNT'">
                                <v-label class="mb-2 font-weight-medium">Cashback Amount</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.cashback_amount"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" v-if="formData.cashback_type === 'PERCENTAGE'">
                                <v-label class="mb-2 font-weight-medium">Percentage Amount</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.cashback_amount"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Voucher Type</v-label>
                                <v-select
                                    :items="voucherType"
                                    v-model="formData.voucher_type"
                                    item-title="gender"
                                    item-value="gender"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Reward Upto Max Amount</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.reward_upto_max_amount"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Voucher Description</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.voucher_description"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <br />

                        <v-btn color="primary" @click="submitForm">Add Promotion</v-btn>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
