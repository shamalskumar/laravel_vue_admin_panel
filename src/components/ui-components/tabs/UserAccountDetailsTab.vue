<script setup lang="ts">
import { ref } from 'vue';

import UserDetailsCrudTable from '@/views/tables/datatables/UserDetailsTransferLimitTable.vue';
import PaymentChargeTable from '@/views/tables/datatables/UserDetailsPaymentChargeTable.vue';
import WalletLimitTable from '@/views/tables/datatables/UserDetailsWalletLimitTable.vue';

import AgentWallet from '@/views/tables/datatables/AgentWallet.vue';

import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const tab = ref(null);
</script>
<template>
    <v-card elevation="0"
        ><v-card-item>
            <v-tabs v-model="tab" color="primary" align-tabs="left">
                <v-tab value="1">Transfer Limit Scheme</v-tab>
                <v-tab value="2" v-if="userStore.userData?.payment_charge_package[0]">Payment Charge Package</v-tab>
                <v-tab value="3">Wallet Limit Scheme</v-tab>
                <v-tab value="4" v-if="userStore.userData?.user_type_id === 3">Agent Wallet</v-tab>
            </v-tabs>

            <v-card-text class="rounded-md pa-0 mt-6">
                <v-window v-model="tab">
                    <v-window-item value="1">
                        <UserDetailsCrudTable />
                    </v-window-item>
                    <v-window-item value="2">
                        <PaymentChargeTable />
                    </v-window-item>
                    <v-window-item value="3">
                        <WalletLimitTable />
                    </v-window-item>
                    <v-window-item value="4">
                        <AgentWallet />
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card-item>
    </v-card>
</template>
