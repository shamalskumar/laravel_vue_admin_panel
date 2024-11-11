<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <div class="pa-5" style="display: flex; justify-content: flex-end">
            <v-btn @click="addTicketTypeDialog()" text color="primary" style="display: flex; align-items: center; justify-content: center">
                Add Ticket Type
            </v-btn>
        </div>

        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Gender select -->
                <div style="flex: 2">
                    <v-select
                        v-model="select"
                        :items="type"
                        label="Ticket Type"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select>
                </div>

                <!-- Search input with clear icon -->
                <div style="flex: 3">
                    <v-text-field
                        v-model="searchText"
                        label="Search"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                        append-icon="mdi-close-circle"
                        @click:append="clearSearchText"
                    ></v-text-field>
                </div>
                <!-- Items per page select -->
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
                    <v-window-item>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Created At</th>
                                        <th class="text-body-1 textPrimary">Transaction Type</th>
                                        <th class="text-body-1 textPrimary">Transaction Description</th>
                                        <th class="text-body-1 textPrimary">Updated At</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in filteredData" :key="item.id" class="month-item">
                                        <td>
                                            <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.transaction_type }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.type_description }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ formatDate(item.updated_at) }}</p>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 8px; align-items: center">
                                                <v-btn
                                                    icon
                                                    @click="openEditDialog(item)"
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
                    </v-window-item>
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
    <v-dialog v-model="updateTicketDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Update Ticket</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Edit Ticket Type"
                                v-model="formEditData.transaction_type"
                                :items="type"
                                variant="outlined"
                                density="compact"
                                class="text-body-1"
                                hide-details
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Edit Description"
                                v-model="formEditData.type_description"
                                required
                                type="text"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeEditDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitUpdateForm" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>

    <v-dialog v-model="addTicketDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add Ticket</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                label="Select Ticket Type*"
                                v-model="formAddData.transaction_type"
                                :items="addType"
                                variant="outlined"
                                density="compact"
                                class="text-body-1"
                                hide-details
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Add Description*"
                                v-model="formAddData.type_description"
                                required
                                type="text"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeAddDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitAddForm" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import type { TicketType } from '@/models/ticketModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const page = ref({ title: 'All Ticket Type' });
const breadcrumbs = ref([
    {
        text: 'Ticket',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const select = ref('ALL');
const type = ref(['ALL', 'WALLET_TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'BILL_PAYMENT', 'WITHDRAWAL_CHARGE', 'CASHBACK', 'GENERAL_COMPLAINT']);

const addType = ref(['WALLET_TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'BILL_PAYMENT', 'WITHDRAWAL_CHARGE', 'CASHBACK', 'GENERAL_COMPLAINT']);
const inputCityValue = ref('');
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const itemsPerPageOptions = ref([10, 30, 50, 100]); // Options for items per page
const ticketType = ref<TicketType[]>([]);
const updateTicketDialog = ref(false);
const addTicketDialog = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Reactive object to hold form data
const formAddData = ref({
    transaction_type: null,
    type_description: ''
});

const formEditData = ref({
    transaction_type: '',
    type_description: '',
    id: 0
});

// Fetch ticketType when component is mounted
onMounted(async () => {
    getticketType();
});

const getticketType = async () => {
    try {
        if (token) {
            const fetchedTickets = await apiService.getAllComplaintTypes(token);
            ticketType.value = fetchedTickets; // Store fetched ticketType
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching ticketType:', error);
    }
};

/* Filtered data */
const filteredData = computed(() => {
    let data = ticketType.value;

    // Filter by gender if not "All"
    if (select.value !== 'ALL') {
        data = data.filter((item) => item.transaction_type.toLowerCase() === select.value.toLowerCase());
    }

    // Filter by searchText if not empty, considering multiple fields
    if (searchText.value.trim()) {
        const search = searchText.value.toLowerCase();
        data = data.filter((item) => {
            return item.type_description.toLowerCase().includes(search);
        });
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = ticketType.value;

    // Apply the same filters used for pagination to calculate total items
    if (select.value !== 'ALL') {
        data = data.filter((item) => item.transaction_type === select.value);
    }

    if (searchText.value.trim()) {
        data = data.filter((item) => item.type_description.toLowerCase().includes(searchText.value.toLowerCase()));
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

// Clear the input value for both city and search text
const clearCityValue = () => {
    inputCityValue.value = '';
};

const clearSearchText = () => {
    searchText.value = '';
};

// Open the Send Func dialog

const addTicketTypeDialog = () => {
    addTicketDialog.value = true;
};

const openEditDialog = (item: TicketType) => {
    formEditData.value.transaction_type = item.transaction_type;
    formEditData.value.type_description = item.type_description;
    formEditData.value.id = item.id;
    updateTicketDialog.value = true;
};
// Close the Send Func dialog
const closeAddDialog = () => {
    addTicketDialog.value = false;
    (formAddData.value.transaction_type = null), (formAddData.value.type_description = '');
};

const closeEditDialog = () => {
    updateTicketDialog.value = false;
    (formEditData.value.transaction_type = ''), (formEditData.value.type_description = ''), (formEditData.value.id = 0);
};
// Method to handle form submission
const submitUpdateForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formEditData) {
            // Send formData in the API request
            const response = await apiService.updateTicketType(token, formEditData.value);

            if (!response) {
                throw new Error('Error updating ticket');
            }
            getticketType();
            closeEditDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
        // Handle error (e.g., show an error message)
    }
};
const submitAddForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formEditData) {
            // Send formData in the API request
            const response = await apiService.addTicketType(token, formAddData.value);

            if (!response) {
                throw new Error('Error updating ticket');
            }
            getticketType();
            closeAddDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
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
