const AUTH_STORAGE_KEY = "avento_auth";

export type StoredAuth = {
    token: string;
    user: { id: string; name: string; email: string; role?: string };
};

export const loadAuth = (): StoredAuth | null => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredAuth;
    } catch {
        return null;
    }
};

export const saveAuth = (auth: StoredAuth | null) => {
    if (!auth) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};
