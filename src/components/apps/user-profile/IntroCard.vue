<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue';
import type { User, MerchantCategory, BusinessType, BillerCategory } from '@/models/userModel'; // Import your User type
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
import { useUserStore } from '@/stores/userStore';
import type { Country, Income } from '@/models/userModel';

const authStore = useAuthStore();
const token = authStore.token;
const userStore = useUserStore();

const income = ref<Income[]>([]); // Reactive income array
const country = ref<string>(''); // Reactive country string
const merchantCategory = ref<MerchantCategory[]>([]); // Reactive merchant category array
const billerCategory = ref<BillerCategory[]>([]); // Reactive merchant category array
const businessType = ref<BusinessType[]>([]); // Reactive business type array
const filteredIncomeSource = ref<string | null>(null); // Reactive to store filtered income source
const filteredMerchantCategoryData = ref<string | null>(null); // Reactive to store filtered merchant category
const filteredBillerCategoryData = ref<string | null>(null); // Reactive to store filtered merchant category
const filteredBusinessCategoryData = ref<string | null>(null); // Reactive to store filtered business category

const props = defineProps({
    userData: {
        type: Object as () => User | null,
        required: true
    }
});

// Watching for changes to props.userData?.biller.biller_category_id
if (props.userData?.user_type_id === 5) {
    watch(
        () => props.userData?.biller.biller_category_id,
        async (newVal, oldVal) => {
            if (newVal !== oldVal && newVal != null) {
                // Fetch and update the filtered biller category when it changes
                const userBillerCategoryId = Number(userStore.userData?.biller.biller_category_id);
                const filteredBillerCategory = billerCategory.value.find((inc) => inc.id === userBillerCategoryId);

                if (filteredBillerCategory) {
                    filteredBillerCategoryData.value = filteredBillerCategory.category_name;
                } else {
                    filteredBillerCategoryData.value = 'No matching biller category';
                }
            }
        }
    );
}

