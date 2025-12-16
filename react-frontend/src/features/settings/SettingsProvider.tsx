import { type PropsWithChildren, useState, useCallback, useEffect, useMemo } from "react";

import { getSettings, updateSettingRequest, type Settings } from "@/api/settings";

import { SettingsContext, type SettingsContextValue } from "./SettingsContext";
import { loadSettingsFromStorage, saveSettingsToStorage } from "./settingsStorage";
import { useAuth } from "@/features/auth/useAuth";

const defaultSettings: Settings = {
    publicProfile: true,
    pushNotifications: false,
    weeklyDigest: true,
    collaborationAlerts: true,
    analyticsTracking: true,
    darkModePreference: null,
};

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const { user, isAuthenticated } = useAuth();

    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const stored = loadSettingsFromStorage();
        if (stored) setSettings(stored);
    }, []);

    const loadSettings = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        setLoading(true);
        setError(null);

        try {
            const remote = await getSettings(user.id);
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

    const updateSetting = useCallback(async (key: string, value: boolean | null) => {
        if (!isAuthenticated || !user) return;

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveSettingsToStorage(newSettings);

        try {
            await updateSettingRequest(user.id, key, value);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to update setting");
        }
    }, [settings, isAuthenticated, user]);

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
