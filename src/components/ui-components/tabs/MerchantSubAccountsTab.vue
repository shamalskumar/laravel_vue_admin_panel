<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { SubAccount } from '@/models/userModel';
import type { Wallet } from '@/models/walletModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

// Refs and user data
const tab = ref(0); // Will track the selected tab
const userStore = useUserStore();
const authStore = useAuthStore();
const token = authStore.token;

const dialog = ref(false); // Control for dialog open/close

const subAccount = ref<SubAccount[]>([]); // Store subaccounts fetched from the API

const wallet = ref<Wallet[]>([]);

// Form data for adding new sub-account
const newSubAccount = ref({
    username: '',
    country_code: '',
    mobile_no: '',
    email: '',
    date_of_birth: '',
    first_name: '',
    last_name: '',
    master_account_user_id: 0
});

// Function to fetch sub-account data based on the active tab
const fetchSubAccountData = async (index: number) => {
    const selectedAccount = subAccount.value[index];
    if (token && selectedAccount) {
        try {
            const fetchedUserWalletData = await apiService.getUserWalletTransactions(token, selectedAccount.id, '2024-01-01', '2026-07-31');

            // Format the dates using the formatDate helper
            wallet.value = fetchedUserWalletData.map((transaction: Wallet) => ({
                ...transaction,
                created_at: formatDate(transaction.created_at), // Format the wallet created_at
                transaction: {
                    ...transaction.transaction,
                    created_at: formatDate(transaction.transaction.created_at) // Format the transaction created_at
                }
            }));
        } catch (error) {
            console.error('Error fetching sub-account details:', error);
        }
    }
};

// Function to refetch sub-accounts and trigger the default tab API call
const onMountedFetchSubAccounts = async () => {
    try {
        if (token && userStore.userData?.id) {
            const fetchedUsers = await apiService.getSubAccounts(token, userStore.userData.id);
            subAccount.value = fetchedUsers.data; // Store fetched subaccounts

            // Trigger API call for the default selected tab (tab = 0) after sub-accounts are loaded
            if (subAccount.value.length > 0) {
                await fetchSubAccountData(0);
            }
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching subaccounts:', error);
    }
};

// Call the refetch function when the component is mounted
onMounted(onMountedFetchSubAccounts);

// Watch for tab changes and trigger API call based on the active tab
watch(tab, async (newTab) => {
    await fetchSubAccountData(newTab);
});

/*Header Data*/
const headers: any = ref([
    { title: 'Date', align: 'start', key: 'created_at', width: '150px' },
    { title: 'Opening Balance', align: 'end', key: 'opening_balance', width: '100px' },
    { title: 'Closing Balance', align: 'end', key: 'closing_balance', width: '100px' },
    { title: 'Credit Amount', align: 'end', key: 'credit_amount', width: '100px' },
    { title: 'Debit Amount', align: 'end', key: 'debit_amount', width: '100px' },
    { title: 'Transaction ID', align: 'start', key: 'transaction_id' },
    { title: 'Transaction Type', align: 'start', key: 'transaction_type' },
    { title: 'Description', align: 'start', key: 'description' }
]);

// Function to handle adding a new sub-account
const addSubAccount = async () => {
    try {
        // Append "@user" to the username
        let modifiedUsername = userStore.userData?.username?.replace('$', ''); // Remove $
        modifiedUsername = `@${modifiedUsername}`; // Add @ at the beginning

        newSubAccount.value.username = `${newSubAccount.value.username}${modifiedUsername}`;
        newSubAccount.value.date_of_birth = new Date().toISOString().slice(0, 10);
        newSubAccount.value.first_name = 'SubAccount';
        newSubAccount.value.last_name = userStore.userData!.business.business_name.replace(/\s+/g, '');

        newSubAccount.value.master_account_user_id = userStore.userData!.id;

        console.log(newSubAccount.value);

        // Make API POST call
        if (token) {
            const response = await apiService.createSubAccount(token, newSubAccount.value);
            console.log('Sub-account added:', response.data);

            // Close dialog and clear form data
            dialog.value = false;
            newSubAccount.value = {
                username: '',
                country_code: '',
                mobile_no: '',
                email: '',
                date_of_birth: '',
                first_name: '',
                last_name: '',
                master_account_user_id: 0
            };

            // After sub-account is added, re-fetch sub-account data
            await onMountedFetchSubAccounts(); // Call the function to re-fetch data
        } else {
            console.error('No token found');
        }

        dialog.value = false;
    } catch (error) {
        console.error('Error adding sub-account:', error);
    }
};

const closeDialog = () => {
    dialog.value = false;
    newSubAccount.value = {
        username: '',
        country_code: '',
        mobile_no: '',
        email: '',
        date_of_birth: '',
        first_name: '',
        last_name: '',
        master_account_user_id: 0
    };
};

// Validation rules
const requiredRule = (v: any) => !!v || 'This field is required';
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid';
</script>

<template>
    <v-card elevation="0">
        <v-btn color="primary" @click="dialog = true">Add Sub-Account</v-btn>

        <v-dialog v-model="dialog" persistent class="dialog-mw">
            <v-card style="height: auto" class="overflow-auto">
                <v-container>
                    <v-card-title class="pa-5">
                        <span class="text-h5"> Add New Sub-Account</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field label="Username*" v-model="newSubAccount.username" :rules="[requiredRule]" />
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field label="Country Code*" v-model="newSubAccount.country_code" :rules="[requiredRule]" />
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    label="Mobile Number*"
                                    v-model="newSubAccount.mobile_no"
                                    type="number"
                                    :rules="[requiredRule]"
                                />
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    label="Email*"
                                    v-model="newSubAccount.email"
                                    type="email"
                                    :rules="[requiredRule, emailRule]"
                                />
                            </v-col>
                        </v-row>
                        <span>* indicates required fields</span>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
                        <v-btn color="primary" @click="addSubAccount">Add</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-alert v-if="subAccount.length == 0" type="info" class="ma-5"> No Sub Account found. </v-alert>

        <!-- Tabs for each subaccount -->
        <v-tabs v-model="tab" color="primary" align-tabs="center" show-arrows v-if="subAccount.length !== 0">
            <!-- Dynamically create a tab for each subaccount -->
            <v-tab v-for="(account, index) in subAccount" :key="account.id" :value="index">
                {{ account.username }}
            </v-tab>
        </v-tabs>

        <v-card-text class="rounded-md pa-0 mt-6">
            <!-- Content for each tab -->
            <v-window v-model="tab">
                <v-window-item v-for="(account, index) in subAccount" :key="account.id" :value="index">
                    <v-data-table
                        items-per-page="10"
                        :headers="headers"
                        :items="wallet"
                        item-value="name"
                        class="border rounded-md datatabels small-text-table"
                    >
                        <!-- Scoped slots to format dollar values -->
                        <template v-slot:item.opening_balance="{ item }">
                            <span v-if="item.opening_balance">${{ item.opening_balance }}</span>
                        </template>

                        <template v-slot:item.closing_balance="{ item }">
                            <span v-if="item.closing_balance">${{ item.closing_balance }}</span>
                        </template>

                        <template v-slot:item.credit_amount="{ item }">
                            <span>${{ item.credit_amount }}</span>
                        </template>

                        <template v-slot:item.debit_amount="{ item }">
                            <span>${{ item.debit_amount }}</span>
                        </template>
                    </v-data-table>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</template>
