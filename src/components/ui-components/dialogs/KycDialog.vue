<template>
    <v-dialog v-model="localShowDialog" persistent class="dialog-mw">
        <template v-slot:activator="{ props }">
            <v-btn flat icon v-bind="props" @click="openDialog">
                <v-icon icon="solar:pen-new-square-broken" class="text-secondary cursor-pointer" size="small">mdi-pencil</v-icon>
                <!-- Edit button -->
            </v-btn>
        </template>

        <v-card style="height: auto" class="overflow-auto">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">Upload New KYC Document</span>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-select
                                v-model="kycDocumentType"
                                :items="['VOTERID', 'DRIVING_LICENSE', 'PASSPORT', 'JOINT_CARD']"
                                label="KYC ID Type*"
                                required
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="kycIdNumber" label="KYC ID Number*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" v-if="kycDocumentType !== 'VOTERID'">
                            <v-text-field
                                variant="outlined"
                                hide-details
                                type="date"
                                v-model="expiryDate"
                                label="KYC ID Expiry Date*"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-file-input
                                v-model="kycImageFile"
                                accept="image/*"
                                label="Select KYC Image*"
                                hide-details
                                variant="outlined"
                                required
                                @change="handleFileChange"
                            ></v-file-input>
                        </v-col>

                        <!-- Display the selected image -->
                        <v-col cols="12" v-if="kycImage">
                            <img :src="kycImage" alt="Selected KYC Image" style="max-width: 100%; height: auto" />
                        </v-col>
                    </v-row>

                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="closeDialog" variant="tonal">Close</v-btn>
                    <v-btn color="primary" @click="saveData" variant="tonal">Save</v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    documentUrl: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['update:showDialog', 'imageUploaded']);
const userStore = useUserStore();
const localShowDialog = ref(props.showDialog); // Local state for dialog visibility
const kycDocumentType = ref(props.documentType); // Initialize from prop
const kycIdNumber = ref('');
const expiryDate = ref('');
const kycImage = ref(''); // URL of the selected image for preview
const kycImageFile = ref<File | null>(null); // Hold the selected file
const authStore = useAuthStore();
const token = authStore.token;

// Handle file change and set the image for preview
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        kycImageFile.value = file;
        kycImage.value = URL.createObjectURL(file); // Show selected image
    }
};

// Convert and upload the image on save
const saveData = async () => {
    if (kycImageFile.value) {
        await convertAndUploadImage(kycImageFile.value, kycDocumentType.value); // Convert and upload the image
    }

    // Handle other save logic, if any, and close dialog
    closeDialog();
};

// Convert the image to JPEG and upload
const convertAndUploadImage = async (file: File, imageType: string) => {
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
                            uploadImageToServer(blob, imageType); // Call the API to upload the image
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
const uploadImageToServer = async (blob: Blob, imageType: string) => {
    const formData = new FormData();

    // Adding the required form fields
    formData.append('kyc_document_type', kycDocumentType.value);
    formData.append('kyc_document_id', kycIdNumber.value);
    if (kycDocumentType.value !== 'VOTERID') {
        formData.append('kyc_document_expiry_date', expiryDate.value);
    } else {
        formData.append('kyc_document_expiry_date', '2099-01-01');
    }

    // Create a dynamic file name and append the image
    const filename = `${imageType}_${new Date().toISOString()}.jpeg`;
    formData.append('kyc_document_image', blob, filename);

    if (token && userStore.userData?.id) {
        try {
            // Assuming apiService.updateKYCImage handles the FormData correctly
            const response = await apiService.updateKYCImage(token, formData, userStore.userData.id);

            // Emit event after successful upload to notify parent
            emit('imageUploaded'); // Notify parent after image is uploaded
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    } else {
        console.error('No token found');
    }
};

// Watch for changes in the prop and update the local state
watch(
    () => props.showDialog,
    (newValue) => {
        localShowDialog.value = newValue;
    }
);

// Open the dialog
const openDialog = () => {
    localShowDialog.value = true;
};

// Close the dialog and emit the update
const closeDialog = () => {
    localShowDialog.value = false;
    emit('update:showDialog', false);
};
</script>
