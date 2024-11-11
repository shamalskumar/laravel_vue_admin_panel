<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';
import type { User } from '@/models/userModel';

const users = ref<User[]>([]); // Store users from the API with the correct type

// Fetch users when component is mounted
onMounted(async () => {
    getBillers();
});

const selectedBiller = ref<User | null>(null); // Selected biller
const billerBalance = ref<string | null>(null); // Biller balance

const page = ref({ title: 'Biller Funds Withdrawal' });
const breadcrumbs = ref([
    {
        text: 'Billers',
        disabled: true,
        href: '#'
    }
]);

const getBillers = async () => {
    try {
        if (token) {
            const fetchedUsers = await apiService.getAllUsers(token, 5);
            users.value = fetchedUsers; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Validation rules
const requiredRule = (v: any) => !!v || 'This field is required';

// Reactive object to hold form data
const formData = ref({
    amount: '',
    transaction_pin: '',
    remark: ''
});

// Method to handle form submission
const submitForm = async () => {
    console.log(formData.value);
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        // Send formData in the API request
        const response = await apiService.adminWithdrawal(token, formData.value, selectedBiller.value!.biller.user_id);

        if (!response) {
            throw new Error('Error in Biller fund withdrawal');
        }

        console.log('Biller fund withdrawal successfully:', response);
        getBillers();
        formData.value.amount = '';
        formData.value.transaction_pin = '';
        formData.value.remark = '';
        selectedBiller.value = null;
        billerBalance.value = '';
        // Handle success (e.g., redirect, show a message)
    } catch (error) {
        console.error('Error Biller fund withdrawal:', error);
        // Handle error (e.g., show an error message)
    }
};

const limitInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    formData.value.transaction_pin = input.value.replace(/\D/g, '').slice(0, 4); // Remove non-numeric characters and limit to 10 digits
};

watch(
    () => selectedBiller.value, // Watch the value of selectedBiller
    async (biller) => {
        if (biller) {
            // Assuming the selected biller has a wallet with a balance property
            billerBalance.value = biller.wallet.balance; // Format the balance as a currency string
        } else {
            // Handle the case where no biller is selected
            billerBalance.value = null; // or set to a default value, e.g., '$0'
        }
    }
);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <UiParentCard title="Biller Fund Withdrawal" class="mt-6">
                <v-row>
                    <v-col cols="12" lg="12">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Biller Name</v-label>
                                <v-select
                                    :items="users"
                                    v-model="selectedBiller"
                                    item-title="biller.biller_name"
                                    item-value="biller.id"
                                    variant="outlined"
                                    :rules="[requiredRule]"
                                    return-object
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Biller Balance</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="billerBalance"
                                    disabled
                                    prepend-icon="mdi-cash"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Withdrawal Amount</v-label>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.amount"
                                    :rules="[requiredRule]"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Transaction Pin</v-label>
                                <!-- <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    v-model="formData.transaction_pin"
                                    @input="limitInput"
                                    :rules="[requiredRule]"
                                ></v-text-field> -->

                                <v-otp-input
                                    length="4"
                                    label="Please enter transaction pin*"
                                    required
                                    v-model="formData.transaction_pin"
                                    focus-all
                                    focused
                                ></v-otp-input>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-label class="mb-2 font-weight-medium">Remark</v-label>
                                <v-text-field variant="outlined" color="primary" v-model="formData.remark"></v-text-field>
                            </v-col>
                        </v-row>
                        <br />

                        <v-btn color="primary" @click="submitForm">Withdraw Funds</v-btn>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
