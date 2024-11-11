<script setup lang="ts">
import { ref, computed } from 'vue';
import { RevenueProjectsData } from '@/_mockApis/components/dashboard/dashboard1';

// v-select options
const select = ref('All');
const gender = ref(['All', 'Male', 'Female']);
const inputCityValue = ref('');
const searchText = ref('');

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = 10;

/* Filtered data */
const filteredData = computed(() => {
    let data = RevenueProjectsData;

    // Filter by gender if not "All"
    if (select.value !== 'All') {
        data = data.filter((item) => item.gender === select.value);
    }

    // Filter by city if inputCityValue is not empty
    if (inputCityValue.value.trim()) {
        data = data.filter((item) => item.city.toLowerCase().includes(inputCityValue.value.toLowerCase()));
    }

    // Filter by searchText if not empty
    if (searchText.value.trim()) {
        data = data.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    }

    // Paginate data
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
});

const totalItems = computed(() => {
    let data = RevenueProjectsData;

    // Apply the same filters used for pagination to calculate total items

    if (searchText.value.trim()) {
        data = data.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    }

    return data.length;
});

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage);
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

// Example function when the "View" button is clicked
const viewItem = (item) => {
    console.log('Viewing item:', item);
};
</script>

<template>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Search input with clear icon -->
                <div style="flex: 1">
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
            </div>

            <div class="mt-4">
                <v-window>
                    <v-window-item>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Name</th>
                                        <th class="text-body-1 textPrimary">Email</th>
                                        <th class="text-body-1 textPrimary">Username</th>
                                        <th class="text-body-1 textPrimary">Mobile No</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in filteredData" :key="item.userID" class="month-item">
                                        <td>
                                            <div class="d-flex align-center">
                                                <v-avatar size="48" rounded="md">
                                                    <img :src="item.img" :alt="item.img" width="48" />
                                                </v-avatar>
                                                <div class="mx-3">
                                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">
                                                        {{ item.name }}
                                                    </h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.email }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.username }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.mobileNo }}</p>
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
            <div class="d-flex align-center justify-space-between mt-4">
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
