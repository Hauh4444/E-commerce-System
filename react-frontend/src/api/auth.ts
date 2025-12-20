import { apiConfig, baseHeaders } from "@/config";
import { loadAuth } from "@/features/auth/authStorage";

export type RegisterResponse = {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        name: string;
        email: string;
        role?: string;
    };
};

export type RegisterPayload = {
    email: string;
    password: string;
    name: string;
};

export type LoginResponse = {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        name: string;
        email: string;
        role?: string;
    };
};

export type LoginPayload = {
    email: string;
    password: string;
};

export const authHeaders = () => {
    const auth = loadAuth();
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth?.token ? `Bearer ${auth.token}` : "",
    };
};

export const registerRequest = async (
    payload: RegisterPayload
): Promise<RegisterResponse> => {
    const response = await fetch(apiConfig.auth.register, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to register. Please check your input.";
        throw new Error(message);
    }

    return await loginRequest(payload);
};

export const loginRequest = async (
    payload: LoginPayload
): Promise<LoginResponse> => {
    const response = await fetch(apiConfig.auth.login, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to login. Please check your credentials.";
        throw new Error(message);
    }

    return await response.json() as Promise<LoginResponse>;
};

export const deleteAccountRequest = async (): Promise<void> => {
    const response = await fetch(apiConfig.auth.deleteAccount, {
        method: "DELETE",
        headers: authHeaders()
    })

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unexpected error deleting account.";
        throw new Error(message);
    }
}