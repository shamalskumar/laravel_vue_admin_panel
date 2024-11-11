// src/api/apiClient.ts
import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// Optionally, you can set up interceptors here for request/response handling

export default apiClient;
