<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <v-row justify="end">
                <v-col cols="12" md="3">
                    <v-btn
                        text
                        color="primary"
                        class="pa-4"
                        @click="openAddAdvertDialog"
                        style="display: flex; align-items: center; justify-content: center; padding: 0"
                    >
                        Add New Advertisement
                    </v-btn>
                </v-col>
            </v-row>
            <v-row justify="start">
                <v-col cols="12" md="2">
                    <v-select
                        v-model="itemsPerPage"
                        :items="itemsPerPageOptions"
                        label="Items per Page"
                        variant="outlined"
                        density="compact"
                        class="text-body-1"
                        hide-details
                    ></v-select
                ></v-col>
            </v-row>

            <div class="mt-4">
                <v-window>
                    <v-window-item>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Title</th>
                                        <th class="text-body-1 textPrimary">Date</th>
                                        <th class="text-body-1 textPrimary">Body</th>
                                        <th class="text-body-1 textPrimary">URL</th>
                                        <th class="text-body-1 textPrimary">Type</th>
                                        <th class="text-body-1 textPrimary">Status</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in advert" :key="item.id" class="month-item">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.title }}</h6>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.created_at }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.body }}</p>
                                        </td>
                                        <td v-if="item.advertisement_type !== 'TEXT'">
                                            <img :src="item.advertisement_img_url" width="100" alt="Advert Image" />
                                        </td>

                                        <td v-if="item.advertisement_type === 'TEXT'"></td>

                                        <td>
                                            <p class="text-body-1">{{ item.advertisement_type }}</p>
                                        </td>

                                        <td>
                                            <div style="display: flex; gap: 8px; align-items: center">
                                                <v-btn
                                                    v-if="item.status === 0"
                                                    color="primary"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    Enable
                                                </v-btn>

                                                <v-btn
                                                    v-if="item.status === 1"
                                                    color="secondary"
                                                    @click="openAddAdvertDialog(item.id)"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    Disable
                                                </v-btn>
                                            </div>
                                        </td>
                                        <td>
                                            <v-btn
                                                icon
                                                @click="deleteAd(item.id)"
                                                style="display: flex; align-items: center; justify-content: center; padding: 0"
                                            >
                                                <v-icon color="error">mdi-delete</v-icon>
                                            </v-btn>
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
    <v-dialog v-model="addAdvertDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <form @submit.prevent="submitAdvertForm">
                    <v-card-title class="pa-5">
                        <span class="text-h5">Add Advertisement</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field label="Please enter Title*" v-model="formAddAdvert.title" required></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field label="Please provide Body" v-model="formAddAdvert.body" required type="text"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-select
                                    v-model="formAddAdvert.advertisement_type"
                                    :items="type"
                                    label="Select Advertisement Type*"
                                    variant="outlined"
                                    density="compact"
                                    class="text-body-1"
                                    hide-details
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row v-if="formAddAdvert.advertisement_type === 'IMAGE'">
                            <v-col cols="12" sm="12" md="12">
                                <v-file-input
                                    v-model="appGridImageFile"
                                    accept="image/*"
                                    label="Select Advertisement image*"
                                    hide-details
                                    variant="outlined"
                                    required
                                    @change="handleFileChange"
                                /> </v-col
                        ></v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-select
                                    v-model="formAddAdvert.redirect_to"
                                    :items="redirectTo"
                                    label="Redirect To*"
                                    variant="outlined"
                                    density="compact"
                                    class="text-body-1"
                                    hide-details
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row v-if="formAddAdvert.redirect_to === 'WEB'">
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    label="Redirect Web URL*"
                                    v-model="formAddAdvert.redirect_web_url"
                                    required
                                    type="text"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="formAddAdvert.redirect_to === 'APP'">
                            <v-col cols="12" sm="12" md="12">
                                <v-select
                                    v-model="formAddAdvert.redirect_app"
                                    :items="redirectApp"
                                    label="Select App Redirect*"
                                    variant="outlined"
                                    density="compact"
                                    class="text-body-1"
                                    hide-details
                                ></v-select>
                            </v-col>
                        </v-row>

                        <small>*indicates required field</small>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="closeAddAdvertDialog" variant="tonal" flat> Close </v-btn>
                        <v-btn color="primary" type="submit" variant="tonal" flat> Add </v-btn>
                    </v-card-actions>
                </form>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiService } from '@/api/apiService';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/models/userModel'; // type-only import
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'; // Adjust the path as necessary
import type { AppGrid } from '@/models/systemModel';
import { formatDate } from '@/utils/dateFormatter'; // Import the helper function
import type { Advertisement } from '@/models/advertModel';
const router = useRouter();
const page = ref({ title: 'Advertisement' });
const breadcrumbs = ref([
    {
        text: 'Advertisement',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const select = ref('All');

const gridFor = ref(['Biller', 'BillerCategory']);
const inputCityValue = ref('');
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const itemsPerPageOptions = ref([10, 30, 50, 100]); // Options for items per page
const users = ref<User[]>([]); // Store users from the API with the correct type
const appGrid = ref<AppGrid[]>([]);
const openAppGridDialog = ref(false);
const type = ref(['IMAGE', 'TEXT']);
const redirectTo = ref(['NONE', 'APP', 'WEB']);
const redirectApp = ref(['PAYMENTS', 'DEPOSIT', 'REWARDS']);

const profilePictureImage = ref(''); // URL of the selected image for preview
const advert = ref<Advertisement[]>([]);
const addAdvertDialog = ref(false);

const appGridImageFile = ref<File | null>(null); // Define the file type

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

// Reactive object to hold form data
const formAddAdvert = ref({
    title: '',
    body: '',
    advertisement_type: '',
    redirect_app: '',
    advertisement_image: null as unknown as string | File,
    redirect_to: '',
    redirect_web_url: ''
});

// Reactive object to hold form data
const formUpdateAppGridData = ref({
    grid_no: 0,
    label: '',
    logo_url: '',
    type: '',
    grid_for: '',
    id: 0,
    redirect_to: '',
    unique_id: 0
});

const formImageData = new FormData();

// Fetch users when component is mounted
onMounted(async () => {
    getAdverts();
});

const getAdverts = async () => {
    try {
        if (token) {
            const fetchedAdvertisement = await apiService.getAdvertisments(token);
            advert.value = fetchedAdvertisement;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const closeAddAdvertDialog = () => {
    addAdvertDialog.value = false;

    (formAddAdvert.value.title = ''),
        (formAddAdvert.value.body = ''),
        (formAddAdvert.value.advertisement_type = ''),
        (formAddAdvert.value.redirect_app = ''),
        (formAddAdvert.value.advertisement_image = ''),
        (formAddAdvert.value.redirect_to = ''),
        (formAddAdvert.value.redirect_web_url = '');
    appGridImageFile.value = null;
};

const openAddAdvertDialog = (userID: number) => {
    addAdvertDialog.value = true;
};
const submitAdvertForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        const formData = new FormData();
        formData.append('title', formAddAdvert.value.title);
        formData.append('body', formAddAdvert.value.body);
        formData.append('advertisement_type', formAddAdvert.value.advertisement_type);
        formData.append('redirect_to', formAddAdvert.value.redirect_to);

        if (formAddAdvert.value.redirect_to === 'APP') {
            formData.append('redirect_app', formAddAdvert.value.redirect_app);
        } else if (formAddAdvert.value.redirect_to === 'WEB') {
            formData.append('redirect_web_url', formAddAdvert.value.redirect_web_url);
        }

        if (formAddAdvert.value.advertisement_type == 'IMAGE') {
            if (appGridImageFile.value) {
                formData.append('advertisement_image', appGridImageFile.value); // Ensure this line is reached
            }
        }

        // Log FormData contents for debugging
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        const response = await apiService.addAdvert(token, formData);

        if (!response) {
            throw new Error('Error adding advert');
        }
        getAdverts();
        closeAddAdvertDialog();
        // Handle success (e.g., redirect, show a message)
    } catch (error) {
        console.error('Error adding advert:', error);
        // Handle error (e.g., show an error message)
    }
};

const handleFileChange = (event: { target: { files: any[] } }) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
        appGridImageFile.value = file;
    }
};

const getAppGrid = async () => {
    try {
        if (token) {
            const fetchedAppGrid = await apiService.getAppGrid(token);
            console.log(fetchedAppGrid);
            appGrid.value = fetchedAppGrid; // Store fetched users
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

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

const deleteAd = async (id: number) => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (id) {
            // Send formData in the API request
            const response = await apiService.deleteAd(token, id);

            if (!response) {
                throw new Error('Error deleting ad');
            }
            getAdverts();
        }
    } catch (error) {
        console.error('Error deleting ad:', error);
        // Handle error (e.g., show an error message)
    }
};

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

// Open the Send Func dialog
const openGridDialog = (item: AppGrid) => {
    formUpdateAppGridData.value.grid_for = item.grid_for;
    formUpdateAppGridData.value.grid_no = item.grid_no;
    formUpdateAppGridData.value.label = item.label;
    formUpdateAppGridData.value.logo_url = item.logo_url;
    formUpdateAppGridData.value.type = item.type;
    formUpdateAppGridData.value.id = item.id;
    formUpdateAppGridData.value.redirect_to = item.redirect_to;
    formUpdateAppGridData.value.unique_id = item.unique_id;

    openAppGridDialog.value = true;
};
// Close the Send Func dialog
const closeAppGridDialog = () => {
    openAppGridDialog.value = false;
    formUpdateAppGridData.value.grid_for = '';
    formUpdateAppGridData.value.grid_no = 0;
    formUpdateAppGridData.value.label = '';
    formUpdateAppGridData.value.logo_url = '';
    formUpdateAppGridData.value.type = '';
    formUpdateAppGridData.value.id = 0;
    formUpdateAppGridData.value.redirect_to = '';
    formUpdateAppGridData.value.unique_id = 0;
};
// Method to handle form submission
const submitUpdateForm = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        if (formUpdateAppGridData) {
            // Send formData in the API request
            const response = await apiService.updateAppGrid(token, formUpdateAppGridData.value);

            if (!response) {
                throw new Error('Error adding fund');
            }
            getAppGrid();
            closeAppGridDialog();
            // Handle success (e.g., redirect, show a message)
        }
    } catch (error) {
        console.error('Error adding fund:', error);
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
