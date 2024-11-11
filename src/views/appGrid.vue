<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card elevation="10" class="revenue-products">
        <v-card-item class="pb-4">
            <div>
                <v-window>
                    <v-window-item>
                        <v-table class="revenue-table light-border">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-body-1 textPrimary">Grid No</th>
                                        <th class="text-body-1 textPrimary">Label</th>
                                        <th class="text-body-1 textPrimary">Logo</th>
                                        <th class="text-body-1 textPrimary">Type</th>
                                        <th class="text-body-1 textPrimary">Redirect To</th>
                                        <th class="text-body-1 textPrimary">App Grid For</th>
                                        <th class="text-body-1 textPrimary">Grid For</th>
                                        <th class="text-body-1 textPrimary">Date</th>
                                        <th class="text-body-1 textPrimary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in appGrid" :key="item.id" class="month-item">
                                        <td>
                                            <h6 class="text-subtitle-1 text-no-wrap mb-1">{{ item.grid_no }}</h6>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.label }}</p>
                                        </td>
                                        <td>
                                            <img :src="item.logo_url" alt="pro" width="50" />
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.type }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.redirect_to }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.app_grid_for.category_name }}</p>
                                        </td>
                                        <td>
                                            <p class="text-body-1">{{ item.grid_for }}</p>
                                        </td>

                                        <td>
                                            <p class="text-body-1">{{ formatDate(item.created_at) }}</p>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 8px; align-items: center">
                                                <v-btn
                                                    icon
                                                    @click="openGridDialog(item)"
                                                    style="display: flex; align-items: center; justify-content: center; padding: 0"
                                                >
                                                    <v-icon color="primary">mdi-pencil</v-icon>
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
    <v-dialog v-model="openAppGridDialog" persistent class="dialog-mw">
        <v-card class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Add Funds</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                density="compact"
                                label="Grid Number"
                                v-model="formUpdateAppGridData.grid_no"
                                disabled
                                type="number"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                density="compact"
                                label="Edit Label"
                                v-model="formUpdateAppGridData.label"
                                required
                                type="text"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                v-model="formUpdateAppGridData.type"
                                :items="type"
                                variant="outlined"
                                density="compact"
                                class="text-body-1"
                                label="Edit Grid Type"
                                hide-details
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                v-model="formUpdateAppGridData.grid_for"
                                :items="gridFor"
                                variant="outlined"
                                density="compact"
                                label="Edit Grid For"
                                class="text-body-1"
                                hide-details
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-select
                                v-model="formUpdateAppGridData.redirect_to"
                                :items="gridFor"
                                variant="outlined"
                                label="Edit Redirect To"
                                density="compact"
                                class="text-body-1"
                                hide-details
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-file-input
                                v-model="appGridImageFile"
                                accept="image/*"
                                label="Select App Grid image"
                                hide-details
                                variant="outlined"
                                required
                                @change="handleFileChange"
                            ></v-file-input> </v-col
                    ></v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeAppGridDialog" variant="tonal" flat> Close </v-btn>
                    <v-btn color="primary" @click="submitUpdateForm" variant="tonal" flat> Update </v-btn>
                </v-card-actions>
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

const router = useRouter();
const page = ref({ title: 'App Grid' });
const breadcrumbs = ref([
    {
        text: 'App Grid',
        disabled: true,
        href: '#'
    }
]);

// State variables for filtering and pagination
const select = ref('All');
const type = ref(['Singular', 'Category']);
const gridFor = ref(['Biller', 'BillerCategory']);
const inputCityValue = ref('');
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(30); // Make this a ref to allow dynamic updates
const itemsPerPageOptions = ref([10, 30, 50, 100]); // Options for items per page
const users = ref<User[]>([]); // Store users from the API with the correct type
const appGrid = ref<AppGrid[]>([]);
const openAppGridDialog = ref(false);

const appGridImageFile = ref<File | null>(null); // Hold the selected file
const profilePictureImage = ref(''); // URL of the selected image for preview

// Get token from the Pinia auth store
const authStore = useAuthStore();
const token = authStore.token;

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

// Fetch users when component is mounted
onMounted(async () => {
    getAppGrid();
});

// Handle file change and set the image for preview
const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        appGridImageFile.value = file;
        profilePictureImage.value = URL.createObjectURL(file); // Show selected image
    }

    if (appGridImageFile.value) {
        await convertAndUploadImage(appGridImageFile.value); // Convert and upload the image
    }
};

// Convert the image to JPEG and upload
const convertAndUploadImage = async (file: File) => {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            uploadImageToServer(blob); // Call the API to upload the image
                        }
                    },
                    'image/jpeg',
                    0.8
                ); // Convert to JPEG with 80% quality

                resolve(canvas);
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// Upload image to external API
const uploadImageToServer = async (blob: Blob) => {
    const formData = new FormData();

    // Adding the required form fields

    // Create a dynamic file name and append the image
    const filename = `${new Date().toISOString()}.jpeg`;

    if (token) {
        try {
            {
                formData.append('image', blob, filename);
                const response = await apiService.addImage(token, formData);
                formUpdateAppGridData.value.logo_url = response;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    } else {
        console.error('No token found');
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
