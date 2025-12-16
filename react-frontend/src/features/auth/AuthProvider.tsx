import { type PropsWithChildren, useState, useEffect, useCallback, useMemo } from "react";

import { registerRequest, loginRequest, deleteAccountRequest, type RegisterResponse, type LoginResponse } from "@/api/auth";

import { AuthContext, type AuthContextValue } from "./AuthContext";
import { loadAuth, saveAuth, type StoredAuth } from "./authStorage";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<StoredAuth['user'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const stored = loadAuth();
        if (stored) {
            setToken(stored.token);
            setUser(stored.user);
        }
    }, []);

    const register = useCallback(async (email: string, password: string, name: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: RegisterResponse = await registerRequest({ email, password, name });
            setToken(response.access_token);
            setUser(response.user);
            saveAuth({ token: response.access_token, user: response.user });
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : "Unable to register");
            setToken(null);
            setUser(null);
            saveAuth(null);
            throw authError;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: LoginResponse = await loginRequest({ email, password });
            setToken(response.access_token);
            setUser(response.user);
            saveAuth({ token: response.access_token, user: response.user });
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : "Unable to login");
            setToken(null);
            setUser(null);
            saveAuth(null);
            throw authError;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        saveAuth(null);
    }, []);

    const deleteAccount = useCallback(async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all account data."
        );
        if (!confirmed) return;

        setLoading(true);
        setError(null);
        try {
            await deleteAccountRequest();
            logout();
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : "Unable to login");
            logout();
            throw authError;
        } finally {
            setLoading(false);
        }
    }, [logout]);

    const clearError = useCallback(() => setError(null), []);

    const value: AuthContextValue = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(token),
        register,
        login,
        logout,
        deleteAccount,
        loading,
        error,
        clearError,
    }), [user, token, register, login, logout, deleteAccount, loading, error, clearError]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
