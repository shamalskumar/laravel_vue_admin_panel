<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert1">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully added new package type.</div>
            </v-alert>

            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert2">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully updated package.</div>
            </v-alert>

            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert3">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully set package as default.</div>
            </v-alert>
            <v-row justify="end">
                <v-col cols="12" md="2">
                    <v-btn
                        text
                        @click="addnewPackage()"
                        color="primary"
                        class="pa-4"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Add New Package
                    </v-btn>
                </v-col>
            </v-row>
            <v-row justify="start">
                <v-col cols="12" md="4">
                    <v-select
                        v-model="select"
                        :items="packageType"
                        label="Select Package Type"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select
                ></v-col>
            </v-row>

            <div class="mt-4">
                <v-table class="revenue-table light-border">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-body-1 textPrimary">Date</th>

                                <th class="text-body-1 textPrimary">Package Name</th>

                                <th class="text-body-1 textPrimary">Package Type</th>
                                <th class="text-body-1 textPrimary">Max Charge</th>
                                <th class="text-body-1 textPrimary">Min Charge</th>
                                <th class="text-body-1 textPrimary">Percentage Charge</th>
                                <th class="text-body-1 textPrimary">Fixed Charge</th>
                                <th class="text-body-1 textPrimary">Action</th>
                            </tr>
                        </thead>
                        <!-- {{ filteredData[0].charges.payment_charges.max_charge }} -->
                        <tbody>
                            <tr v-for="item in filteredData" :key="item.id" class="month-item">
                                <td>
                                    <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                </td>
                                <td>
                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.package_name }}</h6>
                                </td>

                                <td>
                                    <p class="text-body-1">{{ item.package_type }}</p>
                                </td>
                                <td>
                                    <p class="text-body-1">${{ item.charges.payment_charges.max_charge }}</p>
                                </td>
                                <td>
                                    <p class="text-body-1">${{ item.charges.payment_charges.min_charge }}</p>
                                </td>
                                <td>
                                    <p class="text-body-1">{{ item.charges.payment_charges.percentage_charge }}%</p>
                                </td>
                                <td>
                                    <p class="text-body-1">${{ item.charges.payment_charges.fixed_charge }}</p>
                                </td>

                                <td>
                                    <div style="display: flex; gap: 8px; align-items: center">
                                        <v-btn
                                            icon
                                            @click="updatePackage(item)"
                                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                                        >
                                            <v-icon color="primary">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn
                                            v-if="item.is_default == 0"
                                            flat
                                            color="secondary"
                                            @click="defaultPackage(item)"
                                            style="display: flex; align-items: center; justify-content: center"
                                        >
                                            Set as Default
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-table>
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
    <v-dialog v-model="updatePaymentPackage" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Update Payment Charge Package</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">New Package Name</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="selectedPackage.package_name"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Max Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="selectedPackage.charges.payment_charges.max_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Min Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="selectedPackage.charges.payment_charges.min_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12" v-if="selectedPackage.charges.payment_charges.charge_type === 'percentage'">
                            <v-label class="mb-2 font-weight-medium">Percentage Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="selectedPackage.charges.payment_charges.percentage_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" v-if="selectedPackage.charges.payment_charges.charge_type === 'fixed'">
                            <v-label class="mb-2 font-weight-medium">Fixed Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="selectedPackage.charges.payment_charges.fixed_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeUpdateDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitUpdate" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
    <v-dialog v-model="addNewPaymentPackage" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add Payment Charge Package</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">New Package Name</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newPackage.package_name"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Package Type</v-label>
                            <v-select
                                variant="outlined"
                                color="primary"
                                :items="packageTypes"
                                v-model="newPackage.package_type"
                                :rules="[requiredRule]"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Max Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newPackage.max_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Min Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newPackage.min_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Charge Type</v-label>
                            <v-radio-group hide-details v-model="newPackage.charge_type" inline class="d-flex gap-3 justify-left">
                                <v-radio label="Fixed Charge" color="primary" value="fixed"></v-radio>
                                <v-radio label="Percentage Charge" color="primary" value="percentage"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" md="12" v-if="newPackage.charge_type === 'percentage'">
                            <v-label class="mb-2 font-weight-medium">Percentage Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newPackage.percentage_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" v-if="newPackage.charge_type === 'fixed'">
                            <v-label class="mb-2 font-weight-medium">Fixed Charge</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newPackage.fixed_charge"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeAddDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitAdd" variant="tonal" flat> Add </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { TransferLimitScheme, User } from '@/models/userModel'; // type-only import

