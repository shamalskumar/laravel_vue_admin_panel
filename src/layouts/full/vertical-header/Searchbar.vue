<script setup>
import { Icon } from '@iconify/vue';
import { searchSugg } from '@/_mockApis/headerData';
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- search1 -->
    <!-- ------------------------------------------------>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn icon class="custom-hover-primary" size="small" variant="text" color="primary" v-bind="props">
                <Icon icon="solar:magnifer-linear" height="20" />
            </v-btn>
        </template>
        <v-sheet width="360" elevation="10" rounded="md">
            <div class="d-flex align-center justify-space-between pa-5">
                <v-text-field placeholder="Search" color="primary" density="compact" variant="outlined" hide-details></v-text-field>
            </div>
            <v-divider></v-divider>
            <h5 class="text-h5 mt-4 px-5 pb-4">Quick Page Links</h5>
            <perfect-scrollbar style="height: 380px">
                <v-list class="pt-0 pb-5" lines="two">
                    <v-list-item
                        :value="item"
                        v-for="(item, index) in searchSugg"
                        :key="index"
                        :to="item.href"
                        color="primary"
                        class="px-5 py-2"
                    >
                        <h6 class="text-subtitle-1 heading mb-1">{{ item.title }}</h6>
                        <p class="text-subtitle-2 textSecondary">{{ item.href }}</p>
                    </v-list-item>
                </v-list>
            </perfect-scrollbar>
        </v-sheet>
    </v-menu>
</template>
