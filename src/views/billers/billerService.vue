<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-card elevation="10">
        <v-card-actions class="justify-end">
            <v-btn color="primary" variant="flat" @click="openaddService">Add Service</v-btn>
        </v-card-actions>
        <v-card-item>
            <v-table class="revenue-table light-border">
                <thead>
                    <tr>
                        <th class="text-body-1 textPrimary">Category Name</th>
                        <th class="text-body-1 textPrimary">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredData" :key="item.id" class="month-item">
                        <td>
                            <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.category_name }}</h6>
                        </td>
                        <td>
                            <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                        </td>
                    </tr>
                </tbody>
            </v-table>

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
    <v-dialog v-model="addService" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add New Service</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                label="Enter Service Category Name*"
                                v-model="formServiceCategory.category_name"
                                required
                                type="text"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeaddService" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitAddFundForm" variant="tonal" flat> Add </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { BillerCategory, User } from '@/models/userModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const router = useRouter();
const page = ref({ title: 'All Services' });
const breadcrumbs = ref([
    {
        text: 'Billers',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination

const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const billerCategory = ref<BillerCategory[]>([]); // Reactive merchant category array
const addService = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Reactive object to hold form data
const formServiceCategory = ref({
    category_name: ''
});

// Fetch biller Category when component is mounted
onMounted(async () => {
    getService();
});

const getService = async () => {
    try {
        if (token) {
            const fetchedBillerCategory = await apiService.getBillerCategoryData(token);
            billerCategory.value = fetchedBillerCategory; // Store fetched billerCategory data
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching biller Category:', error);
    }
};

/* Filtered data */
const filteredData = computed(() => {
    let data = billerCategory.value;

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = billerCategory.value;

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
const openaddService = (userID: number) => {
    addService.value = true;
};
// Close the Send Func dialog
const closeaddService = () => {
    addService.value = false;
    formServiceCategory.value.category_name = '';
};
// Method to handle form submission
const submitAddFundForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formServiceCategory) {
            // Send formData in the API request
            const response = await apiService.billerCategory(token, formServiceCategory.value);

            if (!response) {
                throw new Error('Error adding new service');
            }
            getService();
            closeaddService();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding new service:', error);
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
    margin-top: 0px;
    width: 100%;
}

.month-item {
    cursor: pointer;
}

.textPrimary {
    color: #1976d2;
}
</style>
