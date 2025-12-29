import { createContext } from "react";

import { type LoginResponse } from "@/api/auth";

export type AuthContextValue = {
    user: LoginResponse["user"] | null;
    register: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    deleteAccount: () => Promise<void>;
    loading: boolean;
    error: string | null;
    clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
