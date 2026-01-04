import { apiConfig, baseHeaders } from "@/config";
import { handleResponseError } from "@/utils/api";

export interface Settings {
    loginAlerts: boolean;
    trustedDevices: boolean;
    analyticsTracking: boolean;
    personalizedRecommendations: boolean;
    darkMode: boolean | null;
    compactProductLayout: boolean;
}

export const getSettings = async (): Promise<Settings | null> => {
    const response = await fetch(apiConfig.settings.base, {
        method: "GET",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to fetch settings.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const updateSettingsRequest = async (
    payload: Settings,
): Promise<void> => {
    const response = await fetch(apiConfig.settings.base, {
        method: "PUT",
        credentials: "include",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to update user settings.";
    await handleResponseError(response, defaultErrorMessage);
};
