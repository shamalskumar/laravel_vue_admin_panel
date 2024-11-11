<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WelcomeCard from '@/components/dashboards/dashboard1/WelcomeCard.vue';
import InfoCard from '@/components/dashboards/dashboard1/InfoCard.vue';
import ProjectCard from '@/components/dashboards/dashboard1/ProjectCard.vue';
import RevenueForcast from '@/components/dashboards/dashboard1/RevenueForcast.vue';
import Performence from '@/components/dashboards/dashboard1/Performence.vue';
import CustomerChart from '@/components/dashboards/dashboard1/CustomerChart.vue';
import SalesOverview from '@/components/dashboards/dashboard1/SalesOverview.vue';
import PendingFundRequest from '@/components/dashboards/dashboard1/PendingFundRequest.vue';
import TotalSettelment from '@/components/dashboards/dashboard1/TotalSettelment.vue';
import SnackBar from '@/components/dashboards/snackbar.vue';
import type { BusinessMetrics } from '@/models/systemModel';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/api/apiService';

const businessMetrics = ref<BusinessMetrics | null>(null);

const authStore = useAuthStore();
const token = authStore.token;
onMounted(async () => {
    getBusinessMetrics();
});

const getBusinessMetrics = async () => {
    try {
        if (token) {
            const fetchedMetrics = await apiService.getMetrics(token);

            businessMetrics.value = fetchedMetrics;
        } else {
            console.error('No token found');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
</script>
<template>
    <v-row v-if="businessMetrics">
        <!-- Welcome Cards -->
        <v-col cols="12" lg="12">
            <v-row>
                <v-col cols="12" md="6">
                    <WelcomeCard />
                </v-col> </v-row
            ><v-row>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="$ Commission (Annual)" :amount="businessMetrics!.annual_earning_amount" />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="$ Commission (Monthly)" :amount="businessMetrics!.monthly_earning_amount" />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="Pending Requests" :amount="businessMetrics!.pending_fund_request_count.toString()" />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard
                        title="Bank Withdrawal (Daily)"
                        :amount="businessMetrics!.withdrawals_today_amount.bank_withdrawal.toString()"
                    />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="Total Customers" :amount="businessMetrics!.users_count.customer_count.toString()" />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="Total Merchants" :amount="businessMetrics!.users_count.merchant_count.toString()" />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="Total Agents" :amount="businessMetrics!.users_count.merchant_count.toString()" />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard
                        title="Agent Withdrawal (Daily)"
                        :amount="businessMetrics!.withdrawals_today_amount.agent_withdrawal.toString()"
                    />
                </v-col>
                <v-col cols="12" md="3" sm="4" xs="2">
                    <InfoCard title="Deposits (Daily)" :amount="businessMetrics!.deposits_today_amount.toString()" />
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" lg="12">
            <PendingFundRequest />
        </v-col>
        <!-- Revenue Forecast -->
        <!-- <v-col cols="12" lg="7">
            <RevenueForcast />
        </v-col> -->

        <!-- Your Performance -->
        <!-- <v-col cols="12" lg="5">
            <Performence />
        </v-col> -->
        <!-- Customers / Sales Overview -->
        <!-- <v-col cols="12" lg="7">
            <v-row>
                <v-col cols="12" md="6">
                    <CustomerChart />
                </v-col>
                <v-col cols="12" md="6">
                    <SalesOverview />
                </v-col>
            </v-row>
        </v-col> -->
        <!-- Revenue by Product / Total settlements -->

        <!-- <v-col cols="12" lg="4">
            <TotalSettelment />
        </v-col> -->
    </v-row>
</template>
