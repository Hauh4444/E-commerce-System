import { Bell, Shield, Globe } from "lucide-react";

import { useAuth } from "@/features/auth/useAuth";
import { useSettings } from "@/features/settings/useSettings";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SettingsPage = () => {
    const { user, logout, deleteAccount } = useAuth();

    const { settings, loading, updateSetting } = useSettings();

    if (loading) return <p>Loading products...</p>;

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <div className="w-[50%] mb-10 pt-28 flex flex-col items-center gap-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-left">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications in your browser
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushNotifications}
                                    onCheckedChange={(value) => updateSetting('pushNotifications', value)}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Weekly Digest</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get a weekly summary of your activity
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.weeklyDigest}
                                    onCheckedChange={(value) => updateSetting('weeklyDigest', value)}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Collaboration Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified about project updates and mentions
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.collaborationAlerts}
                                    onCheckedChange={(value) => updateSetting('collaborationAlerts', value)}
                                />
                            </div>
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
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Public Profile</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make your profile visible to other users
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.publicProfile}
                                    onCheckedChange={(value) => updateSetting('publicProfile', value)}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Analytics Tracking</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Help us improve by sharing usage analytics
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.analyticsTracking}
                                    onCheckedChange={(value) => updateSetting('analyticsTracking', value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center text-sm">
                                <p className="w-fit font-medium">User ID:&ensp;</p>
                                <p className="w-fit text-muted-foreground">{user?.id}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-center gap-5">
                                <Button variant="outline" className="w-full" onClick={logout}>
                                    Sign Out
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={deleteAccount}>
                                    Delete Account
                                </Button>
                            </div>
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
                                onClick={() => window.open('/help-center', '_self')}
                            >
                                Help Center
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => window.open('/contact-support', '_self')}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => window.open('/privacy-policy', '_self')}
                            >
                                Privacy Policy
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => window.open('/terms-of-service', '_self')}
                            >
                                Terms of Service
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
};

export default SettingsPage;

