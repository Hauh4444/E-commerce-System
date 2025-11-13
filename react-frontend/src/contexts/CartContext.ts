import { createContext, useContext } from "react";

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
    totalItems: number;
    totalPrice: number;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
