import { type PropsWithChildren, useState, useCallback, useEffect, useMemo } from "react";

import { getSettings, updateSettingsRequest, type Settings } from "@/api/settings";

import { SettingsContext, type SettingsContextValue } from "./SettingsContext";
import { loadSettingsFromStorage, saveSettingsToStorage } from "./settingsStorage";
import { useAuth } from "@/features/auth/useAuth";

import { useToast } from "@/features/toast/useToast";

const defaultSettings: Settings = {
    loginAlerts: true,
    trustedDevices: true,
    analyticsTracking: false,
    personalizedRecommendations: false,
    darkMode: null,
    compactProductLayout: false
};

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();

    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();

    const applyTheme = useCallback((darkMode: boolean | null) => {
        const isDark: boolean = darkMode !== null ? darkMode : window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        const stored = loadSettingsFromStorage();
        if (!stored) {
            setSettings(defaultSettings);
            applyTheme(defaultSettings.darkMode);
            return;
        }

        setSettings(stored);
        applyTheme(stored.darkMode);
    }, [applyTheme]);

    const fetchSettings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const remote = await getSettings();
            if (remote) {
                setSettings(remote);
                saveSettingsToStorage(remote);
            }
        } catch (settingsError) {
            const message = settingsError instanceof Error ? settingsError.message : "Unable to load settings";
            setError(message);
            toast({ title: "Settings error", description: message, variant: "destructive" });

            throw settingsError;
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        void fetchSettings();
    }, [fetchSettings]);

    const updateSetting = useCallback(async (key: keyof Settings, value: boolean | null) => {
        if (!user) return;

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveSettingsToStorage(newSettings);

        if (key === "darkMode") applyTheme(value);

        try {
            await updateSettingsRequest(newSettings);
            toast({ title: "Settings updated", description: "Your preferences have been saved." });
        } catch (settingsError) {
            const message = settingsError instanceof Error ? settingsError.message : "Unable to update user settings";
            setError(message);
            toast({ title: "Settings error", description: message, variant: "destructive" });

            throw settingsError;
        }
    },[settings, user, applyTheme, toast]);

    const clearError = useCallback(() => setError(null), []);

    const value: SettingsContextValue = useMemo(() => ({
        settings,
        loading,
        error,
        updateSetting,
        clearError,
    }), [settings, loading, error, updateSetting, clearError]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
