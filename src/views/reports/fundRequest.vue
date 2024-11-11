<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Gender select -->
                <div style="flex: 2">
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
                    <v-select
                        v-model="selectStatus"
                        :items="requestStatus"
                        label="Select Status"
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
                <!-- Search input with clear icon -->
                <div style="flex: 4">
                    <v-text-field
                        v-model="searchText"
                        label="Search"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                        append-icon="mdi-close-circle"
                        @click:append="clearSearchText"
                    ></v-text-field>
                </div>
            </div>
            <br />
            <v-table class="revenue-table light-border">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-body-1 textPrimary">Date</th>
                            <th class="text-body-1 textPrimary">User ID</th>
                            <th class="text-body-1 textPrimary">Name</th>
                            <th class="text-body-1 textPrimary">Amount</th>
                            <th class="text-body-1 textPrimary">Bank Name</th>
                            <th class="text-body-1 textPrimary">Status</th>
                            <th class="text-body-1 textPrimary">User Type</th>
                            <th class="text-body-1 textPrimary">Request ID</th>
                            <th class="text-body-1 textPrimary">Remark</th>
                            <th class="text-body-1 textPrimary">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredData" :key="item.id" class="month-item">
                            <td>
                                <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ formatDate(item.created_at) }}</h6>
                            </td>
                            <td>
                                <p class="text-body-1">{{ item.sender_user.pacpay_user_id }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">{{ item.requester_user.full_name }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">${{ item.amount }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">{{ item.admin_bank_detail?.bank_name }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">{{ item.status }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">{{ getUserType(item.requester_user.user_type_id) }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">{{ item.fund_request_id }}</p>
                            </td>
                            <td>
                                <p class="text-body-1">{{ item.reject_remark }}</p>
                            </td>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center">
                                    <v-btn
                                        icon
                                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                                        v-if="item.status === 'REQUESTED'"
                                        @click="openSendFundDialog(item)"
                                        color="primary"
                                    >
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>

                                    <v-btn
                                        icon
                                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                                        v-if="item.status === 'REQUESTED'"
                                        color="error"
                                        @click="rejectAction(item)"
                                        class="ml-1"
                                    >
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-table>
            <!-- Pagination controls -->
            <div class="d-flex align-center justify-space-between mt-4" style="padding: 10px 0">
                <v-btn
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="text-center"
                    style="height: 40px; line-height: 17px; text-align: center"
                >
                    Previous Page
                </v-btn>
                <span class="text-center">Page {{ currentPage }} of {{ totalPages }}</span>
                <v-btn
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="text-center"
                    style="height: 40px; line-height: 17px; text-align: center"
                >
                    Next Page
                </v-btn>
            </div>
        </v-card-item>
    </v-card>
    <v-dialog v-model="sendFundDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Accept Fund Request</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Name:</v-label>
                            <span>{{ formFundRequestData.send_to }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Requested fund amount:</v-label>
                            <span>${{ formFundRequestData.amount }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Request ID:</v-label>
                            <span>{{ formFundRequestData.fund_request_id }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <!-- <v-text-field
                                label="Please enter transaction pin*"
                                v-model="formFundRequestData.transaction_pin"
                                required
                                type="text"
                                maxlength="4"
                                @input="limitInput"
                                :rules="[requiredRule]"
                            ></v-text-field> -->

                            <v-otp-input
                                :rules="[requiredRule]"
                                length="4"
                                label="Please enter transaction pin*"
                                required
                                v-model="formFundRequestData.transaction_pin"
                                focus-all
                                focused
                            ></v-otp-input>
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeSendFundDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn
                        color="primary"
                        :disabled="formFundRequestData.transaction_pin == ''"
                        @click="submitAddFundForm"
                        variant="tonal"
                        flat
                    >
                        Accept
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>

    <v-dialog v-model="rejectFundReqDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Reject Fund Request</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Name:</v-label>
                            <span>{{ formFundRequestData.send_to }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Requested fund amount:</v-label>
                            <span>${{ formFundRequestData.amount }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-label>Request ID:</v-label>
                            <span>{{ formFundRequestData.fund_request_id }}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Please enter rejection remark*"
                                v-model="formFundRequestData.reject_remark"
                                required
                                type="text"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeRejectFundDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn
                        color="primary"
                        :disabled="formFundRequestData.reject_remark == ''"
                        @click="submitRejectFundForm"
                        variant="tonal"
                        flat
                    >
                        Reject
                    </v-btn>
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

const router = useRouter();
const page = ref({ title: 'All Fund Requests' });
const breadcrumbs = ref([
    {
        text: 'Reports',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const selectType = ref('Received');
const requestType = ref(['Received', 'Sent']);

const selectStatus = ref('All');
const requestStatus = ref(['All', 'Requested', 'Accepted', 'Rejected']);
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const fundRequests = ref<Fund_Request[]>([]);
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

const getAllFundRequests = async () => {
    try {
        if (token) {
            const fetchedFundRequest = await apiService.getAllFundRequests(
                token,
                selectType.value.toLowerCase(),
                formData.value,
                selectStatus.value.toUpperCase()
            );
            fundRequests.value = fetchedFundRequest; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
    }
};
// Fetch users when component is mounted
onMounted(getAllFundRequests);

// Watch for changes in formData.dateFrom and formData.dateTo, and call fetchWalletData again
watch(
    () => [selectStatus.value, selectType.value, formData.value.dateFrom, formData.value.dateTo], // Watch both dates
    getAllFundRequests // Re-fetch data when dates change
);

/* Filtered data */
const filteredData = computed(() => {
    let data = fundRequests.value;

    // Filter by gender if not "All"
    // if (selectStatus.value !== 'All') {
    //     data = data.filter((item) => item.status === selectStatus.value.toUpperCase());
    // }

    // Filter by searchText if not empty, considering multiple fields
    if (searchText.value.trim()) {
        const search = searchText.value.toLowerCase();
        data = data.filter((item) => {
            return (
                item.requester_user.full_name.toLowerCase().includes(search) ||
                (item.fund_request_id && item.fund_request_id.toLowerCase().includes(search))
            );
        });
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = fundRequests.value;
    return data.length;
});

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value); // Use .value for ref
});

// Go to the next page
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

// Go to the previous page
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const clearSearchText = () => {
    searchText.value = '';
};

const rejectAction = (data: any) => {
    formFundRequestData.value.send_to = data.requester_user.full_name;
    formFundRequestData.value.amount = data.amount;
    formFundRequestData.value.fund_request_id = data.fund_request_id;
    rejectFundReqDialog.value = true;
};

// Open the Send Func dialog
const openSendFundDialog = (data: any) => {
    formFundRequestData.value.send_to = data.requester_user.full_name;
    formFundRequestData.value.amount = data.amount;
    formFundRequestData.value.fund_request_id = data.fund_request_id;
    sendFundDialog.value = true;
};
// Close the Send Func dialog
const closeSendFundDialog = () => {
    sendFundDialog.value = false;

    (formFundRequestData.value.amount = ''),
        (formFundRequestData.value.transaction_pin = ''),
        (formFundRequestData.value.fund_request_id = ''),
        (formFundRequestData.value.send_to = '');
    formFundRequestData.value.reject_remark = '';
};

// Close the Send Func dialog
const closeRejectFundDialog = () => {
    rejectFundReqDialog.value = false;

    (formFundRequestData.value.amount = ''),
        (formFundRequestData.value.transaction_pin = ''),
        (formFundRequestData.value.fund_request_id = ''),
        (formFundRequestData.value.send_to = '');
    formFundRequestData.value.reject_remark = '';
};
// Method to handle form submission
const submitAddFundForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formFundRequestData) {
            // Send formData in the API request
            const response = await apiService.acceptFundsRequest(token, formFundRequestData.value, 'accept');

            if (!response) {
                throw new Error('Error accepting fund');
            }
            getAllFundRequests();
            closeSendFundDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error accepting fund:', error);
        // Handle error (e.g., show an error message)
    }
};

// Method to handle form submission
const submitRejectFundForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formFundRequestData) {
            // Send formData in the API request
            const response = await apiService.acceptFundsRequest(token, formFundRequestData.value, 'reject');

            if (!response) {
                throw new Error('Error rejecting fund');
            }
            getAllFundRequests();
            closeRejectFundDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error rejecting fund:', error);
        // Handle error (e.g., show an error message)
    }
};

const limitInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Remove any non-digit characters
    input.value = input.value.replace(/\D/g, '').slice(0, 4); // Limit to 4 digits
    formFundRequestData.value.transaction_pin = input.value; // Update model
};
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
</style>
