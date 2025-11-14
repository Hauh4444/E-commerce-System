import { useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from "@/components/Header";

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();
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
            <main className="">
                <section className="">
                    <h1>{isAuthenticated && `Welcome back, ${user?.email}`}</h1>
                </section>
            </main>
        </>
    );
};

export default HomePage;