import type { PaymentChargePackage } from '@/models/systemModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const page = ref({ title: 'Payment Charge Package' });
const breadcrumbs = ref([
    {
        text: 'Settings',
        disabled: true,
        href: '#'
    }
]);

const requiredRule = (v: any) => !!v || 'This field is required';
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const addNewPaymentPackage = ref(false);
const updatePaymentPackage = ref(false);

const showAlert1 = ref(false);
const showAlert2 = ref(false);
const showAlert3 = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Reactive object to hold form data
const newPackage = ref({
    package_name: '',
    charge_type: '',
    max_charge: 0,
    min_charge: 0,
    percentage_charge: 0,
    fixed_charge: 0,
    package_type: ''
});

const select = ref('All');
const packageType = ref(['All', 'MERCHANT_PAYMENT', 'P2P_PAYMENT', 'BILL_PAYMENT']);

const packageTypes = ref(['MERCHANT_PAYMENT', 'P2P_PAYMENT', 'BILL_PAYMENT']);

const paymentChargePackage = ref<PaymentChargePackage[]>([]); // Store schemes from the API with the correct type
//const selectedScheme = ref<TransferLimitScheme | null>(null); // Store selected scheme for editing
const selectedPackage = ref<any>({
    id: 0,
    package_name: '',
    is_default: 0,
    charges: {
        payment_charges: {
            max_charge: 0,
            min_charge: 0,
            charge_type: '',
            fixed_charge: 0,
            percentage_charge: 0
        }
    },

    created_at: '',
    updated_at: ''
});

// Fetch users when component is mounted
onMounted(async () => {
    getPaymentCharge();
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

const displayAlert3 = () => {
    showAlert3.value = true;
    setTimeout(() => {
        showAlert3.value = false;
    }, 5000); // Adjust the time in milliseconds as needed
};

/* Filtered data */
const filteredData = computed(() => {
    let data = paymentChargePackage.value;

    // Filter by gender if not "All"
    if (select.value !== 'All') {
        data = data.filter((item) => item.package_type === select.value);
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = paymentChargePackage.value;

    // Apply the same filters used for pagination to calculate total items
    if (select.value !== 'All') {
        data = data.filter((item) => item.package_type === select.value);
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

const getPaymentCharge = async () => {
    try {
        if (token) {
            const fetchedPaymentChargePackage = await apiService.getPaymentChargePackage(token);

            paymentChargePackage.value = fetchedPaymentChargePackage;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const addnewPackage = async () => {
    addNewPaymentPackage.value = true;
};

// Close the Send Func dialog
const closeAddDialog = () => {
    addNewPaymentPackage.value = false;

    (newPackage.value.package_name = ''),
        (newPackage.value.charge_type = ''),
        (newPackage.value.package_type = ''),
        (newPackage.value.max_charge = 0),
        (newPackage.value.min_charge = 0),
        (newPackage.value.fixed_charge = 0),
        (newPackage.value.percentage_charge = 0);
};

// Close the Send Func dialog
const closeUpdateDialog = () => {
    updatePaymentPackage.value = false;

    (selectedPackage.value.package_name = ''),
        (selectedPackage.value.charges.payment_charges.charge_type = ''),
        (selectedPackage.value.charges.payment_charges.max_charge = 0),
        (selectedPackage.value.charges.payment_charges.min_charge = 0),
        (selectedPackage.value.charges.payment_charges.fixed_charge = 0),
        (selectedPackage.value.charges.payment_charges.percentage_charge = 0);
};

const updatePackage = async (item: any) => {
    updatePaymentPackage.value = true;
    selectedPackage.value = item;
};
// Method to handle form submission
const submitAdd = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (newPackage) {
            // Send formData in the API request
            const response = await apiService.addNewPaymentChargePackage(token, newPackage.value);

            if (!response) {
                throw new Error('Error adding new package');
            }
            displayAlert1();
            getPaymentCharge();

            closeAddDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding new package:', error);
        // Handle error (e.g., show an error message)
    }
};
const submitUpdate = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (selectedPackage) {
            // Send formData in the API request
            const response = await apiService.updatePaymentChargePackageInfo(token, selectedPackage.value);

            if (!response) {
                throw new Error('Error updating package');
            }
            displayAlert2();
            getPaymentCharge();

            closeUpdateDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error updating package:', error);
        // Handle error (e.g., show an error message)
    }
};

const defaultPackage = async (item: any) => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (item) {
            // Send formData in the API request
            const response = await apiService.setDefaultPaymentChargePackage(token, item);

            if (!response) {
                throw new Error('Error setting package as default');
            }
            displayAlert3();
            getPaymentCharge();

            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error setting package as default:', error);
        // Handle error (e.g., show an error message)
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
