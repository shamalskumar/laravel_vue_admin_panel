<script setup lang="ts">
import { ref } from 'vue';
/* Breadcrumb component */
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import BlogCards from '@/components/widgets/cards/BlogCards.vue';
import ProductCards from '@/components/widgets/cards/ProductCards.vue';
import MusicCards from '@/components/widgets/cards/MusicCards.vue';
import FollowerCards from '@/components/widgets/cards/FollowerCards.vue';
import UserCards from '@/components/widgets/cards/UserCards.vue';
import ProfileCards from '@/components/widgets/cards/ProfileCards.vue';
import Settings from '@/components/widgets/cards/Settings.vue';
import GiftCards from '@/components/widgets/cards/GiftCards.vue';
import UpcommingActivityCard from '@/components/widgets/cards/UpcommingActivityCard.vue';
import DailyActivities from '@/components/dashboards/dashboard2/DailyActivities.vue';
import PaymentGateways from '@/components/widgets/cards/PaymentGateways.vue';

// template breadcrumb
const page = ref({ title: 'Cards Widgets' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '#'
    },
    {
        text: 'Cards Widgets',
        disabled: true,
        href: '#'
    }
]);
</script>
<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <!-- Blog cards -->
        <v-col cols="12">
            <BlogCards />
        </v-col>
        <!-- Product cards -->
        <v-col cols="12">
            <ProductCards />
        </v-col>
        <!-- Music cards -->
        <v-col cols="12">
            <MusicCards />
        </v-col>
        <!-- Follower cards -->
        <v-col cols="12">
            <FollowerCards />
        </v-col>
        <!-- User cards -->
        <v-col cols="12">
            <UserCards />
        </v-col>
        <!-- Profile cards -->
        <v-col cols="12">
            <ProfileCards />
        </v-col>
        <!-- Settings cards -->
        <v-col cols="12" md="4">
            <Settings />
        </v-col>
        <!-- Gift cards -->
        <v-col cols="12" md="8">
            <GiftCards />
        </v-col>
        <!-- Payment Gateways card -->
        <v-col cols="12" md="4">
            <PaymentGateways />
        </v-col>
        <!-- Upcomming Activity card -->
        <v-col cols="12" md="4">
            <UpcommingActivityCard />
        </v-col>
        <!-- Recent Transactions -->
        <v-col cols="12" md="4">
            <DailyActivities />
        </v-col>
    </v-row>
</template>
