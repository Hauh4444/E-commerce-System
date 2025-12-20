import { useNavigate } from "react-router-dom";
import { LockKeyhole, Cog, Shield, Globe } from "lucide-react";

import { useSettings } from "@/features/settings/useSettings";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SettingsPage = () => {
    const navigate = useNavigate();
    const { settings, loading, updateSetting } = useSettings();

    if (loading) return <p>Loading settings...</p>;

    const mapDarkModeToSelect = (darkMode: boolean | null): string => {
        if (darkMode === true) return "dark";
        if (darkMode === false) return "light";
        return "system";
    };

    const mapSelectToDarkMode = (value: string): boolean | null => {
        if (value === "dark") return true;
        if (value === "light") return false;
        return null;
    };

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <ul className="w-[50%] mb-10 pt-28 flex flex-col items-center gap-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LockKeyhole className="h-5 w-5" />
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-left">
                            <fieldset className="flex items-center justify-between">
                                <article className="space-y-0.5 flex-1">
                                    <Label>Login Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified whenever your account is accessed from a new device
                                    </p>
                                </article>
                                <Switch
                                    checked={settings.loginAlerts}
                                    onCheckedChange={(value) => updateSetting("loginAlerts", value)}
                                />
                            </fieldset>

                            <Separator />

                            <fieldset className="flex items-center justify-between">
                                <article className="space-y-0.5 flex-1">
                                    <Label>Trusted Devices</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Manage devices you trust so you don’t need to verify every login
                                    </p>
                                </article>
                                <Switch
                                    checked={settings.trustedDevices}
                                    onCheckedChange={(value) => updateSetting("trustedDevices", value)}
                                />
                            </fieldset>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-left">
                            <fieldset className="flex items-center justify-between">
                                <article className="space-y-0.5 flex-1">
                                    <Label>Analytics Tracking</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Share anonymous usage data to help us improve the platform
                                    </p>
                                </article>
                                <Switch
                                    checked={settings.analyticsTracking}
                                    onCheckedChange={(value) => updateSetting("analyticsTracking", value)}
                                />
                            </fieldset>

                            <Separator />

                            <fieldset className="flex items-center justify-between">
                                <article className="space-y-0.5 flex-1">
                                    <Label>Personalized Recommendations</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive recommendations tailored to your activity
                                    </p>
                                </article>
                                <Switch
                                    checked={settings.personalizedRecommendations}
                                    onCheckedChange={(value) => updateSetting("personalizedRecommendations", value)}
                                />
                            </fieldset>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Cog className="h-5 w-5" />
                                Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-left">
                            <fieldset className="flex items-center justify-between">
                                <article className="space-y-0.5 flex-1">
                                    <Label>Theme</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose between light, dark, or your system theme
                                    </p>
                                </article>
                                <Select
                                    value={mapDarkModeToSelect(settings.darkMode)}
                                    onValueChange={(value) => (updateSetting("darkMode", mapSelectToDarkMode(value)))}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                    </SelectContent>
                                </Select>
                            </fieldset>

                            <Separator />

                            <fieldset className="flex items-center justify-between">
                                <article className="space-y-0.5 flex-1">
                                    <Label>Compact Product Layout</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Display more products per page in a condensed layout
                                    </p>
                                </article>
                                <Switch
                                    checked={settings.compactProductLayout}
                                    onCheckedChange={(value) => updateSetting("compactProductLayout", value)}
                                />
                            </fieldset>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => navigate("/help-center")}
                            >
                                Help Center
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => navigate("/contact-support")}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => navigate("/privacy-policy")}
                            >
                                Privacy Policy
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => navigate("/terms-of-service")}
                            >
                                Terms of Service
                            </Button>
                        </CardContent>
                    </Card>
                </ul>
            </main>
        </>
    );
};

export default SettingsPage;

