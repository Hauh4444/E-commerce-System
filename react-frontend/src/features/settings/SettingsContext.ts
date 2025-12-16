import { createContext } from "react";

import { type Settings } from "@/api/settings";

export type SettingsContextValue = {
    settings: Settings;
    loading: boolean;
    error: string | null;
    loadSettings: () => Promise<void>;
    updateSetting: (key: string, value: boolean | null) => Promise<void>;
    clearError: () => void;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);
