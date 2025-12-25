import { type PropsWithChildren, useState, useMemo, useCallback, useEffect } from "react";

import { CartContext, type CartContextValue, type CartItem } from "./CartContext";

import { useToast } from "@/features/toast/useToast";

const CART_STORAGE_KEY = "avento_cart";

const loadStoredCart = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
        return [];
    }
};

const persistCart = (items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        setItems(loadStoredCart());
    }, []);

    const addItem = useCallback((item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            const updated = existing ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) : [...prev, item];
            persistCart(updated);
            toast({ title: "Item added", description: `${item.name} added to cart.` });
            return updated;
        });
    }, [toast]);

    const removeItem = useCallback((id: string) => {
        setItems(prev => {
            const itemToRemove = prev.find(i => i.id === id);
            const updated = prev.filter(i => i.id !== id);
            persistCart(updated);
            toast({ title: "Item removed", description: `${itemToRemove?.name} removed from cart.` });
            return updated;
        });
    }, [toast]);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setItems(prev => {
            const updated = prev.map(i => i.id === id ? { ...i, quantity } : i);
            persistCart(updated);
            return updated;
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        persistCart([]);
        toast({ title: "Cart cleared", description: "All items have been removed from the cart." });
    }, [toast]);

    const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

    const value: CartContextValue = useMemo(() => ({
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
    }), [items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
