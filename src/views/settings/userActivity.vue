<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';

import type { User } from '@/models/userModel'; // type-only import
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { UserActivity } from '@/models/systemModel';

// Refs and user data

const authStore = useAuthStore();
const token = authStore.token;
const userActivity = ref<UserActivity[]>([]);
const users = ref<User[]>([]); // Store users from the API with the correct type

const page = ref({ title: 'User Activity' });
const breadcrumbs = ref([
    {
        text: 'Settings',
        disabled: true,
        href: '#'
    }
]);

// Manual padding function
const padStart = (value: string | number, targetLength: number, padString: string = '0'): string => {
    const str = String(value);
    if (str.length >= targetLength) {
        return str;
    }
    return padString.repeat(targetLength - str.length) + str;
};

// Function to format the date as 'YYYY-MM-DD'
const formatDateFilter = (date: Date): string => {
    const year = date.getFullYear();
    const month = padStart(date.getMonth() + 1, 2); // Months are 0-based, so +1
    const day = padStart(date.getDate(), 2);
    return `${year}-${month}-${day}`;
};

// Calculate current date
const currentDate = new Date();
const date90DaysAgo = new Date();
date90DaysAgo.setDate(currentDate.getDate() - 90);

// Initialize formData with the calculated dates
const formData = ref({
    dateFrom: formatDateFilter(date90DaysAgo), // 90 days before the current date
    dateTo: formatDateFilter(currentDate), // Current date
    selectedUser: ''
});

// Function to fetch wallet data
const fetchWalletData = async () => {
    try {
        if (token) {
            const fetchedUserActivityData = await apiService.getUserActivity(
                token,
                Number(formData.value.selectedUser),
                formData.value.dateFrom,
                formData.value.dateTo
            );

            userActivity.value = fetchedUserActivityData;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
};

// Function to fetch user data
const getUsers = async () => {
    try {
        if (token) {
            const fetchedUsers = await apiService.getUsers(token);
            users.value = fetchedUsers; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const formattedUsers = computed(() =>
    users.value.map((user) => ({
        ...user,
        displayName: `${user.full_name} (${user.username})`
    }))
);

// Call fetchWalletData when the component is mounted
onMounted(async () => {
    getUsers();
});

/*Header Data*/
const headers: any = ref([
    { title: 'Date', align: 'start', key: 'created_at', width: '150px' },
    { title: 'Event', align: 'end', key: 'event', width: '100px' },
    { title: 'Remark', align: 'end', key: 'remark', width: '100px' },
    { title: 'Username', align: 'end', key: 'user.username', width: '100px' },
    { title: 'User ID', align: 'end', key: 'user.id', width: '100px' }
]);
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-card elevation="0">
        <v-card-text>
            <v-row>
                <v-col cols="12" md="5">
                    <v-autocomplete
                        v-model="formData.selectedUser"
                        :items="formattedUsers"
                        item-value="id"
                        item-title="displayName"
                        color="primary"
                        label="Select User"
                        variant="outlined"
                        hide-details
                        density="compact"
                    />
                </v-col>
                <v-col cols="12" md="2">
                    <v-text-field
                        label="From Date"
                        color="primary"
                        variant="outlined"
                        type="date"
                        density="compact"
                        v-model="formData.dateFrom"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                    <v-text-field
                        density="compact"
                        label="To Date"
                        color="primary"
                        variant="outlined"
                        type="date"
                        v-model="formData.dateTo"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn
                        text
                        @click="fetchWalletData()"
                        color="primary"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Search
                    </v-btn>
                </v-col>
            </v-row>

            <v-card-text class="rounded-md pa-0 mt-6">
                <v-alert v-if="formData.selectedUser === ''" class="mb-3" type="info">Select User and date filters</v-alert>

                <v-data-table
                    v-if="formData.selectedUser !== ''"
                    items-per-page="10"
                    :headers="headers"
                    :items="userActivity"
                    item-value="name"
                    class="border rounded-md datatabels small-text-table"
                >
                    <!-- Scoped slots to format dollar values -->
                    <template v-slot:item.created_at="{ item }">
                        <span v-if="item.created_at">{{ formatDate(item.created_at) }}</span>
                    </template>
                </v-data-table>
            </v-card-text></v-card-text
        >
    </v-card>
</template>
