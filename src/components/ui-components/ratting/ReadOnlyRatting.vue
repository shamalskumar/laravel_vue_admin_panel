<script setup lang="ts">
import { ref } from 'vue';
const rating3 = ref(2);
</script>
<template>
    <div>
        <v-rating v-model="rating3" readonly density="compact" color="warning"></v-rating>
    </div>
</template>
