import { type PropsWithChildren, useState, useCallback, useEffect, useMemo } from "react";

import { getSettings, updateSettingsRequest, type Settings } from "@/api/settings";

import { SettingsContext, type SettingsContextValue } from "./SettingsContext";
import { loadSettingsFromStorage, saveSettingsToStorage } from "./settingsStorage";
import { useAuth } from "@/features/auth/useAuth";

const defaultSettings: Settings = {
    loginAlerts: true,
    trustedDevices: true,
    analyticsTracking: false,
    personalizedRecommendations: false,
    darkMode: null,
    compactProductLayout: false
};

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const { user, isAuthenticated } = useAuth();

    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const applyTheme = useCallback((darkMode: boolean | null) => {
        let isDark: boolean;
        if (darkMode === null) {
            isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        } else {
            isDark = darkMode;
        }

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
        if (stored) {
            setSettings(stored);
            applyTheme(stored.darkMode);
        } else {
            applyTheme(defaultSettings.darkMode);
        }
    }, [applyTheme]);

    const loadSettings = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        setLoading(true);
        setError(null);

        try {
            const remote = await getSettings();
            if (remote) {
                setSettings(remote);
                saveSettingsToStorage(remote);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to load settings");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (isAuthenticated && user) {
            loadSettings().catch((settingsError) => {
                console.error(settingsError);
            });
        }
    }, [isAuthenticated, user, loadSettings]);

    const updateSetting = useCallback(async (key: keyof Settings, value: boolean | null) => {
        if (!isAuthenticated || !user) return;

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveSettingsToStorage(newSettings);

        if (key === "darkMode") {
            applyTheme(value);
        }

        try {
            await updateSettingsRequest(newSettings);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to update user settings");
        }
    },[settings, isAuthenticated, user, applyTheme]);

    const clearError = useCallback(() => setError(null), []);

    const value: SettingsContextValue = useMemo(() => ({
        settings,
        loading,
        error,
        loadSettings,
        updateSetting,
        clearError,
    }), [settings, loading, error, loadSettings, updateSetting, clearError]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
