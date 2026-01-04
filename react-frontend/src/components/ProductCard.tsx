import { type ForwardedRef, forwardRef, type HTMLAttributes, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type VariantProps } from "class-variance-authority";
import { Trash, Minus, Plus } from "lucide-react";

import { type Product } from "@/api/product";
import { type List } from "@/api/lists";

import { type CartItem } from "@/features/cart/CartContext";
import { useCart } from "@/features/cart/useCart";
import { useLists } from "@/features/lists/useLists";

import { ProductStars } from "./ProductStars";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { productCardVariants } from "./ui/variants";

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

export interface CompactProductCardProps extends BaseProductCardProps {
    variant: "compact";
    product: CartItem;
    list?: never;
}

export type ProductCardProps = SearchProductCardProps | ListProductCardProps | CartProductCardProps | CompactProductCardProps;

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
    ({ variant, product, list, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
        const navigate = useNavigate();
        const { updateQuantity, addItem, removeItem } = useCart();
        const { lists, addProductToList, removeProductFromList } = useLists();

        const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, product: Product) => {
            e.preventDefault();
            if (!product) return;

            const { id, name, price, currency, images } = product;
            addItem({ id, name, price, currency, images, quantity: 1 });
        };

        const handleChangeQuantity = (id: string, quantity: number) => {
            if (quantity === 0) {
                removeItem(id);
                return;
            }
            if (quantity > 50) return;
            updateQuantity(id, quantity);
        };

        return (
            <Card className={productCardVariants({ variant })} ref={ref} {...props}>
                <CardContent
                    className={`flex justify-center items-center ${
                        variant === "compact" ? "p-2 min-w-[8rem] basis-[8rem]" : "min-w-[14rem] basis-[14rem] p-6"
                    }`}
                >
                    <Link to={`/product/${product.id}`} className="h-full w-full">
                        <figure className={`h-full flex justify-center items-center ${variant === "compact" ? "p-1" : ""}`}>
                            <img
                                src={`data:image/png;base64,${product.images[0]}`}
                                alt={`${product.name} image`}
                                className={`object-contain ${
                                    variant === "compact" ? "max-w-20 max-h-20" : "max-w-full max-h-full"
                                }`}
                            />
                            <figcaption className="sr-only">{product.name} image</figcaption>
                        </figure>
                    </Link>
                </CardContent>

                <CardContent className={`my-auto p-0 flex-1 text-left ${variant === "compact" ? "text-sm" : ""}`}>
                    <Link
                        to={`/product/${product.id}`}
                        className={`font-bold hover:text-secondary ${variant === "compact" ? "text-sm" : "text-xl"}`}
                    >
                        {product.name}
                    </Link>

                    {(variant === "search" || variant === "list") && (
                        <section className="my-1 flex items-center gap-1" aria-label="Product rating">
                            <data value={product.average_review} className="text-sm">
                                {product.average_review.toFixed(1)}
                            </data>
                            <figure className="m-0">
                                <ProductStars value={product.average_review} size={16} />
                                <figcaption className="sr-only">
                                    {product.average_review.toFixed(1)} out of 5 stars
                                </figcaption>
                            </figure>
                            <Link to={`/product/${product.id}`} className="text-sm text-primary">
                                ({product.reviews})
                            </Link>
                        </section>
                    )}

                    {variant !== "compact" && (
                        <h2 className="text-2xl text-foreground font-light">
                            ${product.price}
                        </h2>
                    )}
                </CardContent>

                {variant === "cart" && (
                    <CardContent className="min-w-[14rem] basis-[14rem] mt-auto px-10 py-6 flex items-center justify-end">
                        <Button
                            variant={product.quantity > 1 ? "ghost" : "destructive"}
                            className="w-10 h-11 py-2 pl-5 border rounded-l-full text-base hover:opacity-80 transition-opacity"
                            onClick={() => handleChangeQuantity(product.id, product.quantity - 1)}
                            title={product.quantity === 1 ? "Remove Item" : "Decrease Qty"}
                        >
                            {product.quantity === 1 ? <Trash /> : <Minus />}
                        </Button>
                        <Input
                            id={`product_quantity_${product.id}`}
                            className="w-16 h-11 p-4 border border-border rounded-none !text-base text-center opacity-80 focus-visible:opacity-100"
                            type="text"
                            value={product.quantity}
                            onChange={(e) => handleChangeQuantity(product.id, parseInt(e.target.value))}
                            required
                        />
                        <Button
                            variant="ghost"
                            className="w-10 h-11 py-2 pr-5 border rounded-r-full text-base hover:opacity-80 transition-opacity"
                            onClick={() => handleChangeQuantity(product.id, product.quantity + 1)}
                            title="Increase Qty"
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
                                    className="w-full px-6 py-2 border rounded-full text-base hover:opacity-80 transition-opacity"
                                    title="Add to list"
                                >
                                    ADD TO LIST
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit bg-background border shadow-lg z-50" align="end" role="menu">
                                {lists.length === 0 ? (
                                    <DropdownMenuItem disabled>No lists</DropdownMenuItem>
                                ) : (
                                    lists.map((item, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            className="justify-center"
                                            onClick={() => addProductToList(item.id, product.id)}
                                        >
                                            {item.name}
                                        </DropdownMenuItem>
                                    ))
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="justify-center" onClick={() => navigate("/lists")}>
                                    <Plus size={12} />&ensp;Create new list
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="secondary"
                            className="w-full px-6 py-2 rounded-full text-base hover:opacity-80 transition-opacity"
                            onClick={(e) => handleAddToCart(e, product)}
                            title="Add to cart"
                        >
                            ADD TO CART
                        </Button>
                    </CardContent>
                )}

                {variant === "list" && (
                    <>
                        <CardContent className="min-w-[11.5rem] basis-[11.5rem] pl-10 pr-0 py-6 flex flex-col items-center justify-end gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full px-6 py-2 border rounded-full text-base hover:opacity-80 transition-opacity"
                                        title="Add to list"
                                    >
                                        ADD TO LIST
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-fit bg-background border shadow-lg z-50" align="end" role="menu">
                                    {lists.length === 0 ? (
                                        <DropdownMenuItem disabled>No lists</DropdownMenuItem>
                                    ) : (
                                        lists.map((item, index) =>
                                                item.id !== list.id && (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        className="justify-center"
                                                        onClick={() => addProductToList(item.id, product.id)}
                                                    >
                                                        {item.name}
                                                    </DropdownMenuItem>
                                                )
                                        )
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="justify-center" onClick={() => navigate("/lists")}>
                                        <Plus size={12} />&ensp;Create new list
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                variant="secondary"
                                className="w-full px-6 py-2 rounded-full text-base hover:opacity-80 transition-opacity"
                                onClick={(e) => handleAddToCart(e, product)}
                                title="Add to cart"
                            >
                                ADD TO CART
                            </Button>
                        </CardContent>

                        <CardContent className="min-w-18 basis-18 px-5 py-6 flex flex-col items-center justify-center">
                            <Button
                                variant="ghost"
                                className="w-10 px-2 py-2 rounded-full text-base hover:opacity-80 transition-opacity"
                                onClick={() => removeProductFromList(list.id, product.id)}
                                title="Remove from list"
                            >
                                <Trash />
                            </Button>
                        </CardContent>
                    </>
                )}

                {variant === "compact" && (
                    <CardContent className="min-w-[6rem] basis-[6rem] p-2 pr-5 flex flex-col items-end justify-center text-right">
                        <span className="text-sm font-bold text-foreground">${product.price}</span>
                        <span className="text-xs text-muted-foreground">Qty: {product.quantity}</span>
                    </CardContent>
                )}
            </Card>
        );
    }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };