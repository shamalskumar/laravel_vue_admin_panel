<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { Wallet, AgentWallet } from '@/models/walletModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import type { UserVoucherDetails, VoucherDetails } from '@/models/voucherModel';
import { useVoucherStore } from '@/stores/voucherStore'; // Adjust the path as necessary

// Refs and user data
const tab = ref(0);
const authStore = useAuthStore();
const token = authStore.token;
const userStore = useUserStore();
const wallet = ref<Wallet[]>([]);
const agentFundWallet = ref<AgentWallet[]>([]);
const agentCommissionWallet = ref<AgentWallet[]>([]);
const userVoucherDetails = ref<UserVoucherDetails[]>([]);

const vouchers = ref<VoucherDetails[]>([]); // Store vouchers from the API with the correct type

const voucherStore = useVoucherStore();

// Function to fetch wallet data
const fetchWalletData = async () => {
    try {
        if (token && voucherStore.voucherData?.id) {
            const fetchedUserWalletData = await apiService.getRedeemedVoucherByID(token, Number(voucherStore.voucherData?.voucher_id));
            userVoucherDetails.value = fetchedUserWalletData.data[0].transaction_user_voucher;

            console.log(fetchedUserWalletData.data[0].transaction_user_voucher[0]);
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
};

// Call fetchWalletData when the component is mounted
onMounted(fetchWalletData);

/*Header Data*/
const headers: any = ref([
    { title: 'Transaction Date', align: 'start', key: 'user_transaction.created_at', width: '150px' },
    { title: 'Transaction ID', align: 'start', key: 'wallet_transaction_id', width: '100px' },
    { title: 'Description', align: 'start', key: 'user_transaction.description', width: '100px' },
    { title: 'Debit Amount', align: 'start', key: 'user_transaction.debit_amount', width: '100px' },
    { title: 'Credit Amount', align: 'start', key: 'user_transaction.credit_amount', width: '100px' },
    { title: 'Debit User', align: 'start', key: 'user_transaction.debited_user.user_type', width: '100px' },
    { title: 'Credit User', align: 'start', key: 'user_transaction.credited_user.username', width: '100px' }
]);
</script>

<template>
    <v-card elevation="0">
        <v-card-text class="rounded-md pa-0 mt-6">
            <!-- Wallet History Section -->

            <v-data-table
                items-per-page="10"
                :headers="headers"
                :items="userVoucherDetails"
                item-value="name"
                class="border rounded-md datatabels small-text-table"
            >
                <!-- Scoped slots to format dollar values -->
                <template v-slot:item.user_transaction.credit_amount="{ item }">
                    <span v-if="item.user_transaction.credit_amount">${{ item.user_transaction.credit_amount }}</span>
                </template>
                <template v-slot:item.user_transaction.debit_amount="{ item }">
                    <span v-if="item.user_transaction.debit_amount">${{ item.user_transaction.debit_amount }}</span>
                </template>

                <template v-slot:item.user_transaction.created_at="{ item }">
                    <span v-if="item.user_transaction.created_at">{{ formatDate(item.user_transaction.created_at) }}</span>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>
