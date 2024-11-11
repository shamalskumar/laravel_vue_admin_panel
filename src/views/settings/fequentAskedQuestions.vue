<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert1">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully created FAQ Category.</div>
            </v-alert>
            <v-alert color="success" variant="tonal" class="mb-4" v-if="showAlert2">
                <template v-slot:prepend>
                    <v-icon class="text-24">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <div>Successfully created FAQ.</div>
            </v-alert>

            <v-card class="revenue-products" variant="outlined">
                <v-row justify="end">
                    <v-col cols="12" md="3">
                        <v-btn
                            text
                            color="primary"
                            class="pa-4 mt-6"
                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                            @click="openDialog()"
                        >
                            Add New Category
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-text>
                    <v-label class="text-h3">Category List</v-label>
                    <v-table class="revenue-table light-border">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-body-1 textPrimary">Category Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in category" class="month-item">
                                    <td>
                                        <v-btn
                                            @click="getQuestions(item)"
                                            color="secondary"
                                            class="pa-4"
                                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >{{ item }}</v-btn
                                        >
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-card-text>
            </v-card>

            <v-card class="revenue-products" variant="outlined" v-if="showFAQ">
                <v-row justify="end">
                    <v-col cols="12" md="3">
                        <v-btn
                            text
                            color="primary"
                            class="pa-4 mt-6"
                            style="display: flex; align-items: center; justify-content: center; padding: 0"
                            @click="openFAQDialog()"
                        >
                            Add FAQ
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-text>
                    <v-label class="text-h3">Questions</v-label>
                    <br /><br />
                    <v-table class="revenue-table light-border">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-body-1 textPrimary">Question</th>
                                    <th class="text-body-1 textPrimary">Answer</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="item in filteredQuestions" class="month-item">
                                    <td>
                                        <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.question }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.answer }}</h6>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-card-text>
            </v-card>
        </v-card-item>
    </v-card>
    <v-dialog v-model="openAddCategoryDialog" max-width="900px">
        <v-card>
            <v-card-title class="pa-4">
                <span class="text-h5">Add FAQ Category</span>
            </v-card-title>

            <v-card-text>
                <v-container class="px-0">
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Please enter name*" v-model="formCategoryData.name" required></v-text-field>
                        </v-col>
                    </v-row>
                    <small>*indicates required field</small>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" dark @click="closeDialog"> Cancel </v-btn>

                <v-btn :disabled="formCategoryData.name === ''" color="primary" variant="flat" dark @click="submitCategory"> Add </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="openAddFaqDialog" max-width="900px">
        <v-card>
            <v-card-title class="pa-4">
                <span class="text-h5">Add New FAQ</span>
            </v-card-title>

            <v-card-text>
                <v-container class="px-0">
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Please enter question*" v-model="formFAQData.question" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Please enter answer*" v-model="formFAQData.answer" required></v-text-field>
                        </v-col>
                    </v-row>
                    <small>*indicates required field</small>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="flat" dark @click="closeFAQDialog"> Cancel </v-btn>

                <v-btn :disabled="!formFAQData.question || !formFAQData.answer" color="primary" variant="flat" dark @click="submitFAQ">
                    Add
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';

import type {
    AgentWithdrawalCharges,
    BankWithdrawalCharges,
    Categories,
    FAQ,
    Question,
    SystemSettings,
    WithDrawalCharge,
    WithdrawalRanges
} from '@/models/systemModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import { sys } from 'typescript';

const page = ref({ title: 'Frequently Asked Questions' });
const breadcrumbs = ref([
    {
        text: 'Settings',
        disabled: true,
        href: '#'
    }
]);

const requiredRule = (v: any) => !!v || 'This field is required';
const openAddCategoryDialog = ref(false);
const openAddFaqDialog = ref(false);

const showAlert1 = ref(false);
const showAlert2 = ref(false);
const showFAQ = ref(false);
const selectedFAQ = ref(0);

const formCategoryData = ref({
    name: ''
});

const formFAQData = ref({
    question: '',
    answer: '',
    category_id: 0
});

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

const systemSettings = ref<SystemSettings | null>(null);

const withdrawalRanges = ref<WithdrawalRanges[]>([]);
const category = ref<Categories[]>([]);
const faq = ref<Question[]>([]);

const agentWithdrawalCharge = ref<AgentWithdrawalCharges | null>(null);
const bankWithdrawalCharge = ref<BankWithdrawalCharges | null>(null);

const filteredData = ref<{ question: string; answer: string }[]>([]);

const filteredQuestions = ref<any>({
    answer: '',
    question: ''
});

// Fetch users when component is mounted
onMounted(async () => {
    getFAQ();
});

const openFAQDialog = () => {
    openAddFaqDialog.value = true;
};

const closeFAQDialog = () => {
    openAddFaqDialog.value = false;

    formFAQData.value.question = '';
    formFAQData.value.answer = '';
    formFAQData.value.category_id = 0;
};

const openDialog = () => {
    openAddCategoryDialog.value = true;
};

const closeDialog = () => {
    openAddCategoryDialog.value = false;

    formCategoryData.value.name = '';
};

const getQuestions = (data: any) => {
    const filteredData = faq.value.filter((item: { name: string }) => item.name === data);
    selectedFAQ.value = filteredData[0].id;
    filteredQuestions.value = filteredData[0].faqs;
    showFAQ.value = true;
};

const submitCategory = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formCategoryData) {
            // Send formData in the API request
            const response = await apiService.addCategory(token, formCategoryData.value);

            if (!response) {
                throw new Error('Error added new category');
            }
            displayAlert1();
            getFAQ();
            closeFAQDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error added new category:', error);
        // Handle error (e.g., show an error message)
    }
};

const submitFAQ = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formFAQData) {
            formFAQData.value.category_id = selectedFAQ.value;
            // Send formData in the API request
            const response = await apiService.addFAQ(token, formFAQData.value);

            if (!response) {
                throw new Error('Error added new FAQ');
            }
            displayAlert2();
            getFAQ();
            closeDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error added new FAQ:', error);
        // Handle error (e.g., show an error message)
    }
};

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

const getFAQ = async () => {
    try {
        if (token) {
            const fetchedFAQ = await apiService.getFAQs(token);

            category.value = fetchedFAQ[0].categories;
            faq.value = fetchedFAQ[0].questions;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
</script>

<style scoped>
.revenue-table {
    margin-top: 20px;
    width: 100%;
    table-layout: fixed; /* Ensures fixed width columns for consistent wrapping */
}

.revenue-table th,
.revenue-table td {
    white-space: normal; /* Allows text to wrap within the cell */
    word-wrap: break-word; /* Ensures long words break to fit within the cell */
    overflow-wrap: break-word; /* Handles overflow for very long words or URLs */
}

/* Override text-no-wrap if it's preventing wrapping */
.revenue-table .text-no-wrap {
    white-space: normal !important; /* Force text to wrap */
}

.month-item {
    cursor: pointer;
}

.textPrimary {
    color: #1976d2;
}
</style>
