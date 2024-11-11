<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10">
        <v-card-item class="pb-4">
            <div class="d-flex gap-3 align-center justify-space-between" style="padding-top: 16px">
                <!-- Ticket Status select -->
                <div style="flex: 2">
                    <v-select
                        v-model="select"
                        :items="type"
                        label="Ticket Status"
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
                                        <th class="text-body-1 textPrimary">Ticket ID</th>
                                        <th class="text-body-1 textPrimary">Created At</th>
                                        <th class="text-body-1 textPrimary">Transaction Type</th>
                                        <th class="text-body-1 textPrimary">Transaction ID</th>
                                        <th class="text-body-1 textPrimary">Description</th>
                                        <th class="text-body-1 textPrimary">Admin Resolution Description</th>
                                        <th class="text-body-1 textPrimary">Status</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in filteredData" :key="item.id" class="month-item">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.id }}</h6>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.created_at }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.complaint_type!.transaction_type }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.transaction_id }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.user_complaint_description }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.admin_resolution_description }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.complaint_status }}</p>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 8px; align-items: center">
                                                <v-btn
                                                    color="primary"
                                                    flat
                                                    @click="openEditDialog(item)"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    Resolve
                                                </v-btn>
                                                <v-btn
                                                    icon
                                                    @click="openChatDialog(item)"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    <v-icon color="secondary">mdi-chat</v-icon>
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
                    <span class="text-h5">Resolve Ticket</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea
                                label="Enter Resolution Description"
                                v-model="formEditData.resolution_description"
                                required
                                type="text"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeEditDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn
                        color="primary"
                        :disabled="formEditData.resolution_description === ''"
                        @click="submitUpdateForm"
                        variant="tonal"
                        flat
                    >
                        Resolve
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>

    <v-dialog v-model="chatTicketDialog" persistent class="dialog-mw chat-dialog">
        <v-card class="dialog-fixed-height">
            <v-container>
                <v-card-title class="pa-5">
                    <div class="d-flex gap-2 align-center"></div>
                    <div class="d-flex align-center gap-3 pa-4">
                        <!---Topbar Row-->
                        <div class="d-flex gap-2 align-center">
                            <!---User Avatar-->
                            <v-avatar>
                                <img :src="user.receivedFromImg" alt="pro" width="40" />
                            </v-avatar>

                            <!---Name & Last seen-->
                            <div>
                                <h5 class="text-h5 mb-n1">{{ user.receivedFrom }}</h5>
                                <small class="textPrimary"> {{ user.receivedFromUsername }} </small>
                            </div>
                        </div>
                        <!---Topbar Icons-->
                        <div class="ml-auto d-flex">
                            <v-btn icon class="text-medium-emphasis" @click="closeChatDialog">
                                <v-icon color="error">mdi-close</v-icon>
                            </v-btn>
                        </div>
                        <!---Topbar Icons-->
                    </div>
                </v-card-title>
                <v-divider />
                <v-card-text>
                    <perfect-scrollbar class="rightpartHeight">
                        <div class="d-flex">
                            <div class="w-100">
                                <div v-for="(msg, index) in chat" :key="index">
                                    <!-- Sent from Admin -->
                                    <div v-if="msg.message_from_user_id === 1" class="justify-end d-flex text-end mb-1">
                                        <div>
                                            <small class="font-weight-semibold text-12 text-muted d-block mb-1">
                                                <!-- {{user.sentFrom}}, -->
                                                {{
                                                    formatDistanceToNowStrict(new Date(msg.created_at), {
                                                        addSuffix: false
                                                    })
                                                }}
                                                ago
                                            </small>
                                            <v-sheet class="bg-grey100 rounded-md px-3 py-2 mb-1">
                                                <p class="text-body-1">{{ msg.message }}</p>
                                            </v-sheet>
                                        </div>
                                    </div>

                                    <!-- Sent from User -->
                                    <div v-if="msg.message_from_user_id !== 1" class="d-flex align-items-start gap-3 mb-1">
                                        <div>
                                            <small class="font-weight-semibold text-12 text-muted d-block mb-1">
                                                <!-- {{user.receivedFrom}}, -->
                                                {{ formatDistanceToNowStrict(new Date(msg.created_at), { addSuffix: false }) }} ago
                                            </small>
                                            <v-sheet class="bg-primary rounded-md px-3 py-2 mb-1">
                                                <p class="text-body-1">{{ msg.message }}</p>
                                            </v-sheet>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </perfect-scrollbar>
                </v-card-text>

                <v-card-actions>
                    <!-- Chat input field -->
                    <v-row>
                        <v-col cols="10" sm="10" md="10">
                            <v-text-field label="Enter message" v-model="formChatData.message" required type="text"></v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                            <v-btn icon :disabled="formChatData.message === ''" @click="submitChatForm">
                                <v-icon color="primary">mdi-send</v-icon>
                            </v-btn></v-col
                        >
                    </v-row>
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
import type { Complaints, Chat } from '@/models/ticketModel';
import { formatDistanceToNowStrict } from 'date-fns';
import type { User } from '@/models/userModel';

