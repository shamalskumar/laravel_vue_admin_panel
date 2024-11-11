<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Logoiconimg from '@/assets/images/logos/logo-icon.svg';
import LogoiconimgWhite from '@/assets/images/logos/logo-icon.svg';
import { useTheme } from 'vuetify';
const theme = useTheme();
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="Logoiconimg" alt="home"  v-if="theme.name.value =='BLUE_THEME'" />
            <img :src="LogoiconimgWhite" alt="home"  v-if="theme.name.value =='DARK_BLUE_THEME'" />
        </RouterLink>
    </div>
</template>
