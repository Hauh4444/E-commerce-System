import { apiConfig, baseHeaders } from "@/config";

export type RegisterResponse = {
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

export const registerRequest = async (
    payload: RegisterPayload
): Promise<RegisterResponse> => {
    const response = await fetch(apiConfig.auth.register, {
        method: "POST",
        credentials: "include",
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

    return (await response.json()) as RegisterResponse;
};

export const loginRequest = async (
    payload: LoginPayload
): Promise<LoginResponse> => {
    const response = await fetch(apiConfig.auth.login, {
        method: "POST",
        credentials: "include",
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

    return (await response.json()) as LoginResponse;
};

export const deleteAccountRequest = async (): Promise<void> => {
    const response = await fetch(apiConfig.auth.deleteAccount, {
        method: "DELETE",
        credentials: "include",
        headers: baseHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unexpected error deleting account.";
        throw new Error(message);
    }
};
