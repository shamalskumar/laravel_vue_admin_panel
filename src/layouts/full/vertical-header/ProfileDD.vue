<script setup lang="ts">
import { MailIcon } from 'vue-tabler-icons';
import { profileDD } from '@/_mockApis/headerData';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';
import { useRouter } from 'vue-router';
const router = useRouter();

const authStore = useAuthStore();
const token = authStore.token;

const signOut = async () => {
    try {
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        {
            const response = await apiService.signOut(token);
            router.push('/auth/login2');
            if (!response) {
                throw new Error('Error logging out user');
            }
        }
    } catch (error) {
        console.error('Error logging out user:', error);
        // Handle error (e.g., show an error message)
    }
};
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu open-on-hover open-on-click>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" class="custom-hover-primary" color="primary" v-bind="props" icon>
                <v-avatar size="35">
                    <img :src=authStore.user.selfie_img_url width="35" alt="Julia" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="280" elevation="10">
            <div class="pa-6">
                <div class="d-flex align-center pb-6">
                    <v-avatar size="55">
                        <img :src=authStore.user.selfie_img_url width="55" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-subtitle-1 mb-n1">{{authStore.user.full_name}}</h6>
                        <span class="text-subtitle-1 textSecondary">{{ authStore.user.username }}</span>
                    </div>
                </div>
                <v-divider></v-divider>
                <v-btn class="text-subtitle-1 heading custom-title mt-6" color='primary' variant="outlined" @click="signOut"> Sign Out </v-btn>
                <!-- <perfect-scrollbar style="height: calc(100vh - 240px); max-height: 240px">
                    <v-list class="py-0 theme-list mt-3" lines="one">
                        <v-list-item
                            v-for="item in profileDD"
                            :key="item.title"
                            class="py-0 px-2 rounded-md custom-text-primary"
                            color="primary"
                            :to="item.href"
                        >
                            <div class="d-flex gap-3 align-center">
                                <p class="text-subtitle-1 heading custom-title">{{ item.title }}</p>
                                <v-chip size="small" color="error" v-if="item.badge">4</v-chip>
                            </div>
                        </v-list-item>
                    </v-list>
                </perfect-scrollbar> -->
            </div>
        </v-sheet>
    </v-menu>
</template>
