const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000';

export const apiConfig = {
    baseUrl: API_BASE_URL,
    endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        products: '/products',
        payments: '/payments',
    },
};

export type ApiConfig = typeof apiConfig;

