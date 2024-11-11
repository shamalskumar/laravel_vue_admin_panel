<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, watch, computed } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';

import type { User } from '@/models/userModel'; // type-only import
import type { DepositReport } from '@/models/walletModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

// Refs and user data

const authStore = useAuthStore();
const token = authStore.token;
const wallet = ref<DepositReport[]>([]);
const viewTransactionDialog = ref(false);
const SelectedTransaction = ref({
    closing_balance: '',
    created_at: '',
    credit_amount: '',
    debit_amount: '',
    description: '',
    id: 0,
    opening_balance: '',
    transaction_id: '',
    transaction_type: '',
    updated_at: '',
    user_id: 0
});

const page = ref({ title: 'Deposit Report' });
const breadcrumbs = ref([
    {
        text: 'Reports',
        disabled: true,
        href: '#'
    }
]);

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
    dateTo: formatDateFilter(currentDate), // Current date
    selectedUser: ''
});

// Function to fetch wallet data
const fetchWithdrawalReport = async () => {
    try {
        if (token) {
            const fetchedUserWalletData = await apiService.getDepositReport(token, formData.value.dateFrom, formData.value.dateTo);

            // Format the dates using the formatDate helper
            wallet.value = fetchedUserWalletData;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching deposit data:', error);
    }
};

onMounted(fetchWithdrawalReport);

// Function to fetch wallet data
const viewItem = async (item: any) => {
    SelectedTransaction.value = item;

    (SelectedTransaction.value.user_id = item.user_id),
        (SelectedTransaction.value.opening_balance = item.opening_balance),
        (SelectedTransaction.value.closing_balance = item.closing_balance),
        (SelectedTransaction.value.credit_amount = item.credit_amount),
        (SelectedTransaction.value.debit_amount = item.debit_amount),
        (SelectedTransaction.value.transaction_id = item.transaction_id),
        (SelectedTransaction.value.transaction_type = item.transaction_type),
        (SelectedTransaction.value.created_at = item.created_at),
        (SelectedTransaction.value.updated_at = item.updated_at),
        (SelectedTransaction.value.description = item.description),
        (viewTransactionDialog.value = true);
};

/*Header Data*/
const headers: any = ref([
    { title: 'Date', align: 'start', key: 'created_at', width: '150px' },
    { title: 'Amount', align: 'end', key: 'amount', width: '100px' },
    { title: 'Deposit ID', align: 'end', key: 'deposit_id', width: '100px' },
    { title: 'Commission Processed', align: 'end', key: 'commission_processed', width: '100px' },
    { title: 'Agent ID', align: 'end', key: 'agent_user.id', width: '100px' },
    { title: 'User ID', align: 'start', key: 'user.id' },
    { title: 'Agent', align: 'start', key: 'agent_user.full_name' },
    { title: 'Agent VisionPay ID', align: 'start', key: 'agent_user.pacpay_user_id' }
    // { title: 'Action', key: 'action' }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-card elevation="0">
        <v-card-text>
            <v-row>
                <v-col cols="12" md="3">
                    <v-text-field
                        label="From Date"
                        color="primary"
                        variant="outlined"
                        type="date"
                        density="compact"
                        v-model="formData.dateFrom"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field
                        density="compact"
                        label="To Date"
                        color="primary"
                        variant="outlined"
                        type="date"
                        v-model="formData.dateTo"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn
                        text
                        @click="fetchWithdrawalReport()"
                        color="primary"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Search
                    </v-btn>
                </v-col>
            </v-row>

            <v-card-text class="rounded-md pa-0 mt-6">
                <v-alert v-if="wallet.length == 0" class="mb-3" type="info">Select filter dates</v-alert>
                <v-data-table
                    v-if="wallet.length > 0"
                    items-per-page="10"
                    :headers="headers"
                    :items="wallet"
                    item-value="name"
                    class="border rounded-md datatabels small-text-table"
                >
                    <!-- Scoped slots to format dollar values -->
                    <template v-slot:item.created_at="{ item }">
                        <span v-if="item.created_at">{{ formatDate(item.created_at) }}</span>
                    </template>

                    <template v-slot:item.expires_at="{ item }">
                        <span v-if="item.expires_at">{{ formatDate(item.expires_at) }}</span>
                    </template>

                    <template v-slot:item.commission_processed="{ item }">
                        <span v-if="item.commission_processed">{{ item.commission_processed == 1 ? 'Yes' : 'NO' }}</span>
                    </template>

                    <template v-slot:item.amount="{ item }">
                        <span>${{ item.amount }}</span>
                    </template>
                    <!-- <template v-slot:item.action="{ item }">
                    <v-btn @click="viewItem(item)" icon color="primary"><v-icon>mdi-eye</v-icon></v-btn>
                </template> -->
                </v-data-table>
            </v-card-text></v-card-text
        >
    </v-card>
    <v-dialog v-model="viewTransactionDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Transaction Details</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>User ID:</v-label>
                            <span>{{ SelectedTransaction.user_id }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Opening Balance:$</v-label>
                            <span>{{ SelectedTransaction.opening_balance }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Closing Balance:$</v-label>
                            <span>{{ SelectedTransaction.closing_balance }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Credit Amount:$</v-label>
                            <span>{{ SelectedTransaction.credit_amount }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Debit Amount:$</v-label>
                            <span>{{ SelectedTransaction.debit_amount }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Transaction ID:</v-label>
                            <span>{{ SelectedTransaction.transaction_id }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Transaction Type:</v-label>
                            <span>{{ SelectedTransaction.transaction_type }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Created At:</v-label>
                            <span>{{ formatDate(SelectedTransaction.created_at) }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Updated At:</v-label>
                            <span>{{ formatDate(SelectedTransaction.updated_at) }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Description:</v-label>
                            <span>{{ SelectedTransaction.description }}</span>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="viewTransactionDialog = false" variant="tonal" flat> Close </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>
