<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RevenueProjectsData } from '@/_mockApis/components/dashboard/dashboard1';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';
import type { Fund_Request } from '@/models/fundRequest';
import type { BusinessMetrics } from '@/models/systemModel';
// v-select options
const select = ref('All');
const userType = ref(['All', 'Customer', 'Merchant', 'Agent']);
const fundRequests = ref<Fund_Request[]>([]);
const data = ref<Fund_Request[]>([]);

const authStore = useAuthStore();
const token = authStore.token;
const acceptReqDialog = ref(false);
const rejectReqDialog = ref(false);

const formData = ref({
    transaction_pin: '',
    transactionID: ''
});

const formRejectData = ref({
    reject_remark: '',
    transactionID: ''
});

onMounted(async () => {
    getFundRequests();
});

const getFundRequests = async () => {
    try {
        if (token) {
            const fetchedRequests = await apiService.getFundRequests(token);
            console.log(fetchedRequests);
            fundRequests.value = fetchedRequests;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
// Pagination variables
const currentPage = ref(1);
const itemsPerPage = 10;

/* Filtered data */
const filteredData = computed(() => {
    data.value = fundRequests.value;
    if (select.value !== 'All') {
        data.value = fundRequests.value.filter((item) => item.requester_user.user_type === select.value);
    }
    // Calculate paginated data
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.value.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    return select.value === 'All'
        ? fundRequests.value.length
        : fundRequests.value.filter((item) => item.requester_user.user_type === select.value).length;
});

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage);
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

const acceptRequest = (item: any) => {
    acceptReqDialog.value = true;
    formData.value.transactionID = item;
};
const rejectRequest = (item: any) => {
    rejectReqDialog.value = true;
    formRejectData.value.transactionID = item;
};

const closeDialog = async () => {
    formData.value.transaction_pin = '';
    formData.value.transactionID = '';
    acceptReqDialog.value = false;
};

const closeRejectDialog = async () => {
    formRejectData.value.reject_remark = '';
    formRejectData.value.transactionID = '';
    rejectReqDialog.value = false;
};

const accept = async () => {
    try {
        if (token) {
            const response = await apiService.acceptFundRequent(token, formData.value);
            if (!response) {
                throw new Error('Error in accepting fund request');
            }
            closeDialog();
            getFundRequests();
            formData.value.transaction_pin = '';
            acceptReqDialog.value = false;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error in accepting fund request:', error);
    }
};

const reject = async () => {
    try {
        if (token) {
            const response = await apiService.rejectFundRequent(token, formRejectData.value);
            if (!response) {
                throw new Error('Error in accepting fund request');
            }
            closeRejectDialog();
            getFundRequests();
            formRejectData.value.transactionID = '';
            rejectReqDialog.value = false;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error in accepting fund request:', error);
    }
};

const limitInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    formData.value.transaction_pin = input.value.replace(/\D/g, '').slice(0, 4); // Remove non-numeric characters and limit to 10 digits
};
</script>

<template>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between">
                <v-card-title class="text-h5">Pending Fund Request</v-card-title>
                <v-row justify="end" class="mt-4">
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="select"
                            :items="userType"
                            label="Select User Type"
                            variant="outlined"
                            density="compact"
                            class="text-body-1"
                            hide-details
                        ></v-select></v-col
                ></v-row>
            </div>

            <div class="mt-4">
                <v-window>
                    <v-window-item>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Name</th>
                                        <th class="text-body-1 textPrimary">VisionPay User ID</th>
                                        <th class="text-body-1 textPrimary">Amount</th>
                                        <th class="text-body-1 textPrimary">Status</th>
                                        <th class="text-body-1 textPrimary">Transaction No</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in filteredData" :key="item.id" class="month-item">
                                        <td>
                                            <p class="text-body-1">
                                                {{ item.requester_user.full_name }}
                                            </p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.requester_user.pacpay_user_id }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.amount }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.status }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.transaction_ref_no }}</p>
                                        </td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                @click="acceptRequest(item.fund_request_id)"
                                                icon
                                                color="primary"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon>mdi-check</v-icon>
                                            </v-btn>
                                            <v-btn
                                                icon
                                                @click="rejectRequest(item.fund_request_id)"
                                                color="error"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </div>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                    </v-window-item>
                </v-window>
            </div>

            <!-- Pagination controls -->
            <div class="d-flex align-center justify-space-between mt-4">
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

    <v-dialog v-model="acceptReqDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Accept Fund Request</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Enter Transaction Pin</v-label>
                            <v-otp-input
                                label="Please enter transaction pin*"
                                length="4"
                                v-model="formData.transaction_pin"
                                focus-all
                                focused
                            ></v-otp-input>
                            <!-- <v-text-field variant="outlined" color="primary" v-model="formData.transaction_pin" type="number" @input="limitInput"></v-text-field> -->
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn :disabled="formData.transaction_pin === ''" color="primary" @click="accept" variant="tonal" flat> Accept </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>

    <v-dialog v-model="rejectReqDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Reject Fund Request</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Enter Remark</v-label>
                            <v-text-field variant="outlined" color="primary" v-model="formRejectData.reject_remark"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeRejectDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn :disabled="formRejectData.reject_remark === ''" color="primary" @click="reject" variant="tonal" flat>
                        Reject
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>
