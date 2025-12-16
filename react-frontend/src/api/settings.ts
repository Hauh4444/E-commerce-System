    import { apiConfig } from "@/config.ts";

export interface Settings {
    pushNotifications: boolean;
    weeklyDigest: boolean;
    collaborationAlerts: boolean;
    publicProfile: boolean;
    analyticsTracking: boolean;
    darkModePreference: boolean | null;
}

export const getSettings = async (userId: string): Promise<Settings | null> => {
    const res = await fetch(apiConfig.settings.detail(userId), {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json() as Settings;
};

export const updateSettingRequest = async (
    userId: string,
    key: string,
    value: boolean | null
): Promise<void> => {
    const res = await fetch(apiConfig.settings.detail(userId), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
    });

    if (!res.ok) throw new Error("Failed to update user setting");
};
