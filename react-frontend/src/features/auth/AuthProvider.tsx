import { type PropsWithChildren, useState, useEffect, useCallback, useMemo } from "react";

import { registerRequest, loginRequest, deleteAccountRequest, type RegisterResponse, type LoginResponse } from "@/api/auth";

import { AuthContext, type AuthContextValue } from "./AuthContext";
import { loadAuth, saveAuth } from "./authStorage";

import { useToast } from "@/features/toast/useToast";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<LoginResponse["user"] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        const stored = loadAuth();
        if (stored) setUser(stored.user);
    }, []);

    const register = useCallback(async (email: string, password: string, name: string) => {
        setLoading(true);
        setError(null);

        try {
            const response: RegisterResponse = await registerRequest({ email, password, name });

            setUser(response.user);
            saveAuth({ user: response.user });

            toast({ title: "Registration successful", description: "Your account has been created." });
        } catch (authError) {
            setUser(null);
            saveAuth(null);

            const message = authError instanceof Error ? authError.message : "Unable to register";
            setError(message);
            toast({ title: "Registration error", description: message, variant: "destructive" });

            throw authError;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response: LoginResponse = await loginRequest({ email, password });

            setUser(response.user);
            saveAuth({ user: response.user });

            toast({ title: "Login successful", description: "You are now signed in." });
        } catch (authError) {
            setUser(null);
            saveAuth(null);

            const message = authError instanceof Error ? authError.message : "Unable to login";
            setError(message);
            toast({ title: "Login error", description: message, variant: "destructive" });

            throw authError;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const logout = useCallback(() => {
        const confirmed = window.confirm("Are you sure you want to sign out of this account?");
        if (!confirmed) return;

        setUser(null);
        saveAuth(null);

        toast({ title: "Signed out", description: "You have been signed out of your account." });
    }, [toast]);

    const deleteAccount = useCallback(async () => {
        const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone and will permanently remove all account data.");
        if (!confirmed) return;

        setLoading(true);
        setError(null);

        try {
            await deleteAccountRequest();
            logout();

            toast({ title: "Account deleted", description: "Your account has been permanently deleted." });
        } catch (authError) {
            logout();

            const message = authError instanceof Error ? authError.message : "Unable to login";
            setError(message);
            toast({ title: "Delete account error", description: message, variant: "destructive" });

            throw authError;
        } finally {
            setLoading(false);
        }
    }, [logout, toast]);

    const clearError = useCallback(() => setError(null), []);

    const value: AuthContextValue = useMemo(() => ({
        user,
        register,
        login,
        logout,
        deleteAccount,
        loading,
        error,
        clearError,
    }), [user, register, login, logout, deleteAccount, loading, error, clearError]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
