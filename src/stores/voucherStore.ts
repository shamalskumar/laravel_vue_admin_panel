// src/stores/userStore.js
import { defineStore } from 'pinia';
import type { VoucherDetails } from '@/models/voucherModel'; // type-only import

export const useVoucherStore = defineStore('voucher', {
    state: () => ({
        voucherData: null as VoucherDetails | null // Define userData type
    }),
    actions: {
        setUserData(voucherData: VoucherDetails) {
            // Specify the type for userData
            this.voucherData = voucherData;
        },
        clearUserData() {
            this.voucherData = null; // Clear userData from the store
        }
    },
    persist: true // Enable persistence for this store
});
