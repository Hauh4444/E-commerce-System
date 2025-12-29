import { apiConfig, baseHeaders } from "@/config";

import { type CartItem } from "@/features/cart/CartContext";
import { handleResponseError } from "@/utils/api.ts";

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
    const response = await fetch(apiConfig.payments.createCheckoutSession, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to create checkout session.";
    await handleResponseError(response, defaultErrorMessage);

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
