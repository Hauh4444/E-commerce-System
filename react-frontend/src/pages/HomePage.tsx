import { useEffect } from "react";

import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";

import { Header } from "@/components/Header";

const HomePage = () => {
    const { user } = useAuth();
    const { clearCart } = useCart();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("checkout_complete") === "true") {
            clearCart();
        }
    }, [clearCart]);

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <h1 className="my-auto text-3xl text-foreground font-bold">
                    {user && `Welcome back ${user?.name}!`}
                </h1>
            </main>
        </>
    );
};

export default HomePage;

