import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";
import { useLists } from "@/features/lists/useLists";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const AuthPage = () => {
    const navigate = useNavigate();
    const { register, login, loading, error } = useAuth();
    const { fetchLists } = useLists();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await login(email, password).then(async () => {
            if (error) return;
            await fetchLists();
            navigate("/");
        });
    };

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await register(email, password, name).then(async () => {
            if (error) return;
            await fetchLists();
            navigate("/");
        });
    };

    return (
        <main className="w-full min-h-screen bg-gradient-subtle flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>
                        Login to your account or create a new one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                            <TabsTrigger value="register" className="flex-1">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <fieldset className="space-y-2 text-left">
                                    <Label className="ml-2" htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="space-y-2 text-left">
                                    <Label className="ml-2" htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </fieldset>
                                <Button
                                    className="w-full"
                                    disabled={loading}
                                    type="submit"
                                    title="Login"
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-4">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <fieldset className="space-y-2 text-left">
                                    <Label className="ml-2" htmlFor="register-name">Full Name</Label>
                                    <Input
                                        id="register-name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="space-y-2 text-left">
                                    <Label className="ml-2" htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="space-y-2 text-left">
                                    <Label className="ml-2" htmlFor="register-password">Password</Label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </fieldset>
                                <Button
                                    className="w-full"
                                    disabled={loading}
                                    type="submit"
                                    title="Create account"
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    );
};

export default AuthPage;

