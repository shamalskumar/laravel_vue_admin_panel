<script setup lang="ts">
import { ref } from 'vue';
// common components
import UiParentCard from '@/components/shared/UiParentCard.vue';
import AddAdminForm from '@/components/forms/form-layouts/AddAdminForm.vue';
// template breadcrumb
</script>
<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Add New Users" class="mt-6">
                <AddAdminForm />
            </UiParentCard>
        </v-col>
    </v-row>
</template>
