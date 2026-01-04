import { forwardRef, type HTMLAttributes, type ForwardedRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Settings, User, LogOut, List, ShoppingCart } from "lucide-react";

import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { cn } from "@/utils/cn";

export type HeaderProps = HTMLAttributes<HTMLElement>

const Header = forwardRef<
    HTMLElement,
    HeaderProps
>((props, ref: ForwardedRef<HTMLElement>) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (!query) return;

        navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }

    const handleSignOut = async () => {
        logout();
        navigate("/");
    };

    return (
        <header
            ref={ref}
            className={cn(
                "sticky top-0 z-[999999] w-full border-b-2 bg-header-background backdrop-blur-xl shadow-header-shadow supports-[backdrop-filter]:header-background",
                props.className
            )}
            {...props}
        >
            <nav className="h-[var(--header-height)] flex items-center justify-between px-8" aria-label="Main navigation">
                <span className="w-1/4 flex">
                    <Link
                        to="/"
                        className="w-fit hover:opacity-80 transition-opacity"
                    >
                        <h1 className="text-3xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                            Avento
                        </h1>
                    </Link>
                </span>

                <span className="flex grow relative">
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
                        className="w-11 h-11 p-4 rounded-full absolute right-0"
                        onClick={handleSearch}
                        title="Search"
                    >
                        <Search />
                    </Button>
                </span>

                <ul className="w-1/4 flex justify-end gap-4">
                    {user ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                                onClick={() => navigate("/lists")}
                                title="Lists"
                            >
                                <List className="h-5 w-5" />
                            </Button>

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
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </Badge>
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="ml-2 relative h-10 w-10 rounded-full"
                                        title="Account"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-gradient-primary text-xs text-white hover:opacity-80 transition-opacity">
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
                                            <AvatarFallback className="bg-gradient-primary text-xs text-white">
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
                                            <DropdownMenuItem onClick={() => navigate("/account")} role="menuitem">
                                                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                                                Account
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
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/auth")}
                            title="Sign In"
                        >
                            Sign In
                        </Button>
                    )}
                </ul>
            </nav>
        </header>
    );
});
Header.displayName = "Header";

export { Header };