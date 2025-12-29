import { type LoginResponse } from "@/api/auth";

const AUTH_STORAGE_KEY = "avento_auth";

export const loadAuth = (): LoginResponse | null => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as LoginResponse;
    } catch {
        return null;
    }
};

export const saveAuth = (auth: LoginResponse | null) => {
    if (!auth) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};
