// src/stores/userStore.js
import { defineStore } from 'pinia';
import type { User } from '@/models/userModel'; // type-only import

export const useUserStore = defineStore('user', {
    state: () => ({
        userData: null as User | null // Define userData type
    }),
    actions: {
        setUserData(userData: User) {
            // Specify the type for userData
            this.userData = userData;
        },
        clearUserData() {
            this.userData = null; // Clear userData from the store
        }
    },
    persist: true // Enable persistence for this store
});
