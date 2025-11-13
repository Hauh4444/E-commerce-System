import { forwardRef, type HTMLAttributes, type ForwardedRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Settings, User, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = forwardRef<HTMLElement, HeaderProps>((props, ref: ForwardedRef<HTMLElement>) => {
    const navigate = useNavigate();
    const { user, logout, error } = useAuth();
    const { totalItems } = useCart();
    const { toast } = useToast();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query) {
            navigate(`/search?query=${encodeURIComponent(query.trim())}`);
        }
    }

    const handleSignOut = async () => {
        logout();

        if (error) {
            toast({ title: "Error", description: error, variant: "destructive" });
        } else {
            toast({ title: "Signed out", description: "You have been signed out successfully" });
            navigate("/");
        }
    };

    return (
        <header
            ref={ref}
            className={cn("sticky top-0 z-50 w-full border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85", props.className)}
            {...props}
        >
            <nav className="flex h-[80px] items-center justify-between px-8" aria-label="Main navigation">
                <Link
                    to="/"
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                    <h1 className="text-3xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                        Avento
                    </h1>
                </Link>

                <span className="max-w-[50%] flex grow">
                    <Input
                        id="search-query"
                        className="h-11 p-4 border-border rounded-full !text-base opacity-80 focus-visible:opacity-100"
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {if (e.key === "Enter") handleSearch()}}
                        required
                    />
                    <Button
                        variant="ghost"
                        className="w-11 h-11 p-4 rounded-full -translate-x-11"
                        onClick={handleSearch}
                    >
                        <Search />
                    </Button>
                </span>

                <article className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                                onClick={() => navigate("/cart")}
                                title="Cart"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                    >
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </Badge>
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                        type="button"
                                        aria-label="User menu"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-gradient-primary text-xs text-background hover:opacity-80 transition-opacity">
                                                {user.name.split(" ").map((n) => n[0]).join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-56 bg-background border border-border shadow-lg z-50"
                                    align="end"
                                    role="menu"
                                >
                                    <figure className="flex items-center gap-2 p-2">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-gradient-primary text-xs text-background">
                                                {user.name.split(" ").map((n) => n[0]).join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <figcaption className="flex flex-col truncate">
                                            <p className="font-medium">{user.name || "User"}</p>
                                            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                        </figcaption>
                                    </figure>

                                    <DropdownMenuSeparator />

                                    <ul className="p-0 m-0 list-none">
                                        <li>
                                            <DropdownMenuItem onClick={() => navigate("/profile")} role="menuitem">
                                                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                                                Profile
                                            </DropdownMenuItem>
                                        </li>
                                        <li>
                                            <DropdownMenuItem onClick={() => navigate("/settings")} role="menuitem">
                                                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                                                Settings
                                            </DropdownMenuItem>
                                        </li>
                                    </ul>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={handleSignOut} role="menuitem">
                                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button variant="ghost" onClick={() => navigate("/auth")} type="button">
                            Sign In
                        </Button>
                    )}
                </article>
            </nav>
        </header>
    );
});
Header.displayName = "Header";

export { Header };