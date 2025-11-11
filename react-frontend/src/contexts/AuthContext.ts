import { createContext, useContext } from "react";
import type { LoginResponse } from "@/api/auth";

export type AuthContextValue = {
    user: LoginResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    register: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
