<script setup lang="ts">
import { faqPage } from '@/_mockApis/components/pages/faqData';
</script>
<template>
    <div class="text-center mb-8">
        <h3 class="text-28">Frequently asked questions</h3>
        <p class="text-16 textSecondary mt-1">Get to know more about ready-to-use admin dashboard templates</p>
    </div>
    <v-expansion-panels elevation="10">
        <v-expansion-panel elevation="10" v-for="item in faqPage" :key="item.question">
            <v-expansion-panel-title class="text-h6 py-6">{{ item.question }}</v-expansion-panel-title>
            <v-divider></v-divider>
            <v-expansion-panel-text class="text-subtitle-1 text-10 textSecondary pt-3 pb-2">
                {{ item.answer }}
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
