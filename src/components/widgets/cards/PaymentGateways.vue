<script setup lang="ts">
import { paymentGateways } from '@/_mockApis/components/widget/card';
</script>
<template>
    <v-card elevation="10">
        <v-card-item>
            <v-card-title class="text-h5">Payment Gateways</v-card-title>
            <v-card-subtitle class="text-subtitle-1">Platform For Income</v-card-subtitle>
            <div class="mt-sm-10 mt-5">
                <div class="d-flex gap-3 align-center mt-6" v-for="list in paymentGateways" :key="list.title">
                    <v-avatar :class="'rounded-md bg-light' + list.bgcolor" size="45">
                        <img :src="list.img" :alt="list.img" width="25" />
                    </v-avatar>
                    <div>
                        <h5 class="text-h6 mb-1">{{ list.title }}</h5>
                        <p class="text-subtitle-1 textSecondary">{{ list.subtitle }}</p>
                    </div>
                    <div :class="'ml-auto font-weight-semibold text-subtitle-1 text-medium-' + list.disable">{{ list.rank }}</div>
                </div>
                <v-btn class="mt-10" block flat color="primary">View all transactions</v-btn>
            </div>
        </v-card-item>
    </v-card>
</template>
