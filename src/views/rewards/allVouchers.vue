<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Gender select -->
                <div style="flex: 3">
                    <v-select
                        v-model="select"
                        :items="status"
                        label="Select Status"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select>
                </div>

                <div style="flex: 2">
                    <v-select
                        v-model="selectVoucherFor"
                        :items="voucherFor"
                        label="Select Voucher For"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select>
                </div>
                <div style="flex: 1">
                    <v-select
                        v-model="itemsPerPage"
                        :items="itemsPerPageOptions"
                        label="Items per Page"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select>
                </div>
            </div>

            <div class="mt-4">
                <v-window>
                    <v-table class="revenue-table light-border">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-body-1 textPrimary">Promotion Name</th>
                                    <th class="text-body-1 textPrimary">Date</th>
                                    <th class="text-body-1 textPrimary">Voucher For</th>
                                    <th class="text-body-1 textPrimary">Expiry Date</th>
                                    <th class="text-body-1 textPrimary">Min Transaction Amount</th>
                                    <th class="text-body-1 textPrimary">Cashback Amount</th>
                                    <th class="text-body-1 textPrimary">Voucher Description</th>
                                    <th class="text-body-1 textPrimary">Code</th>
                                    <th class="text-body-1 textPrimary">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in filteredData" :key="item.id" class="month-item">
                                    <td>
                                        <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.promotion_name }}</h6>
                                    </td>
                                    <td>
                                        <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                    </td>
                                    <td>
                                        <p class="text-body-1">{{ item.voucher.data.voucher_for }}</p>
                                    </td>
                                    <td>
                                        <p class="text-body-1">{{ formatDate(item.voucher.expires_at) }}</p>
                                    </td>
                                    <td>
                                        <p class="text-body-1">${{ item.voucher.data.min_txn_amount }}</p>
                                    </td>
                                    <td>
                                        <p class="text-body-1">${{ item.voucher.data.cashback_amount }}</p>
                                    </td>
                                    <td>
                                        <p class="text-body-1">{{ item.voucher.data.voucher_description }}</p>
                                    </td>
                                    <td>
                                        <p class="text-body-1">{{ item.voucher.code }}</p>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 8px; align-items: center">
                                            <v-btn
                                                icon
                                                @click="viewItem(item)"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="primary">mdi-information</v-icon>
                                            </v-btn>
                                            <v-btn
                                                v-if="item.voucher.data.is_active === false"
                                                icon
                                                @click="enableItem(item)"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="success">mdi-check</v-icon>
                                            </v-btn>
                                            <v-btn
                                                v-if="item.voucher.data.is_active === true"
                                                icon
                                                @click="disableItem(item)"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="error">mdi-close</v-icon>
                                            </v-btn>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-window>
            </div>

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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/models/userModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import type { VoucherDetails } from '@/models/voucherModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import { useVoucherStore } from '@/stores/voucherStore'; // Adjust the path as necessary

const router = useRouter();
const page = ref({ title: 'All Vouchers' });
const breadcrumbs = ref([
    {
        text: 'Rewards',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const select = ref('All');
const status = ref(['All', 'Active', 'Expired']);
const selectVoucherFor = ref('All');
const voucherFor = ref(['All', 'FUND_REQUEST', 'DEPOSIT', 'BILL_PAYMENT', 'MERCHANT_PAYMENT']);
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const itemsPerPageOptions = ref([10, 30, 50, 100]); // Options for items per page
const vouchers = ref<VoucherDetails[]>([]); // Store vouchers from the API with the correct type
const sendFundDialog = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Fetch vouchers when component is mounted
onMounted(async () => {
    getvouchers();
});

const getvouchers = async () => {
    try {
        if (token) {
            const fetchedVouchers = await apiService.getAllvouchers(token);
            //   console.log(fetchedVouchers);
            vouchers.value = fetchedVouchers; // Store fetched vouchers
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching vouchers:', error);
    }
};

/* Filtered data */
const filteredData = computed(() => {
    let data = vouchers.value;

    // Filter by gender if not "All"
    if (select.value !== 'All') {
        if (select.value === 'Active') {
            data = data.filter((item) => item.voucher.data.is_active === true);
        } else {
            data = data.filter((item) => item.voucher.data.is_active === false);
        }
    }

    // Filter by gender if not "All"
    if (selectVoucherFor.value !== 'All') {
        data = data.filter((item) => item.voucher.data.voucher_for === selectVoucherFor.value);
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = vouchers.value;
    // Filter by gender if not "All"
    if (select.value !== 'All') {
        if (select.value === 'Active') {
            data = data.filter((item) => item.voucher.data.is_active === true);
        } else {
            data = data.filter((item) => item.voucher.data.is_active === false);
        }
    }

    // Filter by gender if not "All"
    if (selectVoucherFor.value !== 'All') {
        data = data.filter((item) => item.voucher.data.voucher_for === selectVoucherFor.value);
    }

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

const viewItem = (item: VoucherDetails) => {
    const voucherstore = useVoucherStore();
    voucherstore.setUserData(item); // Store user data
    // // Navigate to the "User Profile" route
    router.push({ name: 'Voucher Information' });
};

const disableItem = async (item: VoucherDetails) => {
    if (token && item) {
        try {
            // Update the transfer limit scheme (assuming you have a method for this)
            await apiService.updateVoucher(false, item.id, token);
            // Fetch the updated schemes again if necessary
            getvouchers();
        } catch (error) {
            console.error('Error saving transfer limit scheme:', error);
        }
    } else {
        console.error('No token found');
    }
};

const enableItem = async (item: VoucherDetails) => {
    if (token && item) {
        try {
            // Update the transfer limit scheme (assuming you have a method for this)
            await apiService.updateVoucher(true, item.id, token);
            // Fetch the updated schemes again if necessary
            getvouchers();
        } catch (error) {
            console.error('Error saving transfer limit scheme:', error);
        }
    } else {
        console.error('No token found');
    }
    getvouchers();
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
