import { createContext } from "react";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
    images: string[];
};

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
    handleCheckout: () => Promise<void>;
    clearError: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
