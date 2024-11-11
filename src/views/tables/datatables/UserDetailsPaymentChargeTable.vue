<script lang="ts" setup>
import { computed, nextTick, ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { apiService } from '@/api/apiService';
import type { PaymentChargePackage, PaymentCharges, User } from '@/models/userModel'; // type-only import
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore';
import { basicTableData2, tableActionData } from '@/_mockApis/components/table/basicTables';

// Get token from the Pinia auth store
const authStore = useAuthStore();
const userStore = useUserStore();
const users = ref<User[]>([]); // Store users from the API with the correct type
const token = authStore.token;
const paymentChargePackage = ref<PaymentChargePackage[]>([]); // Store schemes from the API with the correct type
//const selectedScheme = ref<TransferLimitScheme | null>(null); // Store selected scheme for editing
const selectedPackage = ref<PaymentChargePackage>({
    id: 0,
    package_name: '',
    package_type: '',
    is_default: 0,
    payment_charges: {
        max_charge: 0,
        min_charge: 0,
        charge_type: '',
        fixed_charge: '',
        percentage_charge: 0
    },
    created_at: '',
    updated_at: '',
    pivot: {
        user_id: 0,
        payment_charge_package_id: 0
    }
});

onMounted(async () => {
    try {
        if (token) {
            const fetchedPaymentChargePackage = await apiService.getPaymentChargePackage(token);
            paymentChargePackage.value = fetchedPaymentChargePackage;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching payment charge package:', error);
    }
});

const dialog = ref(false);
const headers = ref([
    { title: 'Package Name', align: 'start', key: 'package_name' },
    { title: 'Package Type', key: 'package_type' },
    { title: 'Actions', key: 'actions' }
]);

const editedIndex = ref(-1);
const editedItem = ref<PaymentChargePackage>({
    id: 0,
    package_name: '',
    package_type: '',
    is_default: 0,
    payment_charges: {
        max_charge: 0,
        min_charge: 0,
        charge_type: '',
        fixed_charge: '',
        percentage_charge: 0
    },
    created_at: '',
    updated_at: '',
    pivot: {
        user_id: 0,
        payment_charge_package_id: 0
    }
});
const defaultItem = ref<PaymentChargePackage>({
    id: 0,
    package_name: '',
    package_type: '',
    is_default: 0,
    payment_charges: {
        max_charge: 0,
        min_charge: 0,
        charge_type: '',
        fixed_charge: '',
        percentage_charge: 0
    },
    created_at: '',
    updated_at: '',
    pivot: {
        user_id: 0,
        payment_charge_package_id: 0
    }
});

// Filter the transferLimitScheme based on the userData's payment_charge_package
const filteredPaymentChargePackage = computed(() => {
    return paymentChargePackage.value.filter((scheme) => scheme.package_type === selectedPackage.value.package_type);
});

function editItem(item: PaymentChargePackage) {
    selectedPackage.value = { ...item }; // Clone item for editing

    dialog.value = true;
}

function close() {
    dialog.value = false;
    nextTick(() => {
        editedItem.value = { ...defaultItem.value };
        editedIndex.value = -1;
    });
}

async function save(item: number) {
    if (token && userStore.userData?.id) {
        try {
            // Update the transfer limit scheme (assuming you have a method for this)
            await apiService.updatePaymentChargePackage(item, userStore.userData.id, token);
            // Fetch the updated schemes again if necessary

            // If successful, update the user data in the store
            const updatedUserData = await apiService.searchUsersByID(token, userStore.userData.id);

            userStore.setUserData(updatedUserData[0]); // Assuming updateUserData exists in userStore
        } catch (error) {
            console.error('Error saving Payment Charge Package:', error);
        }
    } else {
        console.error('No token found');
    }
    close();
}

watch(dialog, (val) => {
    val || close();
});

// Method to determine if the button should be disabled
const shouldDisableButton = (id: number) => {
    return selectedPackage.value.id === id; // Example: disable the button if the item is already selected
};
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-data-table :headers="headers" :items="userStore.userData?.payment_charge_package">
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="900px">
                        <v-card>
                            <v-card-title class="pa-4 bg-primary">
                                <span class="text-h5">Edit Payment Charge Package</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container class="px-0">
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-table class="month-table">
                                                <thead>
                                                    <tr>
                                                        <th class="text-h6 ps-6">Package Name</th>
                                                        <th class="text-h6">Package Type</th>
                                                        <th class="text-h6"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr
                                                        v-for="item in filteredPaymentChargePackage"
                                                        :key="item.package_name"
                                                        class="month-item"
                                                    >
                                                        <td class="ps-6">
                                                            <div class="d-flex gap-3 align-center">
                                                                <h6 class="text-h6">{{ item.package_name }}</h6>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="text-body-1 textPrimary">{{ item.package_type }}</div>
                                                        </td>

                                                        <td>
                                                            <v-btn
                                                                color="primary"
                                                                variant="flat"
                                                                dark
                                                                @click="save(item.id)"
                                                                :disabled="shouldDisableButton(item.id)"
                                                            >
                                                                Select
                                                            </v-btn>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </v-table>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" variant="flat" dark @click="close"> Cancel </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-3">
                        <Icon
                            icon="solar:pen-new-square-broken"
                            height="20"
                            class="text-primary cursor-pointer"
                            size="small"
                            @click="editItem(item)"
                        />
                    </div>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
