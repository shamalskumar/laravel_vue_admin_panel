<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert1">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Bank Updated Successfully.</div>
            </v-alert>

            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert2">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Bank Added Successfully.</div>
            </v-alert>

            <v-row justify="end">
                <v-col cols="12" md="2">
                    <v-btn
                        text
                        @click="openAddDialog()"
                        color="primary"
                        class="pa-4"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Add Bank
                    </v-btn>
                </v-col>
            </v-row>

            <div class="mt-4">
                <v-table class="revenue-table light-border">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-body-1 textPrimary">Created At</th>

                                <th class="text-body-1 textPrimary">Name</th>

                                <th class="text-body-1 textPrimary">Swift</th>
                                <th class="text-body-1 textPrimary">BSB</th>
                                <th class="text-body-1 textPrimary">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in banks" :key="item.id" class="month-item">
                                <td>
                                    <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                </td>
                                <td>
                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.bank_name }}</h6>
                                </td>

                                <td>
                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.swift }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.bsb }}</h6>
                                </td>

                                <td>
                                    <div style="display: flex; gap: 8px; align-items: center">
                                        <v-btn
                                            v-if="item.deleted_at"
                                            @click="enableBank(item.id)"
                                            color="success"
                                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                                        >
                                            Enable
                                        </v-btn>
                                        <v-btn
                                            v-if="item.deleted_at == null"
                                            @click="disableBank(item.id)"
                                            color="secondary"
                                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                                        >
                                            Disable
                                        </v-btn>

                                        <v-btn
                                            @click="openDialog(item)"
                                            icon
                                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                                        >
                                            <v-icon color="primary">mdi-pencil</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-table>
            </div>
        </v-card-item>
    </v-card>

    <v-dialog v-model="updateBankDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Update Bank Information</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Bank Name</v-label>
                            <v-text-field variant="outlined" color="primary" v-model="formData.bank_name"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Swift Code</v-label>
                            <v-text-field variant="outlined" color="primary" v-model="formData.swift"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">BSB Code</v-label>
                            <v-text-field variant="outlined" color="primary" type="number" v-model="formData.bsb"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn color="primary" @click="updateBank" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
    <v-dialog v-model="addBankDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add New Bank</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Bank Name</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="formData.bank_name"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Swift Code</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="formData.swift"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">BSB Code</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                type="number"
                                v-model="formData.bsb"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn color="primary" @click="addBank" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { TransferLimitScheme, User } from '@/models/userModel'; // type-only import

import type { Notifications, Banks } from '@/models/systemModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const page = ref({ title: 'System Bank List' });
const breadcrumbs = ref([
    {
        text: 'Bank Withdrawal',
        disabled: true,
        href: '#'
    }
]);

const requiredRule = (v: any) => !!v || 'This field is required';
const sendNotificationDialog = ref(false);
const updateBankDialog = ref(false);
const addBankDialog = ref(false);

const showAlert1 = ref(false);
const showAlert2 = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

const formData = ref({
    bank_id: '',
    bank_name: '',
    swift: '',
    bsb: 0
});

const formAddData = ref({
    bank_name: '',
    swift: '',
    bsb: 0
});

const notifications = ref<Notifications[]>([]);
const banks = ref<Banks[]>([]);

// Fetch users when component is mounted
onMounted(async () => {
    getBanks();
});

const displayAlert1 = () => {
    showAlert1.value = true;
    setTimeout(() => {
        showAlert1.value = false;
    }, 5000); // Adjust the time in milliseconds as needed
};

const displayAlert2 = () => {
    showAlert2.value = true;
    setTimeout(() => {
        showAlert2.value = false;
    }, 5000); // Adjust the time in milliseconds as needed
};

const enableBank = async (item: number) => {
    try {
        if (token) {
            const response = await apiService.enableBank(token, item);
            if (!response) {
                throw new Error('Error in enabling bank');
            }
            displayAlert1();
            getBanks();
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error in enabling bank:', error);
    }
};

const disableBank = async (item: number) => {
    try {
        if (token) {
            const response = await apiService.disableBank(token, item);
            if (!response) {
                throw new Error('Error in disabling bank');
            }
            displayAlert1();
            getBanks();
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error in disabling bank:', error);
    }
};

const openDialog = async (item: any) => {
    console.log(item);
    formData.value.bank_id = item.id;
    formData.value.bank_name = item.bank_name;
    formData.value.bsb = item.bsb;
    formData.value.swift = item.swift;
    updateBankDialog.value = true;
};

const closeDialog = async () => {
    formData.value.bank_id = '';
    formData.value.bank_name = '';
    formData.value.bsb = 0;
    formData.value.swift = '';
    updateBankDialog.value = false;
};

const openAddDialog = async () => {
    addBankDialog.value = true;
};

const closeAddDialog = async () => {
    formAddData.value.bank_name = '';
    formAddData.value.bsb = 0;
    formAddData.value.swift = '';
    addBankDialog.value = false;
};

const updateBank = async (item: number) => {
    try {
        if (token) {
            const response = await apiService.updateBank(token, formData.value);
            if (!response) {
                throw new Error('Error in updating bank');
            }
            closeDialog();
            displayAlert1();
            getBanks();
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error in updating bank:', error);
    }
};

const addBank = async () => {
    try {
        if (token) {
            const response = await apiService.addBank(token, formData.value);
            if (!response) {
                throw new Error('Error in updating bank');
            }
            closeAddDialog();
            displayAlert2();

            getBanks();
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error in updating bank:', error);
    }
};

const getBanks = async () => {
    try {
        if (token) {
            const fetchedBanks = await apiService.getBanks(token);
            banks.value = fetchedBanks;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const sendNotification = async () => {
    sendNotificationDialog.value = true;
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
