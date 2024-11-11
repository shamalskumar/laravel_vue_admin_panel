<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore'; // Adjust the path as necessary
import { apiService } from '@/api/apiService';

const page = ref({ title: 'CRUD Table' });
const userStore = useUserStore();
const userData = userStore.userData; // Access the user data
// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Headers for the table
const headers = ref([
    { title: 'Wallet', align: 'start', key: 'name' },
    { title: 'Limit', key: 'limit' },
    { title: 'New Limit', key: 'newLimit' },
    { title: 'Actions', key: 'actions' }
]);

// Transfer limit data
const walletInfo = ref([]);
const newLimit = ref(''); // Store the new limit for input

// Initialize table with the current limit
function initialize() {
    walletInfo.value = [
        {
            name: 'Main',
            limit: userData?.wallet.wallet_limit,
            newLimit: '' // Placeholder for the new limit input
        }
    ];
}

// Function to save the new limit
async function save(item) {
    if (token && item) {
        try {
            // Update the transfer limit scheme
            await apiService.updateWalletLimit(item, userStore.userData.id, token);

            // Fetch the updated user data and set it in the store
            const updatedUserData = await apiService.searchUsersByID(token, userStore.userData.id);
            userStore.setUserData(updatedUserData[0]); // Assuming updateUserData exists in userStore

            // Re-initialize the table to refresh the data
            initialize(); // This will refresh the table with the new data

            walletInfo.value = [
                {
                    name: 'Main',
                    limit: item,
                    newLimit: ''
                }
            ];
        } catch (error) {
            console.error('Error saving transfer limit scheme:', error);
        }
    } else {
        console.error('No limit updated');
    }
}

// Initialize on page load
initialize();
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-data-table :headers="headers" :items="walletInfo">
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </template>

                <!-- New Limit Input and Save Button -->
                <template v-slot:item.newLimit="{ item }">
                    <div class="d-flex align-center">
                        <v-text-field v-model="item.newLimit" label="Enter new limit" type="number" dense outlined class="mt-4" />
                    </div>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="d-flex align-center">
                        <Icon
                            icon="lets-icons:check-ring-round"
                            height="30"
                            class="text-primary cursor-pointer"
                            size="small"
                            @click="save(item.newLimit)"
                        />
                    </div>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
