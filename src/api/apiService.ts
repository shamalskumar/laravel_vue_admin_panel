import apiClient from './apiClient';
import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const apiService = {
    async login(username: string, password: string) {
        try {
            const response = await apiClient.post(`${baseUrl}/user/login`, {
                username,
                password,
                device_name: 'iphone'
            });

            const token = response.data?.data?.token;

            if (token) {
                const responseGetUser = await apiClient.get(`${baseUrl}/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userData = responseGetUser.data?.data;
                return { userData, token };
            }

            throw new Error('No token received');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Login failed: Unknown error');
            }
            throw new Error('Login failed: Unknown error');
        }
    },

    // signOut user
    async signOut(token: string) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error logging out user');
            }
            throw new Error('Error logging out user: Unknown error');
        }
    },

    // New function to get all users
    async getAllUsers(token: string, userTypeID: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/search?user_type_id=${userTypeID}&request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    async getEveryUsers(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/search?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all users
    async getAllTickets(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/complaint`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all users
    async getChat(token: string, id: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/complaint/${id}/message`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all users
    async getAllComplaintTypes(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/admin/complaint-type?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all vouchers
    async getAllvouchers(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/promotion?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch promotions');
            }
            throw new Error('Failed to fetch promotions: Unknown error');
        }
    },

    // New function to get all vouchers
    async getVoucherByID(token: string, id: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/promotion?request_origin=web&id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch promotions');
            }
            throw new Error('Failed to fetch promotions: Unknown error');
        }
    },

    // New function to get all vouchers
    async getRedeemedVoucherByID(token: string, id: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/promotion/reedemed-vouchers?voucher_id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch promotions');
            }
            throw new Error('Failed to fetch promotions: Unknown error');
        }
    },

    // New function to get all vouchers by type
    async getRedeemedVoucher(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/promotion/reedemed-vouchers?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch promotions');
            }
            throw new Error('Failed to fetch promotions: Unknown error');
        }
    },

    // New function to get all users
    async getUsers(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/search?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get wallet history
    async getUserActivity(token: string, userID: number, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/user-event?user_id=${userID}&request_origin=web&from_date=${dataFrom}&to_date=${dataTO}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch user activity');
            }
            throw new Error('Failed to fetch user activity: Unknown error');
        }
    }, // New function to get wallet history
    async getUserRejectActivity(token: string, userID: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/user-event?user_id=${userID}&request_origin=web&event=KYC_REJECTED`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch user activity');
            }
            throw new Error('Failed to fetch user activity: Unknown error');
        }
    },

    // New function to get all fund requests
    async getAllFundRequests(token: string, type: string, dates: any, status: string) {
        try {
            // Check the value of status before proceeding
            let apiURL = '';
            if (status === 'ALL') {
                apiURL = `${baseUrl}/fund-request?is_received_or_sent=${type}&request_origin=web&from_date=${dates.dateFrom}&to_date=${dates.dateTo}`;
            } else {
                apiURL = `${baseUrl}/fund-request?is_received_or_sent=${type}&request_origin=web&from_date=${dates.dateFrom}&to_date=${dates.dateTo}&status=${status}`;
            }

            const response = await apiClient.get(apiURL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all fund requests
    async getFundRequests(token: string) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/fund-request?is_received_or_sent=received&request_origin=web&status=REQUESTED`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    async getMetrics(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/admin/business-metrics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },
    // New function to search users
    async searchUsersByID(token: string, searchText: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/search?id=${searchText}&request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all verified users
    async getAllUsersVerified(token: string, userTypeID: number) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/user/search?user_type_id=${userTypeID}&is_pending_verification=0&request_origin=web`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },
    // New function to get all unverified users
    async getAllUsersUnverified(token: string, userTypeID: number) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/user/search?user_type_id=${userTypeID}&is_pending_verification=1&request_origin=web`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all Incomplete Registrations users
    async getAllUserIncompleteRegistrations(token: string, userTypeID: number) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/user/search?user_type_id=${userTypeID}&registration_status=0&request_origin=web`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },

    // New function to get all country
    async getAllCountry(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/country`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const country = response.data?.data;
            return country;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch countries');
            }
            throw new Error('Failed to fetch countries: Unknown error');
        }
    },
    // New function to get all city
    async getCitiesByCountryId(token: string, country_id: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/city?country_id=` + country_id, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const city = response.data?.data;
            return city;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch cities');
            }
            throw new Error('Failed to fetch cities: Unknown error');
        }
    },

    // New function to get all country
    async getIncomeSource(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/source-of-income`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch income sources');
            }
            throw new Error('Failed to fetch income sources: Unknown error');
        }
    },

    // New function to get all country
    async getBillers(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/biller`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch income sources');
            }
            throw new Error('Failed to fetch income sources: Unknown error');
        }
    },

    // New function to get all country
    async getBillerByID(token: string, id: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/biller/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch biller');
            }
            throw new Error('Failed to fetch biller: Unknown error');
        }
    },

    // New function to get all country
    async getTransferLimitScheme(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/transfer-limit-schemes?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch income sources');
            }
            throw new Error('Failed to fetch income sources: Unknown error');
        }
    },
    async updateTransferLimitScheme(item: number, id: number, token: string) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/user/${id}`,
                {
                    transfer_limit_scheme_id: item // Corrected object syntax
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },

    async updateSystemSettings(token: string, formData: any) {
        try {
            const response = await apiClient.patch(`${baseUrl}/system-settings`, JSON.stringify(formData), {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update system settings');
            }
            throw new Error('Failed to update system settings: Unknown error');
        }
    },

    async updateAppGrid(token: string, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/app-grid`,
                {
                    app_grid: formData.app_grid
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },
    async resolveTicket(token: string, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/complaint/${formData.id}/resolve`,
                {
                    resolution_description: formData.resolution_description // Corrected object syntax
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },

    async sendChat(token: string, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/complaint/${formData.id}/message`,
                {
                    message: formData.message // Corrected object syntax
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },

    async updateVoucher(newValue: boolean, id: number, token: string) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/promotion/${id}`,
                {
                    is_active: newValue // Corrected object syntax
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },

    async getPaymentChargePackage(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/payment-charge-package?request_origin=web`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch income sources');
            }
            throw new Error('Failed to fetch income sources: Unknown error');
        }
    },

    async getNotifications(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/notification`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch notification');
            }
            throw new Error('Failed to fetch notification: Unknown error');
        }
    },

    async getBanks(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/banks?request_origin=web&show_all=1`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch banks');
            }
            throw new Error('Failed to fetch banks: Unknown error');
        }
    },

    async updatePaymentChargePackage(item: number, id: number, token: string) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/user/${id}`,
                {
                    payment_charge_package_id: item // Corrected object syntax
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },

    async updateWalletLimit(item: number, id: number, token: string) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/user/${id}`,
                {
                    wallet_limit: item
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update transfer limit scheme');
            }
            throw new Error('Failed to update transfer limit scheme: Unknown error');
        }
    },
    // New function to create user
    async createUser(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    async acceptFundRequent(token: string, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/fund-request/${formData.transactionID}/accept`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    async rejectFundRequent(token: string, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/fund-request/${formData.transactionID}/reject`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    async addCategory(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/faqs/categories`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    async addFAQ(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/faqs`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },
    // New function to create user
    async createUserViaAdmin(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/via-agent-or-admin`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // New function to create user
    async createPromotion(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/promotion`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create promotion');
            }
            throw new Error('Failed to create promotion: Unknown error');
        }
    },

    // New function to admin withdrawal
    async adminWithdrawal(token: string, formData: any, billerID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/withdrawal/${billerID}/admin-withdrawal`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to withdraw fund');
            }
            throw new Error('Failed to withdraw fund: Unknown error');
        }
    },

    async getWithdrawalReport(token: string, status: string, formData: any) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/user/withdrawal?request_origin=web&from_date=${formData.dateFrom}&to_date=${formData.dateTo}&status=${status}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch withdrawal report');
            }
            throw new Error('Failed to fetch withdrawal report: Unknown error');
        }
    },

    async getAdvertisments(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/advertisement`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch withdrawal report');
            }
            throw new Error('Failed to fetch withdrawal report: Unknown error');
        }
    },

    // New function to staff , agent user
    async createStaff(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/staff`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // New function to create user
    async createSubAccount(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/sub-account`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },
    // Update user kyc
    async updateKYCImage(token: string, formData: any, userID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/kyc-document/${userID}`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // Update Business TIN DOc
    async updateTINImage(token: string, formData: any, userID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/business/company-tin-image/${userID}`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // Update Business Registration
    async updateBusinessRegistrationImage(token: string, formData: any, userID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/business/company-reg-image/${userID}`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },
    // Update user selfie
    async updateselfieImage(token: string, formData: any, userID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/selfie-image/${userID}`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },
    // Update user signature
    async updatesignatureImage(token: string, formData: any, userID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/signature/${userID}`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // Update user selfie
    async updateProfilePictureImage(token: string, formData: any, userID: number) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user/profile-pic/${userID}`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // add image
    async addImage(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/image/upload`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Specify JSON content type
                    }
                }
            );
            return response.data.file_name;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // New function to get wallet history
    async getUserWalletTransactions(token: string, userID: number, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/wallet-history?search_user_id=${userID}&request_origin=web&from_date=${dataFrom}&to_date=${dataTO}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch wallet history');
            }
            throw new Error('Failed to fetch wallet history: Unknown error');
        }
    },

    // New function to get wallet history
    async getDepositReport(token: string, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/deposit?request_origin=web&from_date=${dataFrom}&to_date=${dataTO}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch deposit history');
            }
            throw new Error('Failed to fetch deposit history: Unknown error');
        }
    },

    // New function to get Admin wallet history
    async getAdminUserWalletTransactions(token: string, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/wallet-history?request_origin=web&from_date=${dataFrom}&to_date=${dataTO}&user_type_id=1`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch wallet history');
            }
            throw new Error('Failed to fetch wallet history: Unknown error');
        }
    },

    // New function to get Admin commission wallet history
    async getAdminCommissionWalletTransactions(token: string, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/wallet-history?request_origin=web&from_date=${dataFrom}&to_date=${dataTO}&user_type_id=6`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch wallet history');
            }
            throw new Error('Failed to fetch wallet history: Unknown error');
        }
    },

    // New function to get Admin commission wallet history
    async getAdminWithdrawalWalletTransactions(token: string, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/wallet-history?request_origin=web&from_date=${dataFrom}&to_date=${dataTO}&user_type_id=8`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch wallet history');
            }
            throw new Error('Failed to fetch wallet history: Unknown error');
        }
    },

    // New function to get wallet history
    async getBillPayment(token: string, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(`${baseUrl}/bill-payment?request_origin=web&from_date=${dataFrom}&to_date=${dataTO}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch bill payment history');
            }
            throw new Error('Failed to fetch bill payment: Unknown error');
        }
    },

    // New function to get wallet history
    async getAgentWalletTransactions(token: string, userID: number, walletType: String, dataFrom: String, dataTO: String) {
        try {
            const response = await apiClient.get(
                `${baseUrl}/wallet-history?user_id=${userID}&request_origin=web&from_date=${dataFrom}&to_date=${dataTO}&wallet_type=${walletType}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch wallet history');
            }
            throw new Error('Failed to fetch countries: Unknown error');
        }
    },

    // New function to get all country
    async getCountryData(token: string, countryId: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/country/${countryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const country = response.data?.data;
            return country;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch countries');
            }
            throw new Error('Failed to fetch countries: Unknown error');
        }
    },
    // New function to get all income
    async getIncomeData(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/source-of-income`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch income');
            }
            throw new Error('Failed to fetch incomes: Unknown error');
        }
    },

    // New function to get all merchant category data
    async getMerchantCategoryData(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/merchant-types`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch merchant types');
            }
            throw new Error('Failed to fetch merchant types: Unknown error');
        }
    },

    // New function to get all business type data
    async getBusinessTypeData(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/business-types`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to business types');
            }
            throw new Error('Failed to fetch business types: Unknown error');
        }
    },

    // New function to get all biller category data
    async getBillerCategoryData(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/biller-category`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get biller category');
            }
            throw new Error('Failed to fetch biller categorys: Unknown error');
        }
    },

    async enableBank(token: string, id: number) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/banks`,
                { bank_id: id, disabled: 0 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to enable bank');
            }
            throw new Error('Failed to  enable bank: Unknown error');
        }
    },

    async disableBank(token: string, id: number) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/banks`,
                { bank_id: id, disabled: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to enable bank');
            }
            throw new Error('Failed to  enable bank: Unknown error');
        }
    },

    async updateBank(token: string, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/banks`,
                { bank_id: formData.bank_id, bank_name: formData.bank_name, swift: formData.swift, bsb: formData.bsb },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to enable bank');
            }
            throw new Error('Failed to  enable bank: Unknown error');
        }
    },

    async addBank(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/banks`,
                { bank_name: formData.bank_name, swift: formData.swift, bsb: formData.bsb },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to enable bank');
            }
            throw new Error('Failed to  enable bank: Unknown error');
        }
    },

    async verifyKyc(token: string, userId: number) {
        console.log(token, userId);
        try {
            const response = await apiClient.patch(
                `${baseUrl}/user/${userId}`,
                { is_kyc_verified: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to verify user kYC');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // Reject KYC
    async rejectKyc(token: string, userId: number, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/user-event/${userId}`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to reject user kYC');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // New function to update user
    async updateUser(token: string, userID: number, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/user/${userID}`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    },

    // New function to update voucher

    async updateVoucherInformation(token: string, id: number, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/promotion/${id}`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update Voucher');
            }
            throw new Error('Failed to update Voucher: Unknown error');
        }
    },

    // New function to update user

    async patchBiller(token: string, userID: number, formData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/biller/${userID}`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update biller ID');
            }
            throw new Error('Failed to update biller ID: Unknown error');
        }
    },

    async enableBillerAccount(token: string, userID: number, status: number) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/biller/${userID}`,
                { is_active: status }, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update biller ID');
            }
            throw new Error('Failed to update biller ID: Unknown error');
        }
    },

    // Send Funds
    async sendFunds(token: string, formData: any) {
        console.log(token, formData);
        try {
            const response = await apiClient.post(
                `${baseUrl}/send-funds`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add funds');
            }
            throw new Error('Failed to add funds: Unknown error');
        }
    },

    // Send Funds
    async addLimitScheme(token: string, formData: any) {
        console.log(token, formData);
        try {
            const response = await apiClient.post(
                `${baseUrl}/transfer-limit-schemes`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add limit scheme');
            }
            throw new Error('Failed to add limit scheme: Unknown error');
        }
    },

    async addNewPaymentChargePackage(token: string, payment_charges: any) {
        console.log(token, payment_charges);
        try {
            const response = await apiClient.post(
                `${baseUrl}/payment-charge-package`,

                {
                    package_name: payment_charges.package_name,
                    package_type: payment_charges.package_type,
                    payment_charges: payment_charges
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add new package');
            }
            throw new Error('Failed to add new package: Unknown error');
        }
    },

    async updatePaymentChargePackageInfo(token: string, payment_charges: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/payment-charge-package/${payment_charges.id}`,

                {
                    package_name: payment_charges.package_name,
                    payment_charges: {
                        charge_type: payment_charges.charges.payment_charges.charge_type,
                        max_charge: payment_charges.charges.payment_charges.max_charge,
                        min_charge: payment_charges.charges.payment_charges.min_charge,
                        percentage_charge: payment_charges.charges.payment_charges.percentage_charge,
                        fixed_charge: payment_charges.charges.payment_charges.fixed_charge
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update new package');
            }
            throw new Error('Failed to update new packagee: Unknown error');
        }
    },

    async setDefaultPaymentChargePackage(token: string, payment_charges: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/payment-charge-package/${payment_charges.id}/set-default`,

                {
                    package_type: payment_charges.package_type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to  set package as default');
            }
            throw new Error('Failed to set package as default: Unknown error');
        }
    },

    // Send Funds
    async deleteScheme(token: string, id: number) {
        try {
            const response = await apiClient.delete(`${baseUrl}/transfer-limit-schemes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Specify JSON content type
                }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add funds');
            }
            throw new Error('Failed to add funds: Unknown error');
        }
    },

    async deleteAd(token: string, id: number) {
        try {
            const response = await apiClient.delete(`${baseUrl}/advertisement/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Specify JSON content type
                }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add funds');
            }
            throw new Error('Failed to add funds: Unknown error');
        }
    },
    // Accept Funds Request
    async acceptFundsRequest(token: string, formData: any, action: string) {
        try {
            // Prepare the request body based on the action
            const requestBody: any =
                action === 'reject' ? { reject_remark: formData.reject_remark } : { transaction_pin: formData.transaction_pin };

            const response = await apiClient.patch(`${baseUrl}/fund-request/${formData.fund_request_id}/${action}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Specify JSON content type
                }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to accept funds request');
            }
            throw new Error('Failed to accept funds request: Unknown error');
        }
    },

    // Add New Service
    async billerCategory(token: string, formData: any) {
        console.log(token, formData);
        try {
            const response = await apiClient.post(
                `${baseUrl}/biller-category`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add funds');
            }
            throw new Error('Failed to add funds: Unknown error');
        }
    },

    async addAdvert(token: string, formData: any) {
        console.log(token, formData);
        try {
            const response = await apiClient.post(
                `${baseUrl}/advertisement`,
                formData,
         
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add funds');
            }
            throw new Error('Failed to add funds: Unknown error');
        }
    },

    async updateSubAccountStatus(item: number, id: number, token: string) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/user/${id}`,
                {
                    has_sub_accounts: item // Corrected object syntax
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update subaccount');
            }
            throw new Error('Failed to update subaccount: Unknown error');
        }
    },

    async updateTicketType(token: string, ticketData: any) {
        try {
            const response = await apiClient.patch(
                `${baseUrl}/admin/complaint-type/${ticketData.id}`,
                {
                    transaction_type: ticketData.transaction_type,
                    type_description: ticketData.type_description
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update ticket type');
            }
            throw new Error('Failed to update ticket type: Unknown error');
        }
    },

    async addTicketType(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/admin/complaint-type`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to add ticket type');
            }
            throw new Error('Failed to add ticket type: Unknown error');
        }
    },

    // New function to get all merchant sub accounts
    async getSystemSetting(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/system-settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get sub account data');
            }
            throw new Error('Failed to get sub account data: Unknown error');
        }
    },

    async getFAQs(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/faq`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get faq data');
            }
            throw new Error('Failed to get faq: Unknown error');
        }
    },

    async getSubAccounts(token: string, accountID: number) {
        try {
            const response = await apiClient.get(`${baseUrl}/user/search?master_account_user_id=${accountID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to get sub account data');
            }
            throw new Error('Failed to get sub account data: Unknown error');
        }
    },

    // New function to send OTP
    async sendOTP(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/otp/send`,
                JSON.stringify(formData), // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to send OTP');
            }
            throw new Error('Failed to send OTP: Unknown error');
        }
    },

    // New function to get all users
    async getAppGrid(token: string) {
        try {
            const response = await apiClient.get(`${baseUrl}/app-grid`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const users = response.data?.data;
            return users;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch users');
            }
            throw new Error('Failed to fetch users: Unknown error');
        }
    },
    async sendAlert(token: string, formData: any) {
        try {
            const response = await apiClient.post(
                `${baseUrl}/alert`,
                formData, // Convert formData to JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' // Specify JSON content type
                    }
                }
            );

            return response.data?.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create users');
            }
            throw new Error('Failed to create users: Unknown error');
        }
    }
};
