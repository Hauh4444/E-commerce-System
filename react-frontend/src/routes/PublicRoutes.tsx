import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { CartProvider } from "@/contexts/CartProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { HomePage, AuthPage, CartPage, SearchPage, ProductPage, NotFoundPage } from "@/pages";


export const PublicRoutes = () => {

    return (
        <AuthProvider>
            <CartProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/product/:productId" element={<ProductPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </CartProvider>
        </AuthProvider>
    )
}
