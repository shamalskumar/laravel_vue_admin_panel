<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert1">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully updated system settings.</div>
            </v-alert>

            <v-row justify="end">
                <v-col cols="12" md="2">
                    <v-btn
                        text
                        color="primary"
                        class="pa-4"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                        @click="openDialog()"
                    >
                        Update Settings
                    </v-btn>
                </v-col>
            </v-row>

            <div>
                <v-card variant="outlined" class="mt-6">
                    <v-card-text>
                        <v-label class="text-h3">Withdrawal Commission Tiers</v-label>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Min Withdrawal Amount</th>

                                        <th class="text-body-1 textPrimary">Max Withdrawal Amount</th>

                                        <th class="text-body-1 textPrimary">Commission Withdrawal Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in withdrawalRanges" class="month-item">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ item.min_range }}</h6>
                                        </td>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ item.max_range }}</h6>
                                        </td>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ item.commission }}</h6>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                    </v-card-text>
                </v-card>

                <v-card variant="outlined" class="mt-6">
                    <v-card-text>
                        <v-label class="text-h3">Withdrawal Charges</v-label>
                        <br /><br />
                        <v-label class="text-h5">Bank Withdrawal Charges</v-label>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Min Withdrawal Charge</th>
                                        <th class="text-body-1 textPrimary">Max Withdrawal Charge</th>
                                        <th class="text-body-1 textPrimary">Withdrawal Charge (Percentage Charge)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="bankWithdrawalCharge">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ bankWithdrawalCharge.min_charge }}</h6>
                                        </td>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ bankWithdrawalCharge.max_charge }}</h6>
                                        </td>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ bankWithdrawalCharge.percentage_charge }}</h6>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="3">No withdrawal charges available</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                        <br />
                        <v-label class="text-h5">Agent Withdrawal Charges</v-label>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Min Withdrawal Charge</th>
                                        <th class="text-body-1 textPrimary">Max Withdrawal Charge</th>
                                        <th class="text-body-1 textPrimary">Withdrawal Charge (Percentage Charge)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="agentWithdrawalCharge">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ agentWithdrawalCharge.min_charge }}</h6>
                                        </td>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ agentWithdrawalCharge.max_charge }}</h6>
                                        </td>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">
                                                ${{ agentWithdrawalCharge.percentage_charge }}
                                            </h6>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="3">No withdrawal charges available</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                    </v-card-text>
                </v-card>
                <v-card variant="outlined" class="mt-6">
                    <v-card-text>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <tbody>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Monthly Customer Deposit Limit</th>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">
                                                ${{ systemSettings?.monthly_customer_deposit_limit }}
                                            </h6>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Monthly Merchant Deposit Limit</th>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">
                                                ${{ systemSettings?.monthly_merchant_deposit_limit }}
                                            </h6>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Agent Deposit Commission</th>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">
                                                ${{ systemSettings?.agent_deposit_commission }}
                                            </h6>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Daily Withdrawal Limit</th>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ systemSettings?.daily_withdrawal_limit }}</h6>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Min Withdrawal Limit</th>
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">${{ systemSettings?.min_withdrawal_limit }}</h6>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                    </v-card-text>
                </v-card>
            </div>
        </v-card-item>
    </v-card>
    <v-dialog v-model="openEditDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Update System Settings</span>
                </v-card-title>

                <v-card-text>
                    <div>
                        <v-card variant="outlined" class="mt-6">
                            <v-card-text>
                                <v-label class="text-h3">Withdrawal Commission Tiers(Range)</v-label>
                                <v-table class="revenue-table light-border">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Min Withdrawal Amount</th>

                                                <th class="text-body-1 textPrimary">Max Withdrawal Amount</th>

                                                <th class="text-body-1 textPrimary">Commission Withdrawal Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in formData.withdrawal_ranges" class="month-item">
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="item.min_range"
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="item.max_range"
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="item.commission"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-text>
                        </v-card>

                        <v-card variant="outlined" class="mt-6">
                            <v-card-text>
                                <v-label class="text-h3">Withdrawal Charges</v-label>
                                <br /><br />
                                <v-label class="text-h5">Bank Withdrawal Charges</v-label>
                                <v-table class="revenue-table light-border">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Min Withdrawal Charge</th>
                                                <th class="text-body-1 textPrimary">Max Withdrawal Charge</th>
                                                <th class="text-body-1 textPrimary">Withdrawal Charge (Percentage Charge)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.bank_withdrawal_charges.min_charge"
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.bank_withdrawal_charges.max_charge"
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.bank_withdrawal_charges.percentage_charge"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                                <br />
                                <v-label class="text-h5">Agent Withdrawal Charges</v-label>
                                <v-table class="revenue-table light-border">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Min Withdrawal Charge</th>
                                                <th class="text-body-1 textPrimary">Max Withdrawal Charge</th>
                                                <th class="text-body-1 textPrimary">Withdrawal Charge (Percentage Charge)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="agentWithdrawalCharge">
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.agent_withdrawal_charges.min_charge"
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.agent_withdrawal_charges.max_charge"
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.agent_withdrawal_charges.percentage_charge"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                            <tr v-else>
                                                <td colspan="3">No withdrawal charges available</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-text>
                        </v-card>
                        <v-card variant="outlined" class="mt-6">
                            <v-card-text>
                                <v-table class="revenue-table light-border">
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Monthly Customer Deposit Limit</th>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.monthly_customer_deposit_limit"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Monthly Merchant Deposit Limit</th>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.monthly_merchant_deposit_limit"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Agent Deposit Commission</th>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.agent_deposit_commission"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Daily Withdrawal Limit</th>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.daily_withdrawal_limit"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="text-body-1 textPrimary">Min Withdrawal Limit</th>
                                                <td>
                                                    <v-text-field
                                                        variant="outlined"
                                                        color="primary"
                                                        v-model="formData.min_withdrawal_limit"
                                                    ></v-text-field>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitUpdate" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';

