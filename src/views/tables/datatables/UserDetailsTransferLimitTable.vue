<script lang="ts" setup>
import { computed, nextTick, ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { apiService } from '@/api/apiService';
import type { TransferLimitScheme, User } from '@/models/userModel'; // type-only import
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore';
import { basicTableData2, tableActionData } from '@/_mockApis/components/table/basicTables';

// Get token from the Pinia auth store
const authStore = useAuthStore();
const userStore = useUserStore();
const users = ref<User[]>([]); // Store users from the API with the correct type
const token = authStore.token;
const transferLimitScheme = ref<TransferLimitScheme[]>([]); // Store schemes from the API with the correct type
//const selectedScheme = ref<TransferLimitScheme | null>(null); // Store selected scheme for editing
const selectedScheme = ref<TransferLimitScheme>({
    id: 0,
    name: '',
    eligible_limit_per_month: '',
    eligible_limit_per_day: '',
    created_at: ''
});
onMounted(async () => {
    try {
        if (token) {
            const fetchedLimitScheme = await apiService.getTransferLimitScheme(token);
            transferLimitScheme.value = fetchedLimitScheme;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching transfer limit schemes:', error);
    }
});

const dialog = ref(false);
const dialogDelete = ref(false);
const headers = ref([
    { title: 'Name', align: 'start', key: 'name' },
    { title: 'Eligible Limit Per Month', key: 'eligible_limit_per_month' },
    { title: 'Eligible Limit Per Day', key: 'eligible_limit_per_day' },
    { title: 'Actions', key: 'actions' }
]);

const editedIndex = ref(-1);
const editedItem = ref<TransferLimitScheme>({
    id: 0,
    name: '',
    eligible_limit_per_month: '',
    eligible_limit_per_day: '',
    created_at: ''
});
const defaultItem = ref<TransferLimitScheme>({
    id: 0,
    name: '',
    eligible_limit_per_month: '',
    eligible_limit_per_day: '',
    created_at: ''
});

// Filter the transferLimitScheme based on the userData's transfer_limit_scheme_id
const filteredTransferLimitScheme = computed(() => {
    return transferLimitScheme.value.filter((scheme) => scheme.id === userStore.userData?.transfer_limit_scheme_id);
});

function editItem(item: TransferLimitScheme) {
    selectedScheme.value = { ...item }; // Clone item for editing

    dialog.value = true;
}

function close() {
    dialog.value = false;
    nextTick(() => {
        editedItem.value = { ...defaultItem.value };
        editedIndex.value = -1;
    });
}

function closeDelete() {
    dialogDelete.value = false;
    nextTick(() => {
        editedItem.value = { ...defaultItem.value };
        editedIndex.value = -1;
    });
}

async function save(item: number) {
    if (token && userStore.userData?.id) {
        try {
            // Update the transfer limit scheme (assuming you have a method for this)
            await apiService.updateTransferLimitScheme(item, userStore.userData.id, token);
            // Fetch the updated schemes again if necessary

            // If successful, update the user data in the store
            const updatedUserData = await apiService.searchUsersByID(token, userStore.userData.id);

            userStore.setUserData(updatedUserData[0]); // Assuming updateUserData exists in userStore
        } catch (error) {
            console.error('Error saving transfer limit scheme:', error);
        }
    } else {
        console.error('No token found');
    }
    close();
}

watch(dialog, (val) => {
    val || close();
});
watch(dialogDelete, (val) => {
    val || closeDelete();
});
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-data-table :headers="headers" :items="filteredTransferLimitScheme">
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="900px">
                        <v-card>
                            <v-card-title class="pa-4 bg-primary">
                                <span class="text-h5">Edit Transfer Limit Scheme</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container class="px-0">
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-table class="month-table">
                                                <thead>
                                                    <tr>
                                                        <th class="text-h6 ps-6">Scheme</th>
                                                        <th class="text-h6">Eligible Limit Per Month</th>
                                                        <th class="text-h6">Eligible Limit Per Day</th>

                                                        <th class="text-h6"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in transferLimitScheme" :key="item.name" class="month-item">
                                                        <td class="ps-6">
                                                            <div class="d-flex gap-3 align-center">
                                                                <h6 class="text-h6">{{ item.name }}</h6>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="text-body-1 textPrimary">{{ item.eligible_limit_per_month }}</div>
                                                        </td>
                                                        <td>
                                                            <div class="text-body-1 textPrimary">{{ item.eligible_limit_per_day }}</div>
                                                        </td>

                                                        <td>
                                                            <v-btn color="primary" variant="flat" dark @click="save(item.id)">
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
