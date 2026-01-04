import { apiConfig, baseHeaders } from "@/config";
import { handleResponseError } from "@/utils/api";
import { type CartItem } from "@/features/cart/CartContext";

export type Order = {
    id: string;
    product_ids: string[];
    name: string;
    address: string;
};

export type OrdersResponse = Order[];

export type CheckoutItem = {
    product_id: string;
    product_name: string;
    amount: number;
    quantity: number;
    currency: string;
};

export type CreateOrderWithPaymentPayload = {
    items: CheckoutItem[];
    name: string;
    address: string;
};

export type CreateOrderWithPaymentResponse = {
    order_id?: string;
    url?: string;
    error?: string;
};

export const getOrdersRequest = async (): Promise<OrdersResponse> => {
    const response = await fetch(apiConfig.orders.base, {
        method: "GET",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to fetch orders.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const createOrderWithPayment = async (
    items: CartItem[],
    name: string,
    address: string
): Promise<CreateOrderWithPaymentResponse> => {
    const payload: CreateOrderWithPaymentPayload = {
        items: items.map(item => ({
            product_id: item.id,
            product_name: item.name,
            amount: item.price,
            quantity: item.quantity,
            currency: item.currency,
        })),
        name,
        address,
    };

    const response = await fetch(apiConfig.orders.base, {
        method: "POST",
        credentials: "include",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to create order and start payment.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json() as Promise<CreateOrderWithPaymentResponse>;
};
