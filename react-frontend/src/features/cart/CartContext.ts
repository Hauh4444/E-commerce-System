import { createContext } from "react";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
    images: string[];
};

export interface DeliveryFormValues {
    fullName: string;
    address: string;
    lat: number;
    lng: number;
}

export type CartContextValue = {
    items: CartItem[];
    loading: boolean;
    error: string | null;
    totalItems: number;
    totalPrice: number;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    handleCheckout: (data: DeliveryFormValues) => Promise<void>;
    clearError: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