const page = ref({ title: 'All Tickets' });
const breadcrumbs = ref([{ text: 'Ticket', disabled: true, href: '#' }]);

const select = ref('All');
const type = ref(['Pending', 'Resolved']);
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30);
const itemsPerPageOptions = ref([10, 30, 50, 100]);
const ticketList = ref<Complaints[]>([]);
const chat = ref<Chat[]>([]);

const updateTicketDialog = ref(false);
const chatTicketDialog = ref(false);

const authStore = useAuthStore();
const token = authStore.token;

const formEditData = ref({ resolution_description: '', id: 0 });
const formChatData = ref({ message: '', id: 0 });
const user = ref({ sentFrom: '', receivedFrom: '', receivedFromImg: '', receivedFromUsername: '' });

onMounted(async () => {
    getticketList();
});

const getticketList = async () => {
    try {
        if (token) {
            const fetchedTickets = await apiService.getAllTickets(token);
            ticketList.value = fetchedTickets.data;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching ticketList:', error);
    }
};

const getChatMessage = async (id: number) => {
    try {
        if (token && id) {
            const fetchedChats = await apiService.getChat(token, id);

            chat.value = fetchedChats.data;
            chat.value.reverse();
        }
    } catch (error) {
        console.error('Error fetching chat:', error);
    }
};

const getChatUser = async (userId: number) => {
    try {
        if (token && userId) {
            const updatedUserDataUser = await apiService.searchUsersByID(token, userId);

            user.value.receivedFromUsername = updatedUserDataUser[0].username;
            user.value.receivedFrom = updatedUserDataUser[0].full_name; // Update the user data in the store
            user.value.receivedFromImg = updatedUserDataUser[0].selfie_img_url; // Update the user data in the store
        }
    } catch (error) {
        console.error('Error fetching chat:', error);
    }
};

const openEditDialog = (item: Complaints) => {
    updateTicketDialog.value = true;
    formEditData.value.id = item.id;
};

const openChatDialog = async (item: Complaints) => {
    chatTicketDialog.value = true;
    formChatData.value.id = item.id;

    await getChatMessage(item.id);
    await getChatUser(item.user_id);
};

const submitUpdateForm = async () => {
    try {
        if (token && formEditData.value.id) {
            await await apiService.resolveTicket(token, formEditData.value);
            closeEditDialog();
            getticketList();
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
    }
};
``;
const submitChatForm = async () => {
    try {
        if (token && formChatData.value.id) {
            await apiService.sendChat(token, formChatData.value);
            formChatData.value.message = '';
            await getChatMessage(formChatData.value.id);
        }
    } catch (error) {
        console.error('Error sending chat message:', error);
    }
};

const closeEditDialog = () => {
    updateTicketDialog.value = false;
    formEditData.value = { resolution_description: '', id: 0 };
};

const closeChatDialog = () => {
    chatTicketDialog.value = false;
    formChatData.value = { message: '', id: 0 };
};

const filteredData = computed(() => {
    if (!searchText.value) return ticketList.value;
    return ticketList.value.filter((item) => item.id.toString().includes(searchText.value));
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const clearSearchText = () => {
    searchText.value = '';
};
</script>

<style scoped>
.dialog-mw {
    max-width: 600px;
}

.rightpartHeight {
    height: 50vh;
}

.dialog-fixed-height {
    height: 90vh; /* Or any fixed height */
    overflow: hidden;
}
</style>
