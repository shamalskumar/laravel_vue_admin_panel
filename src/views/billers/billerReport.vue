<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { ref, onMounted, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import type { BillPayment } from '@/models/billModel';

// Refs and user data

const authStore = useAuthStore();
const token = authStore.token;
const userStore = useUserStore();
const billPayments = ref<BillPayment[]>([]);

const breadcrumbs = ref([
    {
        text: 'Billers',
        disabled: true,
        href: '#'
    }
]);

const page = ref({ title: 'Bill Report' });

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
const date200DaysAgo = new Date();
date200DaysAgo.setDate(currentDate.getDate() - 200);

// Initialize formData with the calculated dates
const formData = ref({
    dateFrom: formatDateFilter(date200DaysAgo), // 90 days before the current date
    dateTo: formatDateFilter(currentDate) // Current date
});

// Function to fetch wallet data
const fetchBillPaymentData = async () => {
    try {
        if (token) {
            const fetchedBillPayment = await apiService.getBillPayment(token, formData.value.dateFrom, formData.value.dateTo);

            billPayments.value = fetchedBillPayment.map((transaction: BillPayment) => ({
                ...transaction,
                created_at: formatDate(transaction.created_at),
                updated_at: formatDate(transaction.updated_at)
            }));
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching bill payment data:', error);
    }
};

// Call fetchBillPaymentData when the component is mounted
onMounted(fetchBillPaymentData);

// Watch for changes in formData.dateFrom and formData.dateTo, and call fetchBillPaymentData again
watch(
    () => [formData.value.dateFrom, formData.value.dateTo], // Watch both dates
    fetchBillPaymentData // Re-fetch data when dates change
);

/*Header Data*/
const headers: any = ref([
    { title: 'Date', align: 'start', key: 'created_at', width: '100px' },
    { title: 'Name', align: 'start', key: 'biller.biller_name', width: '100px' },
    { title: 'Bill Payment ID', align: 'end', key: 'bill_payment_id', width: '100px' },
    { title: 'Amount', align: 'end', key: 'amount', width: '100px' }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-row>
                <v-col cols="12" md="2">
                    <v-label class="mb-2 font-weight-medium">From Date</v-label>
                    <v-text-field color="primary" variant="outlined" type="date" v-model="formData.dateFrom"></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                    <v-label class="mb-2 font-weight-medium">To Date</v-label>
                    <v-text-field color="primary" variant="outlined" type="date" v-model="formData.dateTo"></v-text-field>
                </v-col>
            </v-row>

            <v-card-text class="rounded-md pa-0 mt-6">
                <v-data-table
                    items-per-page="10"
                    :headers="headers"
                    :items="billPayments"
                    item-value="name"
                    class="border rounded-md datatabels small-text-table"
                >
                    <!-- Scoped slots to format dollar values -->
                    <template v-slot:item.created_at="{ item }">
                        <span v-if="item.created_at">{{ item.created_at }}</span>
                    </template>

                    <template v-slot:item.amount="{ item }">
                        <span>${{ item.amount }}</span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card-item>
    </v-card>
</template>

<!-- // amount, transaction_pin, send_to, description,is_wallet_refill -->
<style lang="scss">
.avatar-border {
    background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
    border-radius: 50%;
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    .userImage {
        border: 4px solid rgb(255, 255, 255);
    }
}

.top-spacer {
    margin-top: -95px;
}

.profiletab .v-slide-group__content {
    justify-content: end;
    .v-btn--variant-text .v-btn__overlay {
        background: transparent;
    }
}

@media (max-width: 1023px) {
    .order-sm-second {
        order: 2;
    }
    .order-sml-first {
        order: 1;
    }
    .order-sm-third {
        order: 3;
    }
    .order-sm-last {
        order: 4;
    }
}

.btn-brand-facebook {
    background-color: rgb(24, 119, 242) !important;
}

.btn-brand-twitter {
    background-color: rgb(29, 161, 242) !important;
}
.btn-brand-dribbble {
    background-color: rgb(234, 76, 137) !important;
}
.btn-brand-youtube {
    background-color: rgb(205, 32, 31) !important;
}
</style>
