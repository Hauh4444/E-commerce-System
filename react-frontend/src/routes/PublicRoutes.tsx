import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ListsProvider } from "@/contexts/ListsProvider";
import { CartProvider } from "@/contexts/CartProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { HomePage, AuthPage, CartPage, ListsPage, SearchPage, ProductPage, NotFoundPage } from "@/pages";


export const PublicRoutes = () => {

    return (
        <AuthProvider>
            <ListsProvider>
                <CartProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/auth" element={<AuthPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/lists/:listId?" element={<ListsPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/product/:productId" element={<ProductPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </BrowserRouter>
                    </ToastProvider>
                </CartProvider>
            </ListsProvider>
        </AuthProvider>
    )
}
