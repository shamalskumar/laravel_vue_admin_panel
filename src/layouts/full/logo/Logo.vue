<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Logoimg from '@/assets/images/logos/logo.svg';
import LogoimgWhite from '@/assets/images/logos/logoWhite.svg';
import { useTheme } from 'vuetify';
const theme = useTheme();
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="Logoimg" alt="home" v-if="theme.name.value =='BLUE_THEME'" />
            <img :src="LogoimgWhite" alt="home" v-if="theme.name.value =='DARK_BLUE_THEME'" />
        </RouterLink>
    </div>
</template>
