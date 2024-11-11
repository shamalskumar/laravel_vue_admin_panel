<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth'; // Import the Pinia store

// Access the auth store
const authStore = useAuthStore();

// You can access the user's name from the store like this:
const username = authStore.user?.full_name;
const wallet = authStore.user?.wallet;
</script>

<template>
    <v-card elevation="10" class="bg-primary overflow-hidden">
        <v-card-item class="pb-2">
            <v-row>
                <v-col cols="12" md="12">
                    <div class="d-flex gap-3 align-center">
                        <!-- Dynamically show the user's name -->
                        <div class="text-h4">Welcome Back {{ username }}</div>
                    </div>
                    <div class="mt-xl-16 mt-lg-8 mt-6">
                        <div class="d-flex justify-space-between pr-1">
                            <div class="py-0">
                                <p class="opacity-80 mb-1">Balance</p>
                                <h3 class="text-xl-h3 text-lg-h5">${{ wallet.balance }}</h3>
                            </div>
                            <v-divider vertical class="opacity-20 h-55"></v-divider>
                            <div class="py-0">
                                <p class="opacity-80 mb-1">Limit</p>
                                <h3 class="text-xl-h3 text-lg-h5">${{ wallet.wallet_limit }}</h3>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
