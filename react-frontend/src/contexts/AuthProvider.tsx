import { type PropsWithChildren, useState, useEffect, useCallback, useMemo } from "react";
import { registerRequest, loginRequest, type RegisterResponse, type LoginResponse } from "@/api/auth";
import { AuthContext, type AuthContextValue } from "./AuthContext";

const AUTH_STORAGE_KEY = "commerce_ui_auth";

type StoredAuth = {
    token: string;
    user: LoginResponse['user'];
};

const loadStoredAuth = (): StoredAuth | null => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredAuth;
    } catch {
        return null;
    }
};

const persistAuth = (auth: StoredAuth | null) => {
    if (!auth) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<StoredAuth['user'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const stored = loadStoredAuth();
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
            persistAuth({ token: response.access_token, user: response.user });
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : "Unable to register");
            setToken(null);
            setUser(null);
            persistAuth(null);
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
            persistAuth({ token: response.access_token, user: response.user });
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : "Unable to login");
            setToken(null);
            setUser(null);
            persistAuth(null);
            throw authError;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        persistAuth(null);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const value: AuthContextValue = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(token),
        register,
        login,
        logout,
        loading,
        error,
        clearError,
    }), [user, token, register, login, logout, loading, error, clearError]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