onMounted(async () => {
    try {
        if (token && userStore.userData) {
            // Fetch country data
            if (userStore.userData.user_type_id != 7) {
                const fetchedCountryData = await apiService.getCountryData(token, userStore.userData.city.country_id);
                country.value = fetchedCountryData.country_name;
                {
                    // Fetch income data
                    const fetchedIncomeData = await apiService.getIncomeData(token);
                    income.value = fetchedIncomeData; // Store fetched income data

                    // Convert userData?.source_of_income_id to a number and filter income
                    const userIncomeId = Number(userStore.userData?.source_of_income_id);

                    // Find the matching income source based on id
                    const filteredIncome = income.value.find((inc) => inc.id === userIncomeId);

                    // Store the filtered income source
                    if (filteredIncome) {
                        filteredIncomeSource.value = filteredIncome.source;
                    } else {
                        filteredIncomeSource.value = 'No matching income source';
                    }
                }
            }
            if (
                userStore.userData.user_type_id != 2 &&
                userStore.userData.user_type_id != 5 &&
                userStore.userData.user_type_id != 1 &&
                userStore.userData.user_type_id != 7
            ) {
                // Fetch merchant and business category data

                {
                    const fetchedMerchantCategory = await apiService.getMerchantCategoryData(token);
                    merchantCategory.value = fetchedMerchantCategory; // Store fetched income data

                    // Convert userStore.userData?.business.merchant_category_id to a number and filter income
                    const userMerchantCategoryId = Number(userStore.userData?.business.merchant_category_id);

                    // Find the matching merchant category based on id
                    const filteredMerchantCategory = merchantCategory.value.find((inc) => inc.id === userMerchantCategoryId);

                    // Store the filtered merchant category
                    if (filteredMerchantCategory) {
                        filteredMerchantCategoryData.value = filteredMerchantCategory.category_name;
                    } else {
                        filteredMerchantCategoryData.value = 'No matching merchant category';
                    }
                }

                {
                    const fetchedBusinessType = await apiService.getBusinessTypeData(token);
                    businessType.value = fetchedBusinessType; // Store fetched income data

                    // Convert userStore.userData?.business.business_category_id to a number and filter income
                    const userBusinessTypeId = Number(userStore.userData?.business.business_type_id);

                    // Find the matching business category based on id
                    const filteredBusinessType = businessType.value.find((inc) => inc.id === userBusinessTypeId);

                    // Store the filtered business category
                    if (filteredBusinessType) {
                        filteredBusinessCategoryData.value = filteredBusinessType.business_type;
                    } else {
                        filteredBusinessCategoryData.value = 'No matching business category';
                    }
                }
            }

            if (userStore.userData.user_type_id === 5) {
                // Fetch merchant and business category data

                {
                    const fetchedBillerCategory = await apiService.getBillerCategoryData(token);
                    billerCategory.value = fetchedBillerCategory; // Store fetched income data

                    // Convert userStore.userData?.business.merchant_category_id to a number and filter income
                    const userBillerCategoryId = Number(userStore.userData?.biller.biller_category_id);

                    // Find the matching merchant category based on id
                    const filteredBillerCategory = billerCategory.value.find((inc) => inc.id === userBillerCategoryId);

                    // Store the filtered merchant category
                    if (filteredBillerCategory) {
                        filteredBillerCategoryData.value = filteredBillerCategory.category_name;
                    } else {
                        filteredBillerCategoryData.value = 'No matching biller category';
                    }
                }
            }
        } else {
            console.error('No token or user data found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// Method to convert string to Title Case
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
                        <span class="text-h6">First Name: {{ userData?.first_name }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Middle Name: {{ userData?.middle_name }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Last Name: {{ userData?.last_name }}</span>
                    </div>
                </v-col>
                <v-col v-if="userData?.user_type_id === 5" cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <UserIcon size="21" />
                        <span class="text-h6">Business Name: {{ userData?.biller.biller_name }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <MailIcon size="21" />
                        <span class="text-h6">Email: {{ userData?.email }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <PhoneCallIcon size="21" />
                        <span class="text-h6">Phone: {{ userData?.mobile_country_code }} {{ userData?.mobile_no }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6" v-if="userData?.user_type_id !== 7">
                    <div class="d-flex gap-3 mb-0">
                        <PhoneCallIcon size="21" />
                        <span class="text-h6">Address: {{ userData?.address }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6" v-if="userData?.user_type_id !== 7">
                    <div class="d-flex gap-3 mb-0">
                        <MapPinIcon size="21" />
                        <span class="text-h6">City: {{ userData?.city.city_name }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6" v-if="userData?.user_type_id !== 7">
                    <div class="d-flex gap-3 mb-0">
                        <MapPinIcon size="21" />
                        <span class="text-h6">Country: {{ country }}</span>
                    </div>
                </v-col>
                <v-col v-if="userData?.user_type_id !== 4 && userData?.user_type_id !== 7" cols="12" md="6">
                    <div v-if="userData?.gender == 'MALE'" class="d-flex gap-3 mb-0">
                        <GenderMaleIcon size="21" />
                        <span class="text-h6">Gender: {{ userData?.gender }}</span>
                    </div>
                    <div v-else class="d-flex gap-3 mb-0">
                        <GenderFemaleIcon size="21" />
                        <span class="text-h6">Gender: {{ userData?.gender }}</span>
                    </div>
                </v-col>
                <v-col v-if="userData?.user_type_id !== 2 && userData?.user_type_id !== 1 && userData?.user_type_id !== 5" cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <BuildingIcon size="21" />
                        <span v-if="userData?.user_type_id !== 7" class="text-h6"
                            >Business Name: {{ userData?.business.business_name }}</span
                        >
                        <span v-if="userData?.user_type_id == 7" class="text-h6"
                            >Business Name: {{ userData?.master_account.business.business_name }}</span
                        >
                    </div>
                </v-col>
                <v-col v-if="userData?.user_type_id === 5" cols="12" md="6">
                    <div class="d-flex gap-3 mb-0">
                        <BuildingIcon size="21" />
                        <span class="text-h6">Biller Category: {{ filteredBillerCategoryData }}</span>
                    </div>
                </v-col>
                <v-col cols="12" md="6" v-if="userData?.user_type_id !== 7">
                    <div class="d-flex gap-3 mb-0">
                        <FileCertificateIcon size="21" />
                        <span
                            v-if="userData?.user_type_id === 2 || userData?.user_type_id === 1 || userData?.user_type_id === 5"
                            class="text-h6"
                            >T.I.N: {{ userData?.personal_tin_no ?? 'Not Any' }}</span
                        >
                        <span
                            v-if="userData?.user_type_id !== 2 && userData?.user_type_id !== 1 && userData?.user_type_id !== 5"
                            class="text-h6"
                            >T.I.N: {{ userData?.business.company_tin_no }}</span
                        >
                    </div>
                </v-col>
                <v-col cols="12" md="6" v-if="userData?.user_type_id !== 7">
                    <div
                        v-if="userData?.user_type_id === 2 || userData?.user_type_id === 1 || userData?.user_type_id === 5"
                        class="d-flex gap-3 mb-0"
                    >
                        <UserDollarIcon size="21" />

                        <span class="text-h6">Source of income: {{ filteredIncomeSource }}</span>
                    </div>
                    <div
                        v-if="userData?.user_type_id !== 2 && userData?.user_type_id !== 1 && userData?.user_type_id !== 5"
                        class="d-flex gap-3 mb-0"
                    >
                        <BusinessplanIcon size="21" />

                        <span class="text-h6">Merchant Category: {{ toTitleCase(filteredMerchantCategoryData ?? '') }}</span>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    v-if="
                        userData?.user_type_id !== 2 &&
                        userData?.user_type_id !== 1 &&
                        userData?.user_type_id !== 5 &&
                        userData?.user_type_id !== 7
                    "
                >
                    <div class="d-flex gap-3 mb-0">
                        <BuildingFactory2Icon size="21" />
                        <span class="text-h6">Business Category: {{ toTitleCase(filteredBusinessCategoryData ?? '') }}</span>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
