<script setup lang="ts">
import { profileCards, socialiconCard } from '@/_mockApis/components/widget/card';
</script>
<template>
    <v-row>
        <v-col cols="12" md="4" v-for="card in profileCards" :key="card.title">
            <v-card elevation="10" class="text-center" rounded="md">
                <v-card-item>
                    <v-avatar size="80">
                        <img :src="card.avatar" :alt="card.avatar" width="80" />
                    </v-avatar>
                    <div class="mt-4">
                        <h5 class="text-h5" v-text="card.title"></h5>
                        <p class="text-body-2 mt-1 textSecondary" v-text="card.subtitle"></p>
                    </div>
                </v-card-item>
                <v-divider class="mt-1"></v-divider>
                <div class="text-center d-flex justify-center pa-3">
                    <v-btn size="30" icon variant="flat" v-for="icon in socialiconCard" :key="icon.name">
                        <v-avatar size="22">
                            <component :is="icon.icon" :class="'text-' + icon.color" stroke-width="2" size="18" />
                        </v-avatar>
                    </v-btn>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>
