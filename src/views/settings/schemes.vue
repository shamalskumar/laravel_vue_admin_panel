<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert1">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully added new scheme.</div>
            </v-alert>
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert2">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully deleted scheme.</div>
            </v-alert>
            <v-row justify="end">
                <v-col cols="12" md="2">
                    <v-btn
                        text
                        @click="addNewScheme()"
                        color="primary"
                        class="pa-4"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Add New Scheme
                    </v-btn>
                </v-col>
            </v-row>
            <div class="mt-4">
                <v-table class="revenue-table light-border">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-body-1 textPrimary">Name</th>
                                <th class="text-body-1 textPrimary">Date Created</th>
                                <th class="text-body-1 textPrimary">Eligible Limit Per Month</th>
                                <th class="text-body-1 textPrimary">Eligible Limit Per Day</th>
                                <th class="text-body-1 textPrimary">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in transferLimitScheme" :key="item.id" class="month-item">
                                <td>
                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.name }}</h6>
                                </td>
                                <td>
                                    <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                </td>
                                <td>
                                    <p class="text-body-1">${{ item.eligible_limit_per_month }}</p>
                                </td>
                                <td>
                                    <p class="text-body-1">${{ item.eligible_limit_per_day }}</p>
                                </td>

                                <td>
                                    <div style="display: flex; gap: 8px; align-items: center">
                                        <v-btn
                                            icon
                                            @click="deleteScheme(item.id)"
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
    <v-dialog v-model="addNewSchemeDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add Transfer Limit Scheme</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">New Scheme Name</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newScheme.name"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Eligible Limit Per Day</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newScheme.eligible_limit_per_day"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Eligible Limit Per Month</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newScheme.eligible_limit_per_month"
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
    <v-dialog v-model="deleteSchemeDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Delete Transfer Limit Scheme</span>
                </v-card-title>
                <v-card-text>
                    <v-label>Are you sure you want to delete this Transfer Limit Scheme? This action cannot be undone.</v-label>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeDeleteDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn color="primary" @click="submitDelete" variant="tonal" flat> Delete </v-btn>
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
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const page = ref({ title: 'Transfer Limit Scheme' });
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
const users = ref<User[]>([]); // Store users from the API with the correct type
const addNewSchemeDialog = ref(false);
const deleteSchemeDialog = ref(false);
const showAlert1 = ref(false);
const showAlert2 = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

const transferLimitScheme = ref<TransferLimitScheme[]>([]); // Store schemes from the API with the correct type

const deleteSchemeID = ref(0);

// Reactive object to hold form data
const newScheme = ref({
    name: '',
    eligible_limit_per_month: '',
    eligible_limit_per_day: ''
});

// Fetch users when component is mounted
onMounted(async () => {
    getLimitSchemes();
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

const getLimitSchemes = async () => {
    try {
        if (token) {
            const fetchedLimitScheme = await apiService.getTransferLimitScheme(token);
            transferLimitScheme.value = fetchedLimitScheme;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const addNewScheme = async () => {
    addNewSchemeDialog.value = true;
};

const totalItems = computed(() => {
    let data = transferLimitScheme.value;

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

// Open the Send Func dialog
const deleteScheme = (id: number) => {
    deleteSchemeID.value = id;
    deleteSchemeDialog.value = true;
};

const closeDeleteDialog = () => {
    deleteSchemeDialog.value = false;
    deleteSchemeID.value = 0;
};
// Close the Send Func dialog
const closeAddDialog = () => {
    addNewSchemeDialog.value = false;

    (newScheme.value.name = ''), (newScheme.value.eligible_limit_per_day = ''), (newScheme.value.eligible_limit_per_month = '');
};
// Method to handle form submission
const submitDelete = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (deleteSchemeID) {
            // Send formData in the API request
            const response = await apiService.deleteScheme(token, deleteSchemeID.value);

            if (!response) {
                throw new Error('Error deleting scheme');
            }
            displayAlert2();
            getLimitSchemes();
            closeDeleteDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error deleting scheme:', error);
        // Handle error (e.g., show an error message)
    }
};

// Method to handle form submission
const submitAdd = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (newScheme) {
            // Send formData in the API request
            const response = await apiService.addLimitScheme(token, newScheme.value);

            if (!response) {
                throw new Error('Error adding new scheme');
            }
            displayAlert1();
            getLimitSchemes();
            closeAddDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding new scheme:', error);
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