import type {
    AgentWithdrawalCharges,
    BankWithdrawalCharges,
    SystemSettings,
    WithDrawalCharge,
    WithdrawalRanges
} from '@/models/systemModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import { sys } from 'typescript';

const page = ref({ title: 'System Settings' });
const breadcrumbs = ref([
    {
        text: 'Settings',
        disabled: true,
        href: '#'
    }
]);

const requiredRule = (v: any) => !!v || 'This field is required';
const openEditDialog = ref(false);

const showAlert1 = ref(false);
const showAlert2 = ref(false);
const showAlert3 = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

const systemSettings = ref<SystemSettings | null>(null);

const withdrawalRanges = ref<WithdrawalRanges[]>([]);
const agentWithdrawalCharge = ref<AgentWithdrawalCharges | null>(null);
const bankWithdrawalCharge = ref<BankWithdrawalCharges | null>(null);

const formData = ref<any>({
    agent_withdrawal_charges: {
        max_charge: '',
        min_charge: '',
        percentage_charge: ''
    },
    bank_withdrawal_charges: {
        max_charge: '',
        min_charge: '',
        percentage_charge: ''
    },
    withdrawal_ranges: [
        // Initialize with an example range
        {
            max_range: '', // String values
            min_range: '', // String values
            commission: '' // String values
        }
        // You can add more initial ranges here if needed
    ] as WithdrawalRanges[], // Ensure this is treated as an array of WithdrawalRange
    monthly_customer_deposit_limit: '',
    monthly_merchant_deposit_limit: '',
    agent_deposit_commission: '',
    daily_withdrawal_limit: '',
    min_withdrawal_limit: ''
});

// Fetch users when component is mounted
onMounted(async () => {
    getSystemSettings();
});

const openDialog = () => {
    openEditDialog.value = true;

    formData.value.agent_withdrawal_charges.max_charge = agentWithdrawalCharge.value?.max_charge;
    formData.value.agent_withdrawal_charges.min_charge = agentWithdrawalCharge.value?.min_charge;
    formData.value.agent_withdrawal_charges.percentage_charge = agentWithdrawalCharge.value?.percentage_charge;

    formData.value.bank_withdrawal_charges.max_charge = bankWithdrawalCharge.value?.max_charge;
    formData.value.bank_withdrawal_charges.min_charge = bankWithdrawalCharge.value?.min_charge;
    formData.value.bank_withdrawal_charges.percentage_charge = bankWithdrawalCharge.value?.percentage_charge;

    formData.value.withdrawal_ranges = withdrawalRanges.value;

    formData.value.monthly_customer_deposit_limit = systemSettings.value?.monthly_customer_deposit_limit;
    formData.value.monthly_merchant_deposit_limit = systemSettings.value?.monthly_merchant_deposit_limit;
    formData.value.agent_deposit_commission = systemSettings.value?.agent_deposit_commission;
    formData.value.daily_withdrawal_limit = systemSettings.value?.daily_withdrawal_limit;
    formData.value.min_withdrawal_limit = systemSettings.value?.min_withdrawal_limit;
};

const closeDialog = () => {
    openEditDialog.value = false;

    formData.value.agent_withdrawal_charges.max_charge = '';
    formData.value.agent_withdrawal_charges.min_charge = '';
    formData.value.agent_withdrawal_charges.percentage_charge = '';

    formData.value.bank_withdrawal_charges.max_charge = '';
    formData.value.bank_withdrawal_charges.min_charge = '';
    formData.value.bank_withdrawal_charges.percentage_charge = '';

    formData.value.withdrawal_ranges = '';

    formData.value.monthly_customer_deposit_limit = '';
    formData.value.monthly_merchant_deposit_limit = '';
    formData.value.agent_deposit_commission = '';
    formData.value.daily_withdrawal_limit = '';
    formData.value.min_withdrawal_limit = '';
};

const submitUpdate = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formData) {
            // Send formData in the API request
            const response = await apiService.updateSystemSettings(token, formData.value);

            if (!response) {
                throw new Error('Error updating system settings');
            }
            displayAlert1();
            getSystemSettings();
            closeDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error updating system settings:', error);
        // Handle error (e.g., show an error message)
    }
};

const displayAlert1 = () => {
    showAlert1.value = true;
    setTimeout(() => {
        showAlert1.value = false;
    }, 5000); // Adjust the time in milliseconds as needed
};

const getSystemSettings = async () => {
    try {
        if (token) {
            const fetchedSystemSettigns = await apiService.getSystemSetting(token);
            withdrawalRanges.value = fetchedSystemSettigns[0].withdrawal_commission_tiers.withdrawal_ranges;
            agentWithdrawalCharge.value = fetchedSystemSettigns[0].withdrawal_charges.agent_withdrawal_charges;
            bankWithdrawalCharge.value = fetchedSystemSettigns[0].withdrawal_charges.bank_withdrawal_charges;
            systemSettings.value = fetchedSystemSettigns[0];
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
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
