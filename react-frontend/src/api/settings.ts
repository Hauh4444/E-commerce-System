import { apiConfig, baseHeaders } from "@/config";

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

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string" ? body.error : "Unable to fetch settings.";
        throw new Error(msg);
    }

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

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string" ? body.error : "Unable to update user settings.";
        throw new Error(msg);
    }

    return await response.json();
};
