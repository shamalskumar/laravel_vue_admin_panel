<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AllAdminCard from '@/components/dashboards/dashboard1/settings/AllAdminCard.vue';
</script>
<template>
    <v-row>
        <!-- Welcome Cards -->
        <v-col cols="12" lg="12">
            <v-row>
                <v-card elevation="10" class="bg-primary overflow-hidden">
                    <v-card-item class="pb-2">
                        <v-row>
                            <v-col cols="12" md="12">
                                <div class="d-flex gap-3 align-center">
                                    <!-- Dynamically show the user's name -->
                                    <div class="text-h4">Admin Users</div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-item>
                </v-card>
            </v-row>
        </v-col>
        <v-col cols="12" lg="12">
            <AllAdminCard />
        </v-col>
    </v-row>
</template>
