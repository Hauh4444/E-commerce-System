import { apiConfig, baseHeaders } from "@/config";
import {handleResponseError} from "@/utils/api";

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
    const defaultErrorMessage = "Unable to register. Please check your credentials.";
    await handleResponseError(response, defaultErrorMessage);

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
    const defaultErrorMessage = "Unable to login. Please check your credentials.";
    await handleResponseError(response, defaultErrorMessage);

    return (await response.json()) as LoginResponse;
};

export const deleteAccountRequest = async (): Promise<void> => {
    const response = await fetch(apiConfig.auth.deleteAccount, {
        method: "DELETE",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unexpected error deleting account.";
    await handleResponseError(response, defaultErrorMessage);
};
