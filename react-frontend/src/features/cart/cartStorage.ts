import { type CartItem } from "./CartContext";

const CART_STORAGE_KEY = "avento_cart";

export const loadCart = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
};

export const saveCart = (items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};