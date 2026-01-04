import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/features/auth/AuthProvider";
import { SettingsProvider } from "@/features/settings/SettingsProvider";
import { ListsProvider } from "@/features/lists/ListsProvider";
import { CartProvider } from "@/features/cart/CartProvider";
import { AddressProvider } from "@/features/address/AddressProvider";

import { HomePage, AuthPage, CartPage, OrderPage, ListsPage, SearchPage, ProductPage, AccountPage, SettingsPage, NotFoundPage } from "@/pages";

export const PublicRoutes = () => {

    return (
        <AuthProvider>
            <SettingsProvider>
                <ListsProvider>
                    <CartProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/account" element={<AccountPage />} />
                                <Route path="/auth" element={<AuthPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/order" element={<AddressProvider><OrderPage /></AddressProvider>} />
                                <Route path="/lists/:listId?" element={<ListsPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/product/:productId" element={<ProductPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </BrowserRouter>
                    </CartProvider>
                </ListsProvider>
            </SettingsProvider>
        </AuthProvider>
    )
}
