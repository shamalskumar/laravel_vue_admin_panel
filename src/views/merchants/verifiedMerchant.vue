<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Gender select -->
                <div style="flex: 1">
                    <v-select
                        v-model="select"
                        :items="gender"
                        label="Gender"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select>
                </div>
                <!-- City input with clear icon -->
                <div style="flex: 2">
                    <v-text-field
                        v-model="inputCityValue"
                        label="Enter City"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                        append-icon="mdi-close-circle"
                        @click:append="clearCityValue"
                    ></v-text-field>
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
                                        <th class="text-body-1 textPrimary">Name</th>
                                        <th class="text-body-1 textPrimary">Date</th>
                                        <th class="text-body-1 textPrimary">Email</th>
                                        <th class="text-body-1 textPrimary">Username</th>
                                        <th class="text-body-1 textPrimary">Mobile No</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in filteredData" :key="item.id" class="month-item">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.full_name }}</h6>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.created_at }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.email }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.username }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.mobile_no }}</p>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 8px; align-items: center">
                                                <v-btn
                                                    text
                                                    @click="viewItem(item)"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    <v-icon color="primary">mdi-account</v-icon>
                                                </v-btn>
                                                <v-btn
                                                    text
                                                    @click="viewItem(item)"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    <v-icon color="secondary">mdi-cash</v-icon>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/models/userModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'; // Adjust the path as necessary

const router = useRouter();
const page = ref({ title: 'Verified Merchants' });
const breadcrumbs = ref([
    {
        text: 'Merchants',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const select = ref('All');
const gender = ref(['All', 'MALE', 'FEMALE']);
const inputCityValue = ref('');
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const itemsPerPageOptions = ref([10, 30, 50, 100]); // Options for items per page
const users = ref<User[]>([]); // Store users from the API with the correct type

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Fetch users when component is mounted
onMounted(async () => {
    try {
        if (token) {
            const fetchedUsers = await apiService.getAllUsersVerified(token, 4);
            users.value = fetchedUsers; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

/* Filtered data */
const filteredData = computed(() => {
    let data = users.value;

    // Filter by gender if not "All"
    if (select.value !== 'All') {
        data = data.filter((item) => item.gender === select.value);
    }

    // Filter by city if inputCityValue is not empty
    if (inputCityValue.value.trim()) {
        data = data.filter((item) => item.city && item.city.city_name.toLowerCase().includes(inputCityValue.value.toLowerCase()));
    }

    // Filter by searchText if not empty, considering multiple fields
    if (searchText.value.trim()) {
        const search = searchText.value.toLowerCase();
        data = data.filter((item) => {
            return (
                item.full_name.toLowerCase().includes(search) ||
                (item.email && item.email.toLowerCase().includes(search)) ||
                (item.mobile_no && item.mobile_no.toLowerCase().includes(search)) ||
                (item.username && item.username.toLowerCase().includes(search))
            );
        });
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage.value; // Use .value for ref
    const endIndex = startIndex + itemsPerPage.value;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = users.value;

    // Apply the same filters used for pagination to calculate total items
    if (select.value !== 'All') {
        data = data.filter((item) => item.gender === select.value);
    }

    if (inputCityValue.value.trim()) {
        data = data.filter((item) => item.city && item.city.city_name.toLowerCase().includes(inputCityValue.value.toLowerCase()));
    }

    if (searchText.value.trim()) {
        data = data.filter((item) => item.full_name.toLowerCase().includes(searchText.value.toLowerCase()));
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

const viewItem = (item: User) => {
    const userStore = useUserStore();
    userStore.setUserData(item); // Store user data

    // Navigate to the "User Profile" route
    router.push({ name: 'Merchant Profile' });
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
