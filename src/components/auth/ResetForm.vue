<script setup lang="ts">
import { ref } from 'vue';
import Logo from '@/layouts/full/logo/Logo.vue';
const valid = ref(true);
const show1 = ref(false);
const email = ref('');
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
</script>
<template>
    <v-form ref="form" v-model="valid" lazy-validation action="/dashboards/analytical" class="mt-6">
        <v-label class="font-weight-semibold pb-2">Email Address</v-label>
        <VTextField v-model="email" :rules="emailRules" required></VTextField>
        <v-btn size="large" color="darkgray" to="/" block submit flat>Forgot Password</v-btn>
    </v-form>
</template>
