<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert1">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully sent notification.</div>
            </v-alert>

            <v-row justify="end">
                <v-col cols="12" md="2">
                    <v-btn
                        text
                        @click="sendNotification()"
                        color="primary"
                        class="pa-4"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Send Notification
                    </v-btn>
                </v-col>
            </v-row>

            <div class="mt-4">
                <v-table class="revenue-table light-border">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-body-1 textPrimary">Date</th>

                                <th class="text-body-1 textPrimary">Title</th>

                                <th class="text-body-1 textPrimary">Body</th>
                                <th class="text-body-1 textPrimary">User</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in notifications" :key="item.id" class="month-item">
                                <td>
                                    <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                </td>
                                <td>
                                    <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.title }}</h6>
                                </td>

                                <td>
                                    <p class="text-body-1">{{ item.body }}</p>
                                </td>
                                <td>
                                    <p class="text-body-1"><strong>Username:</strong> {{ item.user.username }}</p>
                                    <p class="text-body-1"><strong>VisionPay ID:</strong> {{ item.user.pacpay_user_id }}</p>
                                    <p class="text-body-1"><strong>UserType:</strong> {{ item.user.user_type }}</p>
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

    <v-dialog v-model="sendNotificationDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Send Notification</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Enter Title</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newNotification.title"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Enter Body</v-label>
                            <v-text-field
                                variant="outlined"
                                color="primary"
                                v-model="newNotification.body"
                                :rules="[requiredRule]"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-label class="mb-2 font-weight-medium">Select User Type</v-label>
                            <v-select
                                variant="outlined"
                                color="primary"
                                :items="userType"
                                v-model="selectedUserType"
                                :rules="[requiredRule]"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="12" v-if="selectedUserType === 'For Specific Users'">
                            <v-label class="mb-2 font-weight-medium">Select User</v-label>

                            <v-autocomplete
                                multiple
                                v-model="newNotification.user_ids"
                                :items="formattedUsers"
                                item-value="id"
                                item-title="displayName"
                                color="primary"
                                variant="outlined"
                                hide-details
                                density="compact"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeSendNotificationDialog" variant="tonal" flat> Cancel </v-btn>
                    <v-btn color="primary" @click="submitNotification" variant="tonal" flat> Send </v-btn>
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

import type { Notifications, PaymentChargePackage } from '@/models/systemModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function

const page = ref({ title: 'Notification List' });
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
const sendNotificationDialog = ref(false);
const updatePaymentPackage = ref(false);

const showAlert1 = ref(false);

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Reactive object to hold form data
const newNotification = ref<{
    user_type_id: number;
    user_ids: number[]; // Define user_ids as an array of numbers
    title: string;
    body: string;
}>({
    user_type_id: 0,
    user_ids: [], // initialize with an empty array
    title: '',
    body: ''
});

const selectedUserType = ref('');

const userType = ref(['All Users', 'All Retail Users', 'All Merchants', 'All Agents', 'For Specific Users']);

const users = ref<User[]>([]); // Store users from the API with the correct type

const notifications = ref<Notifications[]>([]);

const getUsers = async () => {
    try {
        if (token) {
            const fetchedUsers = await apiService.getEveryUsers(token);
            users.value = fetchedUsers; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
watch(selectedUserType, async (selected) => {
    switch (selected) {
        case 'All Users':
            newNotification.value.user_type_id = 0;
            break;

        case 'All Retail Users':
            // Code to handle 'All Retail Users'
            newNotification.value.user_type_id = 2;
            break;

        case 'All Merchants':
            // Code to handle 'All Merchants'
            newNotification.value.user_type_id = 4;
            break;

        case 'All Agents':
            // Code to handle 'All Agents'
            newNotification.value.user_type_id = 3;
            break;

        case 'For Specific Users':
            // Code to handle 'For Specific Users'
            getUsers();
            break;

        default:
            newNotification.value.user_type_id = 0;
        // Code to handle unknown or unexpected categories
    }
});

// Fetch users when component is mounted
onMounted(async () => {
    getNotifications();
});

const displayAlert1 = () => {
    showAlert1.value = true;
    setTimeout(() => {
        showAlert1.value = false;
    }, 5000); // Adjust the time in milliseconds as needed
};

const totalItems = computed(() => {
    let data = notifications.value;

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

const getNotifications = async () => {
    try {
        if (token) {
            const fetchedNotifications = await apiService.getNotifications(token);
            notifications.value = fetchedNotifications.data;
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

// Close the Send Func dialog
const closeSendNotificationDialog = () => {
    sendNotificationDialog.value = false;

    (newNotification.value.user_ids = []),
        (newNotification.value.user_type_id = 0),
        (newNotification.value.body = ''),
        (newNotification.value.title = '');
};

const formattedUsers = computed(() =>
    users.value.map((user) => ({
        ...user,
        displayName: `${user.full_name} (${user.username})`
    }))
);

// Method to handle form submission
const submitNotification = async () => {
    console.log(newNotification);
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const formData = new FormData();
        formData.append('title', newNotification.value.title);
        formData.append('body', newNotification.value.body);

        if (selectedUserType.value === 'For Specific Users') {
            newNotification.value.user_ids.forEach((userId) => {
                formData.append('user_ids[]', userId.toString()); // Ensure toString is used here
            });
        } else {
            formData.append('user_type_id', newNotification.value.user_type_id.toString()); // Convert number to string
        }

        if (formData) {
            // Send formData in the API request
            const response = await apiService.sendAlert(token, formData);

            if (!response) {
                throw new Error('Error sending new notification');
            }
            displayAlert1();
            getNotifications();

            closeSendNotificationDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding new package:', error);
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
