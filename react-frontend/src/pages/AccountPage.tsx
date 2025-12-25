import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";
import { useToast } from "@/features/toast/useToast";

import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button.tsx";

const AccountPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, error, logout, deleteAccount } = useAuth();

    const links = [
        {
            title: "Your Orders",
            content: "Track, return, cancel orders, download invoices, or buy again",
            nav: "/orders"
        },
        {
            title: "Returns & Refunds",
            content: "View return status and refund history",
            nav: "/returns"
        },
        {
            title: "Your Lists",
            content: "View and manage your saved items",
            nav: "/lists"
        },
        {
            title: "Addresses",
            content: "Manage shipping and billing addresses",
            nav: "/addresses"
        },
        {
            title: "Payment Methods",
            content: "Add, remove, or set default payment options",
            nav: "/payments"
        },
        {
            title: "Login & Security",
            content: "Edit login details, password, and security settings",
            nav: "/security"
        },
        {
            title: "Profile Information",
            content: "Update your name, email, and phone number",
            nav: "/profile"
        },
        {
            title: "Notifications & Preferences",
            content: "Manage email, SMS, and marketing preferences",
            nav: "/preferences"
        },
        {
            title: "Rewards & Credits",
            content: "View loyalty points, store credit, and gift card balance",
            nav: "/rewards"
        },
        {
            title: "Help & Support",
            content: "Contact support or browse help articles",
            nav: "/support"
        }
    ];

    const handleSignOut = async () => {
        logout();

        if (error) {
            toast({title: "Error", description: error, variant: "destructive"});
        } else {
            toast({ title: "Signed out", description: "You have been signed out successfully" });
        }

        navigate("/");
    };

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <ul className="w-[50%] mb-10 pt-28 flex flex-col items-center gap-6">
                    <div className="w-full grid grid-cols-2 gap-3">
                        {links.map((link) => (
                            <Card className="h-28">
                                <Button
                                    variant="ghost"
                                    className="w-full h-full px-8 flex flex-col justify-center"
                                    onClick={() => navigate(link.nav)}
                                >
                                    <CardHeader className="py-0">
                                        <CardTitle className="text-xl">{link.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-0 text-wrap">
                                        {link.content}
                                    </CardContent>
                                </Button>
                            </Card>
                        ))}
                    </div>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <article className="flex justify-center text-sm">
                                <p className="w-fit font-medium">User ID:&ensp;</p>
                                <p className="w-fit text-muted-foreground">{user?.id}</p>
                            </article>

                            <Separator />

                            <article className="flex items-center justify-center gap-5">
                                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={deleteAccount}>
                                    Delete Account
                                </Button>
                            </article>
                        </CardContent>
                    </Card>
                </ul>
            </main>
        </>
    );
};

export default AccountPage;

