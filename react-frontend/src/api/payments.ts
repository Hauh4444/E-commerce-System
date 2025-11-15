import { apiConfig } from '@/config';

import { type CartItem } from '@/features/cart/CartContext';

export type CheckoutItem = {
    product_name: string;
    amount: number;
    quantity: number;
    currency: string;
};

export type CreateCheckoutSessionPayload = {
    items: CheckoutItem[];
};

export type CheckoutSessionResponse = {
    url?: string;
    error?: string;
};

export const createCheckoutSessionRequest = async (
    payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionResponse> => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.payments}/create-checkout-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === 'string'
                ? errorBody.error
                : 'Unable to create checkout session.';
        throw new Error(message);
    }

    return await response.json() as CheckoutSessionResponse;
};

export const createCheckoutSessionForCart = async (items: CartItem[]): Promise<CheckoutSessionResponse> => {
    const payload: CreateCheckoutSessionPayload = {
        items: items.map(item => ({
            product_name: item.name,
            amount: item.price,
            quantity: item.quantity,
            currency: item.currency,
        })),
    };

    return createCheckoutSessionRequest(payload);
};
