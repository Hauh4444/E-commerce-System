import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { HomePage, AuthPage, SearchPage, ProductPage, NotFoundPage } from "@/pages";


export const PublicRoutes = () => {

    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/product/:productId" element={<ProductPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    )
}
