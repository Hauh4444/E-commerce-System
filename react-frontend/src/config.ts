const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

export const baseHeaders = () => {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
};

export const apiConfig = {
    baseUrl: BASE,

    auth: {
        base: `${BASE}/auth`,
        login: `${BASE}/auth/login`,
        register: `${BASE}/auth/register`,
        logout: `${BASE}/auth/logout`,
        deleteAccount: `${BASE}/auth/deleteAccount`,
    },

    products: {
        base: `${BASE}/products`,
        list: `${BASE}/products`,
        detail: (productId: string | number) => `${BASE}/products/${productId}`,
    },

    payments: {
        base: `${BASE}/payments`,
        createCheckoutSession: `${BASE}/payments/create-checkout-session`,
    },

    lists: {
        base: `${BASE}/lists`,
        detail: (listId: string) => `${BASE}/lists/${listId}`,
        addProduct: (listId: string, productId: string) =>
            `${BASE}/lists/${listId}/product/${productId}`,
        removeProduct: (listId: string, productId: string) =>
            `${BASE}/lists/${listId}/product/${productId}`,
    },

    settings: {
        base: `${BASE}/settings`,
        detail: (userId: string) => `${BASE}/settings/${userId}`,
    },
} as const;
