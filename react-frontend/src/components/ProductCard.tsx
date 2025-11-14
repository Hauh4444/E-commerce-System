import { type ForwardedRef, forwardRef, type HTMLAttributes, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { Trash, Minus, Plus } from "lucide-react";
import { type Product } from "@/api/product";
import { type CartItem, useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/StarRating";

const productCardVariants = cva("h-56 flex border rounded-md overflow-hidden", {
    variants: {
        variant: {
            cart: "flex-row",
            search: "flex-row",
        },
    },
    defaultVariants: {
        variant: "search",
    },
});

interface BaseProductCardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof productCardVariants> {}

export interface CartProductCardProps extends BaseProductCardProps {
    variant: "cart";
    product: CartItem;
}

export interface SearchProductCardProps extends BaseProductCardProps {
    variant?: "search";
    product: Product;
}

export type ProductCardProps = CartProductCardProps | SearchProductCardProps;

const ProductCard = forwardRef<
    HTMLDivElement,
    ProductCardProps
>(({ className, variant, product, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
        const { updateQuantity, addItem, removeItem } = useCart();

        const handleAddToList = (e: MouseEvent<HTMLButtonElement>, product: Product) => {
            e.preventDefault();
            return product;
        }

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
                {variant === "cart" && product && (
                    <>
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
                            <h2 className="text-2xl text-foreground font-light">
                                ${product.price}
                            </h2>
                        </CardHeader>

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
                                placeholder="Search"
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
                    </>
                )}

                {variant === "search" && product && (
                    <>
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

                            <section className="my-1 flex items-center gap-1" aria-label={`Product rating`}>
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

                            <h2 className="text-2xl text-foreground font-light">
                                ${product.price}
                            </h2>
                        </CardHeader>

                        <CardContent className="min-w-[14rem] basis-[14rem] px-10 py-6 flex flex-col items-center justify-end gap-2">
                            <Button
                                variant="ghost"
                                className="w-full px-6 py-2 border-2 rounded-full text-base hover:opacity-80 transition-opacity"
                                onClick={(e) => handleAddToList(e, product)}
                                type="button"
                            >
                                ADD TO LIST
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
                    </>
                )}
            </Card>
        );
    }
);
ProductCard.displayName = "ProductCard";

export { ProductCard, productCardVariants };
