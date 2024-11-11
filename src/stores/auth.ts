import { defineStore } from 'pinia';
import { router } from '@/router';
import { apiService } from '@/api/apiService'; // Import the new service

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: localStorage.getItem('token') || null, // Store token in state
        returnUrl: null,
        error: null as string | null // Allow error to be a string or null
    }),
    actions: {
        async login(username: string, password: string) {
            try {
                const { userData, token } = await apiService.login(username, password);

                if (userData && token) {
                    this.user = userData;
                    this.token = token; // Set token in state

                    // Store user and token in localStorage
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', token); // Token is already a string, no need for JSON.stringify

                    router.push(this.returnUrl || '/dashboards/dashboard1');
                }
            } catch (error: unknown) {
                this.error = (error as Error).message;
                console.error('Login error:', error);
            }
        },
        logout() {
            this.user = null;
            this.token = null; // Clear token in state
            localStorage.removeItem('user');
            localStorage.removeItem('token'); // Remove token from localStorage
            router.push('/');
        }
    }
});
