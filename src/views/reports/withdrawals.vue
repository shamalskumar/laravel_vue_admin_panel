<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Gender select -->
                <div style="flex: 4">
                    <v-select
                        v-model="selectType"
                        :items="requestType"
                        label="Select Type"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select>
                </div>
                <div style="flex: 2">
                    <v-text-field
                        v-model="formData.dateFrom"
                        label="Date From"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-text-field>
                </div>
                <div style="flex: 2">
                    <v-text-field
                        v-model="formData.dateTo"
                        label="Date To"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-text-field>
                </div>
            </div>
            <br />
            <v-data-table
                items-per-page="10"
                :headers="headers"
                :items="filteredData"
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

                <template v-slot:item.amount="{ item }">
                    <span>${{ item.amount }}</span>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-btn @click="viewItem(item)" icon color="primary"><v-icon>mdi-eye</v-icon></v-btn>
                </template>
            </v-data-table>
        </v-card-item>
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
                            <v-label>Status:</v-label>
                            <span>{{ SelectedTransaction.status }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Withdrawal ID:</v-label>
                            <span>{{ SelectedTransaction.withdrawal_id }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Date:</v-label>
                            <span>{{ formatDate(SelectedTransaction.created_at) }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Amount:$</v-label>
                            <span>{{ SelectedTransaction.amount }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Expires At:</v-label>
                            <span>{{ formatDate(SelectedTransaction.expires_at) }}</span>
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

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/models/userModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'; // Adjust the path as necessary
import type { Fund_Request } from '@/models/fundRequest';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import type { WithdrawalReport } from '@/models/walletModel';

const router = useRouter();
const page = ref({ title: 'Withdrawal Report' });
const breadcrumbs = ref([
    {
        text: 'Reports',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const selectType = ref('All Request');
const requestType = ref(['All Request', 'Bank Withdrawal Request', 'Initiated By Agent', 'Admin Withdrawal']);

const selectStatus = ref('All');
const requestStatus = ref(['All', 'Requested', 'Accepted', 'Rejected']);
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const WithdrawalReport = ref<WithdrawalReport[]>([]);
const sendFundDialog = ref(false);
const rejectFundReqDialog = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Validation rules
const requiredRule = (v: any) => !!v || 'This field is required';

// Reactive object to hold form data
const formFundRequestData = ref({
    amount: '',
    send_to: '',
    transaction_pin: '',
    fund_request_id: '',
    reject_remark: ''
});

/*Header Data*/
const headers: any = ref([
    { title: 'Date', align: 'start', key: 'created_at', width: '150px' },
    { title: 'Withdrawal ID', align: 'end', key: 'withdrawal_id', width: '100px' },
    { title: 'Amount', align: 'end', key: 'amount', width: '100px' },
    { title: 'Status', align: 'end', key: 'status', width: '100px' },
    { title: 'Expires At', align: 'end', key: 'expires_at', width: '100px' },
    { title: 'Action', key: 'action' }
]);

const SelectedTransaction = ref({
    status: '',
    withdrawal_id: '',
    created_at: '',
    amount: '',
    expires_at: ''
});
const viewTransactionDialog = ref(false);

// Function to fetch wallet data
const viewItem = async (item: any) => {
    SelectedTransaction.value = item;

    (SelectedTransaction.value.status = item.status),
        (SelectedTransaction.value.withdrawal_id = item.withdrawal_id),
        (SelectedTransaction.value.created_at = item.created_at),
        (SelectedTransaction.value.amount = item.amount),
        (SelectedTransaction.value.expires_at = item.expires_at),
        (viewTransactionDialog.value = true);
};

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

function getUserType(idType: number) {
    let type = '';

    switch (idType) {
        case 1:
            type = 'admin';
            break;
        case 2:
            type = 'customer';
            break;
        case 3:
            type = 'agent';
            break;
        case 4:
            type = 'merchant';
            break;
        case 5:
            type = 'biller';
            break;
        case 6:
            type = 'adminCommission';
            break;
        case 7:
            type = 'subAccount';
            break;
        case 8:
            type = 'adminWithdrawal';
            break;
        case 9:
            type = 'staff';
            break;
        default:
            type = 'unknown'; // In case idType doesn't match any case
    }

    return type;
}

const getAllWithdrawalReport = async () => {
    let result = ''; // Declare a variable to store the result

    switch (selectType.value) {
        case 'All Request':
            result = '';
            break;
        case 'Bank Withdrawal Request':
            result = 'BANK_WITHDRAWAL_REQUEST';
            break;
        case 'Initiated By Agent':
            result = 'INITIATED_BY_AGENT';
            break;
        case 'Admin Withdrawal':
            result = 'ADMIN_WITHDRAWAL';
            break;
        default:
            result = '';
    }

    try {
        if (token) {
            const fetchedFundRequest = await apiService.getWithdrawalReport(token, result, formData.value);

            console.log(fetchedFundRequest);
            WithdrawalReport.value = fetchedFundRequest; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
    }
};
// Fetch users when component is mounted
onMounted(getAllWithdrawalReport);

// Watch for changes in formData.dateFrom and formData.dateTo, and call fetchWalletData again
watch(
    () => [selectStatus.value, selectType.value, formData.value.dateFrom, formData.value.dateTo], // Watch both dates
    getAllWithdrawalReport // Re-fetch data when dates change
);

/* Filtered data */
const filteredData = computed(() => {
    let data = WithdrawalReport.value;

    // Filter by searchText if not empty, considering multiple fields
    if (searchText.value.trim()) {
        const search = searchText.value.toLowerCase();
        data = data.filter((item) => {
            return (
                item.user.full_name.toLowerCase().includes(search) ||
                (item.withdrawal_id && item.withdrawal_id.toLowerCase().includes(search))
            );
        });
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = WithdrawalReport.value;
    return data.length;
});

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value); // Use .value for ref
});
</script>

<style scoped>
.revenue-products {
    margin: 0 auto;
    max-width: 1200px;
}

.revenue-table {
    margin-top: 20px;
    width: 100%;
}

.month-item {
    cursor: pointer;
}

.textPrimary {
    color: #1976d2;
}
.v-label {
    font-weight: bold;
    margin-right: 2px;
}
</style>
