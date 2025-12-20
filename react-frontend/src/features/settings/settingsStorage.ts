const SETTINGS_STORAGE_KEY = "avento_user_settings";

import { type Settings } from "@/api/settings";

export const loadSettingsFromStorage = (): Settings | null => {
    try {
        const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as Settings;
    } catch {
        return null;
    }
};

export const saveSettingsToStorage = (settings: Settings) => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
