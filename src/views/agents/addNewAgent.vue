<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';
import type { BusinessType, City, Country, Income, MerchantCategory } from '@/models/userModel';

// Fetch users when component is mounted
onMounted(async () => {
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
});

const countries = ref<Country[]>([]); // Store countries from the API with the correct type
const cities = ref<City[]>([]); // Store cities from the API with the correct type
const incomeSources = ref<Income[]>([]); // Store cities from the API with the correct type
const businessTypes = ref<BusinessType[]>([]); // Store cities from the API with the correct type
const merchantTypes = ref<MerchantCategory[]>([]); // Store cities from the API with the correct type

const select = ref('select');
const gender = ref(['MALE', 'FEMALE']);
const page = ref({ title: 'Add New Agent' });
const breadcrumbs = ref([
    {
        text: 'Agents',
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

// Password rules
const passwordRules = [
    (v: string) => (v && v.length > 8) || 'Password must be more than 8 characters',
    (v: string) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
    (v: string) => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
    (v: string) => /[0-9]/.test(v) || 'Password must contain at least one digit',
    (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character'
];

// Reactive object to hold form data
const formData = ref({
    country_code: '',
    mobile_no: '',
    email: '',
    user_type_id: 3,
    username: '',
    device_name: 'web',
    city_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    country: '', // This will hold the selected country ID or object
    company_tin_no: '',
    business_name: '',
    business_type_id: '',
    merchant_category_id: ''
});

// Watch for changes in the selected country
watch(
    () => formData.value.country,
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

// Method to handle form submission
const submitForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        // Ensure the username starts with $
        if (!formData.value.username.startsWith('$')) {
            formData.value.username = `$${formData.value.username}`;
        }

        // Send formData in the API request
        const response = await apiService.createStaff(token, formData.value);

        if (!response) {
            throw new Error('Error creating agent');
        }

        console.log('User added successfully:', response);
        // Handle success (e.g., redirect, show a message)
    } catch (error) {
        console.error('Error adding agent:', error);
        // Handle error (e.g., show an error message)
    }
};
const limitInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    formData.value.mobile_no = input.value.replace(/\D/g, '').slice(0, 10); // Remove non-numeric characters and limit to 10 digits
};
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <UiParentCard title="Enter New User Information" class="mt-6">
                <v-row>
                    <v-col cols="12" lg="12">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Country Code</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.country_code"
                                    :rules="[requiredRule]"
                                ></v-text-field>

                                <v-label class="mb-2 font-weight-medium">Mobile Number</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.mobile_no"
                                    type="number"
                                    :rules="[requiredRule]"
                                    @input="limitInput"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Email</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.email"
                                    type="email"
                                    :rules="[requiredRule, emailRule]"
                                ></v-text-field>

                                <v-label class="mb-2 font-weight-medium">Username</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.username"
                                    :rules="[requiredRule]"
                                    prefix="$"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">First Name</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.first_name"
                                    :rules="[requiredRule]"
                                ></v-text-field>

                                <v-label class="mb-2 font-weight-medium">Middle Name</v-label>
                                <v-text-field variant="outlined" color="primary" v-model="formData.middle_name"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Last Name</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.last_name"
                                    :rules="[requiredRule]"
                                ></v-text-field>

                                <v-label class="mb-2 font-weight-medium">Date of Birth</v-label>
                                <v-text-field
                                    color="primary"
                                    variant="outlined"
                                    type="date"
                                    v-model="formData.date_of_birth"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Select Gender</v-label>
                                <v-select
                                    :items="gender"
                                    v-model="formData.gender"
                                    item-title="gender"
                                    item-value="gender"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Address</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.address"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Country</v-label>
                                <v-select
                                    v-model="formData.country"
                                    :items="countries"
                                    item-value="id"
                                    item-title="country_name"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">City</v-label>
                                <v-select
                                    v-model="formData.city_id"
                                    :items="cities"
                                    item-value="id"
                                    item-title="city_name"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Business Name</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.business_name"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Company T.I.N Number</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.company_tin_no"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Business Type</v-label>
                                <v-select
                                    v-model="formData.business_type_id"
                                    :items="businessTypes"
                                    item-value="id"
                                    item-title="business_type"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Merchant Category</v-label>
                                <v-select
                                    v-model="formData.merchant_category_id"
                                    :items="merchantTypes"
                                    item-value="id"
                                    item-title="category_name"
                                    :rules="[requiredRule]"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <br />
                        <v-btn color="primary" @click="submitForm">Add Agent</v-btn>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
