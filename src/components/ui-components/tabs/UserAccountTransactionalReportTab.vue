<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { Wallet, AgentWallet } from '@/models/walletModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import { downloadCSV } from '@/utils/exportDocumentCSV';

// Refs and user data
const tab = ref(0);
const activeTab = ref(0);
const authStore = useAuthStore();
const token = authStore.token;
const userStore = useUserStore();
const wallet = ref<Wallet[]>([]);
const agentFundWallet = ref<AgentWallet[]>([]);
const agentCommissionWallet = ref<AgentWallet[]>([]);

// Manual padding function
const padStart = (value: string | number, targetLength: number, padString: string = '0'): string => {
    const str = String(value);
    if (str.length >= targetLength) {
        return str;
    }
    return padString.repeat(targetLength - str.length) + str;
};

// Function to format the date as 'YYYY-MM-DD'
const formatDateFilter = (date: Date): string => {
    const year = date.getFullYear();
    const month = padStart(date.getMonth() + 1, 2); // Months are 0-based, so +1
    const day = padStart(date.getDate(), 2);
    return `${year}-${month}-${day}`;
};

// Calculate current date
const currentDate = new Date();
const date90DaysAgo = new Date();
date90DaysAgo.setDate(currentDate.getDate() - 90);

// Initialize formData with the calculated dates
const formData = ref({
    dateFrom: formatDateFilter(date90DaysAgo), // 90 days before the current date
    dateTo: formatDateFilter(currentDate) // Current date
});

// Function to fetch wallet data
const fetchWalletData = async () => {
    try {
        if (token && userStore.userData?.id) {
            const fetchedUserWalletData = await apiService.getUserWalletTransactions(
                token,
                userStore.userData.id,
                formData.value.dateFrom,
                formData.value.dateTo
            );

            // Format the dates using the formatDate helper
            wallet.value = fetchedUserWalletData.map((transaction: Wallet) => ({
                ...transaction,
                created_at: formatDate(transaction.created_at), // Format the wallet created_at
                transaction: {
                    ...transaction.transaction,
                    created_at: formatDate(transaction.transaction.created_at) // Format the transaction created_at
                }
            }));
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }

    if (userStore.userData?.user_type_id == 3) {
        try {
            if (token && userStore.userData?.id) {
                const fetchedAgentWalletFundData = await apiService.getAgentWalletTransactions(
                    token,
                    userStore.userData.id,
                    'FUNDS',
                    formData.value.dateFrom,
                    formData.value.dateTo
                );

                agentFundWallet.value = fetchedAgentWalletFundData.map((transaction: AgentWallet) => ({
                    ...transaction,
                    created_at: formatDate(transaction.created_at),
                    updated_at: formatDate(transaction.updated_at)
                }));

                const fetchedAgentWalletCommissionData = await apiService.getAgentWalletTransactions(
                    token,
                    userStore.userData.id,
                    'COMMISSION',
                    formData.value.dateFrom,
                    formData.value.dateTo
                );

                agentCommissionWallet.value = fetchedAgentWalletCommissionData.map((transaction: AgentWallet) => ({
                    ...transaction,
                    created_at: formatDate(transaction.created_at),
                    updated_at: formatDate(transaction.updated_at)
                }));
            } else {
                console.error('No token found');
            }
        } catch (error) {
            console.error('Error fetching agent fund wallet data:', error);
        }
    }

    if (userStore.userData?.user_type_id == 3) {
        changeTab(1);
    } else {
        changeTab(0);
    }
};

// Call fetchWalletData when the component is mounted
onMounted(fetchWalletData);

// Watch for changes in formData.dateFrom and formData.dateTo, and call fetchWalletData again
watch(
    () => [formData.value.dateFrom, formData.value.dateTo], // Watch both dates
    fetchWalletData // Re-fetch data when dates change
);

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

const exportDownloadCSV = async (name: string) => {
    // Specify only the fields you want to include
    // const fieldsToInclude = [wallet.created_at, wallet.opening_balance,wallet.credit_amount,wallet.debit_amount, wallet.closing_balance,  wallet.transaction_id,wallet.transaction_type,wallet.user_id,wallet.description]; // Only include 'name' and 'city'
    const fieldsToInclude = [
        'created_at',
        'opening_balance',
        'credit_amount',
        'debit_amount',
        'closing_balance',
        'transaction_id',
        'transaction_type',
        'description'
    ]; // Only include 'name' and 'city'
    const headersMap = {
        created_at: 'Data',
        opening_balance: 'Opening Balance',
        credit_amount: 'Credit Amount',
        debit_amount: 'Debit Amount',
        closing_balance: 'Closing Balance',
        transaction_id: 'Transaction ID',
        transaction_type: 'Transaction Type',
        description: 'Description'
    };
    switch (activeTab.value) {
        case 0:
            downloadCSV(wallet.value, fieldsToInclude, headersMap, 'Transaction_Report_' + name);
            break;
        case 1:
            downloadCSV(agentFundWallet.value, fieldsToInclude, headersMap, 'Agent Fund Wallet_' + name);
            break;
        case 2:
            downloadCSV(agentCommissionWallet.value, fieldsToInclude, headersMap, 'Agent Commission Wallet_' + name);
            break;
        default:
            downloadCSV(wallet.value, fieldsToInclude, headersMap, 'Transaction_Report_' + name);
    }
};

const changeTab = async (tab: number) => {
    activeTab.value = tab;
};
</script>

<template>
    <v-card elevation="0">
        <v-row>
            <v-col cols="12" md="2">
                <v-label class="mb-2 font-weight-medium">From Date</v-label>
                <v-text-field color="primary" variant="outlined" type="date" v-model="formData.dateFrom"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
                <v-label class="mb-2 font-weight-medium">To Date</v-label>
                <v-text-field color="primary" variant="outlined" type="date" v-model="formData.dateTo"></v-text-field>
            </v-col>
            <v-col class="d-flex justify-end align-center"
                ><v-btn
                    color="primary"
                    @click="exportDownloadCSV(userStore.userData?.username + '_' + formData.dateFrom + '_' + formData.dateTo)"
                    >Export Report</v-btn
                ></v-col
            >
        </v-row>
        <v-tabs v-model="tab" color="primary" align-tabs="left">
            <v-tab @click="changeTab(0)" value="0" v-if="userStore.userData?.user_type_id !== 3"> Wallet History </v-tab>
            <v-tab @click="changeTab(1)" value="1" v-if="userStore.userData?.user_type_id === 3"> Funds Wallet History </v-tab>
            <v-tab @click="changeTab(2)" value="2" v-if="userStore.userData?.user_type_id === 3"> Commission Wallet History </v-tab>
        </v-tabs>

        <v-card-text class="rounded-md pa-0 mt-6">
            <v-window v-model="tab">
                <!-- Wallet History Section -->
                <v-window-item value="0" v-if="userStore.userData?.user_type_id !== 3">
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

                <!-- Agent Funds Wallet History Section -->
                <v-window-item value="1">
                    <v-data-table
                        items-per-page="10"
                        :headers="headers"
                        :items="agentFundWallet"
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

                <!-- Agent Commission Wallet History Section -->
                <v-window-item value="2">
                    <v-data-table
                        items-per-page="10"
                        :headers="headers"
                        :items="agentCommissionWallet"
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
