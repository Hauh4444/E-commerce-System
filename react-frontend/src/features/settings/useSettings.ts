import { useContext } from "react";

import { SettingsContext } from "./SettingsContext";

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useUserSettings must be used within a UserSettingsProvider");
    return context;
};
