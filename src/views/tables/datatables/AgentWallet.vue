<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { User, AgentWallet } from '@/models/userModel'; // type-only import
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

// Get token from the Pinia auth store
const authStore = useAuthStore();
const userStore = useUserStore();
const users = ref<User[]>([]); // Store users from the API with the correct type
const token = authStore.token;

const agentWallet = ref<AgentWallet[]>([]); // an array of wallets

onMounted(async () => {
    try {
        // If agent_wallets is an array, assign it directly
        agentWallet.value = userStore.userData!.agent.agent_wallets;
    } catch (error) {
        console.error('Error, no agent wallet found', error);
    }
});

const headers = ref([
    { title: 'Date', align: 'start', key: 'created_at' },
    { title: 'Wallet Type', key: 'wallet_type' },
    { title: 'Wallet Limit', key: 'wallet_limit' },
    { title: 'Balance', key: 'balance' },
    { title: 'Blocked Balance', key: 'blocked_balance' }
]);
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-h6 ps-6">Date</th>
                        <th class="text-h6">Wallet Type</th>
                        <th class="text-h6">Wallet Limit</th>
                        <th class="text-h6">Balance</th>
                        <th class="text-h6">Blocked Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in agentWallet" :key="item.wallet_type" class="month-item">
                        <td>
                            <p class="text-16 textPrimary">{{ formatDate(item.created_at) }}</p>
                        </td>
                        <td>
                            <p class="text-16 textPrimary">{{ item.wallet_type }}</p>
                        </td>
                        <td>
                            <p class="text-16 textPrimary">${{ item.wallet_limit }}</p>
                        </td>
                        <td>
                            <p class="text-16 textPrimary">${{ item.balance }}</p>
                        </td>
                        <td>
                            <p class="text-16 textPrimary">${{ item.blocked_balance }}</p>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
</template>
