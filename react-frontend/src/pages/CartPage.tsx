import { createCheckoutSessionForCart } from "@/api/payments";

import { useCart } from '@/features/cart/useCart';

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const CartPage = () => {
    const { items, totalItems, totalPrice, clearCart } = useCart();

    const handleCheckout = async () => {
        if (!items || items.length === 0) return;

        try {
            const session = await createCheckoutSessionForCart(items);
            if (session.url) {
                window.location.href = session.url;
            } else {
                console.error("Checkout session failed", session);
            }
        } catch (err) {
            console.error("Error during checkout:", err);
        }
    };

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <ul className="w-3/4 mt-20 mb-8 mx-auto space-y-6">
                    {items && totalItems > 0 ? (
                        <>
                            <li className="mt-6 pl-4 text-xl text-left">
                                Your cart ({totalItems} item{totalItems != 1 && 's'}):
                            </li>
                            {items.map((item) => (
                                <li key={item.id}>
                                    <ProductCard variant="cart" product={item} />
                                </li>
                            ))}
                            <li className="flex justify-between items-center">
                                <Button
                                    variant="destructive"
                                    className="w-auto px-6 py-2 text-xl hover:opacity-80 transition-opacity"
                                    onClick={clearCart}
                                    title="Clear Cart"
                                >
                                    CLEAR CART
                                </Button>
                                <h2 className="text-2xl text-foreground font-light">
                                    Subtotal ({totalItems} items): <strong className="font-bold">${totalPrice.toFixed(2)}</strong>
                                </h2>
                                <Button
                                    variant="secondary"
                                    className="w-auto px-6 py-2 text-xl hover:opacity-80 transition-opacity"
                                    onClick={handleCheckout}
                                    title="Checkout"
                                >
                                    PROCEED TO CHECKOUT
                                </Button>
                            </li>
                        </>
                    ) : (
                        <li className="mt-6 text-3xl text-foreground font-bold">
                            Your cart is empty
                        </li>
                    )}
                </ul>
            </main>
        </>
    );
};

export default CartPage;

