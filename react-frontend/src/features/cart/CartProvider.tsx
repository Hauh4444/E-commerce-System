import { type PropsWithChildren, useState, useMemo, useCallback, useEffect } from "react";

import { createCheckoutSessionForCart } from "@/api/payments";
import { CartContext, type CartContextValue, type CartItem, type DeliveryFormValues } from "./CartContext";
import { loadCart, saveCart } from "./cartStorage";

import { useToast } from "@/features/toast/useToast";

export const CartProvider = ({children}: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {toast} = useToast();

    useEffect(() => {
        try {
            setItems(loadCart());
        } catch {
            setError("Unable to load cart.");
        }
    }, []);

    const addItem = useCallback((item: CartItem) => {
        setError(null);

        try {
            const currentItems = loadCart();
            const existing = currentItems.find(i => i.id === item.id);
            const updated = existing
                ? currentItems.map(i => i.id === item.id ? {...i, quantity: i.quantity + item.quantity} : i)
                : [...currentItems, item];

            saveCart(updated);
            setItems(updated);

            toast({ title: "Item added", description: `${item.name} added to cart.` });
        } catch (cartError) {
            const message = cartError instanceof Error ? cartError.message : "Unable to add item to cart";
            setError(message);
            toast({ title: "Cart error", description: message, variant: "destructive" });
            throw cartError;
        }
    }, [toast]);

    const removeItem = useCallback((id: string) => {
        const confirmed = window.confirm("Are you sure you want to remove this item from your cart?");
        if (!confirmed) return;

        setError(null);

        try {
            const currentItems = loadCart();
            const itemToRemove = currentItems.find(i => i.id === id);
            const updated = currentItems.filter(i => i.id !== id);
            saveCart(updated);
            setItems(updated);

            toast({ title: "Item removed", description: `${itemToRemove?.name} removed from cart.` });
        } catch (cartError) {
            const message = cartError instanceof Error ? cartError.message : "Unable to remove item from cart";
            setError(message);
            toast({ title: "Cart error", description: message, variant: "destructive" });
            throw cartError;
        }
    }, [toast]);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setError(null);

        try {
            const currentItems = loadCart();
            const updated = currentItems.map(i => i.id === id ? {...i, quantity} : i);
            saveCart(updated);
            setItems(updated);
        } catch (cartError) {
            const message = cartError instanceof Error ? cartError.message : "Unable to update quantity";
            setError(message);
            toast({ title: "Cart error", description: message, variant: "destructive" });
            throw cartError;
        }
    }, [toast]);

    const clearCart = useCallback(() => {
        setError(null);

        try {
            setItems([]);
            saveCart([]);

            toast({ title: "Cart cleared", description: "All items have been removed from the cart." });
        } catch (cartError) {
            const message = cartError instanceof Error ? cartError.message : "Unable to clear cart";
            setError(message);
            toast({ title: "Cart error", description: message, variant: "destructive" });
            throw cartError;
        }
    }, [toast]);

    const handleCheckout = useCallback(async (data: DeliveryFormValues) => {
        // TODO: handle delivery data
        if (!items || items.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const session = await createCheckoutSessionForCart(items);
            if (!session.url) {
                const message = "Unable to start checkout.";
                setError(message);
                toast({ title: "Checkout failed", description: message, variant: "destructive" });
                return;
            }
            window.location.href = session.url;
        } catch (cartError) {
            const message = cartError instanceof Error ? cartError.message : "Something went wrong during checkout.";
            setError(message);
            toast({ title: "Checkout error", description: message, variant: "destructive" });
            throw cartError;
        } finally {
            setLoading(false);
        }
    }, [items, toast]);

    const clearError = useCallback(() => setError(null), []);

    const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

    const value: CartContextValue = useMemo(
        () => ({
            items,
            loading,
            error,
            totalItems,
            totalPrice,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            handleCheckout,
            clearError,
        }),
        [items, loading, error, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, handleCheckout, clearError]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
