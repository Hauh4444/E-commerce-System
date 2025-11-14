import { type ForwardedRef, forwardRef, type HTMLAttributes, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type VariantProps } from "class-variance-authority";
import { Trash, Minus, Plus } from "lucide-react";
import { type Product } from "@/api/product";
import { type List } from "@/api/lists";
import { type CartItem, useCart } from "@/contexts/CartContext";
import { useLists } from "@/contexts/ListsContext.ts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/StarRating";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { productCardVariants } from "./ui/variants/ProductCard";

interface BaseProductCardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof productCardVariants> {}

export interface SearchProductCardProps extends BaseProductCardProps {
    variant?: "search";
    product: Product;
    list?: never;
}

export interface ListProductCardProps extends BaseProductCardProps {
    variant: "list";
    product: Product;
    list: List;
}

export interface CartProductCardProps extends BaseProductCardProps {
    variant: "cart";
    product: CartItem;
    list?: never;
}

export type ProductCardProps = SearchProductCardProps | ListProductCardProps | CartProductCardProps;

const ProductCard = forwardRef<
    HTMLDivElement,
    ProductCardProps
>(({ className, variant, product, list, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
    const navigate = useNavigate();

    const { updateQuantity, addItem, removeItem } = useCart();
    const { lists, addProductToList, removeProductFromList } = useLists();

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, product: Product) => {
        e.preventDefault();

        if (product) {
            const cartItem: CartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                quantity: 1,
                images: product.images,
            };
            addItem(cartItem);
        }
    }

    const handleChangeQuantity = (id: string, quantity: number) => {
        if (quantity > 50) return;
        if (quantity === 0) {
            removeItem(id);
            return;
        }
        updateQuantity(id, quantity);
    }

    return (
        <Card className={cn(productCardVariants({ variant, className }))} ref={ref} {...props}>
            <CardContent className="min-w-[14rem] basis-[14rem] p-6 flex justify-center items-center">
                <Link to={`/product/${product.id}`} className="h-full w-full">
                    <figure className="h-full flex justify-center items-center">
                        <img
                            src={`data:image/png;base64,${product.images[0]}`}
                            alt={`${product.name} image`}
                            className="max-w-full max-h-full object-contain"
                        />
                        <figcaption className="sr-only">{product.name} image</figcaption>
                    </figure>
                </Link>
            </CardContent>

            <CardHeader className="flex-1 my-auto p-0 text-left">
                <Link to={`/product/${product.id}`} className="text-xl font-bold hover:text-secondary">
                    {product.name}
                </Link>

                {variant === "search" || variant === "list" && (
                    <section className="my-1 flex items-center gap-1" aria-label="Product rating">
                        <data value={product.average_review} className="text-sm">
                            {product.average_review.toFixed(1)}
                        </data>
                        <figure className="m-0">
                            <StarRating value={product.average_review} size={16} />
                            <figcaption className="sr-only">
                                {product.average_review.toFixed(1)} out of 5 stars
                            </figcaption>
                        </figure>
                        <Link to={`/product/${product.id}`} className="text-sm text-primary">
                            ({product.reviews})
                        </Link>
                    </section>
                )}

                <h2 className="text-2xl text-foreground font-light">
                    ${product.price}
                </h2>
            </CardHeader>

            {variant === "cart" && (
                <CardContent className="min-w-[14rem] basis-[14rem] mt-auto px-10 py-6 flex items-center justify-end">
                    <Button
                        variant={product.quantity > 1 ? "ghost" : "destructive"}
                        className="w-10 h-11 py-2 pl-5 border rounded-l-full text-base hover:opacity-80 transition-opacity"
                        onClick={() => handleChangeQuantity(product.id, product.quantity - 1)}
                        type="button"
                    >
                        {product.quantity === 1 ? <Trash /> : <Minus />}
                    </Button>
                    <Input
                        id={`product_quantity_${product.id}`}
                        className="w-16 h-11 p-4 border-border rounded-none !text-base text-center opacity-80 focus-visible:opacity-100"
                        type="text"
                        value={product.quantity}
                        onChange={(e) => handleChangeQuantity(product.id, parseInt(e.target.value))}
                        required
                    />
                    <Button
                        variant="ghost"
                        className="w-10 h-11 py-2 pr-5 border rounded-r-full text-base hover:opacity-80 transition-opacity"
                        onClick={() => handleChangeQuantity(product.id, product.quantity + 1)}
                        type="button"
                    >
                        <Plus />
                    </Button>
                </CardContent>
            )}

            {variant === "search" && (
                <CardContent className="min-w-[14rem] basis-[14rem] px-10 py-6 flex flex-col items-center justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full px-6 py-2 border-2 rounded-full text-base hover:opacity-80 transition-opacity"
                                type="button"
                            >
                                ADD TO LIST
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-fit bg-background border border-border shadow-lg z-50"
                            align="end"
                            role="menu"
                        >
                            {lists.length === 0 ? (
                                <DropdownMenuItem disabled>No lists</DropdownMenuItem>
                            ) : (
                                lists.map((list) => (
                                    <DropdownMenuItem key={list.id} className="justify-center" onClick={() => addProductToList(list.id, product.id)}>
                                        {list.name}
                                    </DropdownMenuItem>
                                ))
                            )}
                            <DropdownMenuSeparator />
                            {/* TODO: Implement proper create new list functionality */}
                            <DropdownMenuItem className="justify-center" onClick={() => navigate("/lists")}>
                                <Plus size={12} />&ensp;Create new list
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="secondary"
                        className="w-full px-6 py-2 rounded-full text-base hover:opacity-80 transition-opacity"
                        onClick={(e) => handleAddToCart(e, product)}
                        type="button"
                    >
                        ADD TO CART
                    </Button>
                </CardContent>
            )}

            {variant === "list" && (
                <CardContent className="min-w-[14rem] basis-[14rem] px-10 py-6 flex flex-col items-center justify-end gap-2">
                    <Button
                        variant="destructive"
                        className="w-full px-6 py-2 border-2 rounded-full text-base hover:opacity-80 transition-opacity"
                        onClick={() => removeProductFromList(list.id, product.id)}
                        type="button"
                    >
                        REMOVE
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-full px-6 py-2 rounded-full text-base hover:opacity-80 transition-opacity"
                        onClick={(e) => handleAddToCart(e, product)}
                        type="button"
                    >
                        ADD TO CART
                    </Button>
                </CardContent>
            )}
        </Card>
    );
});
ProductCard.displayName = "ProductCard";

export { ProductCard };
