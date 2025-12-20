import { type MouseEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { type Product, getProductByIdRequest } from "@/api/product";

import { type CartItem } from "@/features/cart/CartContext";
import { useCart } from "@/features/cart/useCart";

import { Header } from "@/components/Header";
import { ProductStars } from "@/components/ProductStars.tsx";
import { Button } from "@/components/ui/button";

const ProductPage = () => {
    const { productId } = useParams();
    const { addItem } = useCart();

    const [loading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);

            try {
                const data = await getProductByIdRequest(productId);
                setProduct(data);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct().catch((productError) => {
            console.error(productError instanceof Error ? productError.message : "Error fetching product")
        });
    }, [productId]);

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
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

    return (
        <>
            <Header />
            <main className="w-full bg-gradient-subtle flex flex-col items-center justify-start">
                {loading ? (
                    <h2 className="text-2xl font-bold">Loading product...</h2>
                ) : (
                    <>
                        {product && (
                            <>
                                <article className="w-full h-[calc(100svh-160px)] flex items-center justify-center border-b-2">
                                    <header className="h-3/5 basis-1/3 px-12 flex flex-col justify-center">
                                        <h1 className="text-left text-3xl font-extrabold">
                                            {product.name}
                                        </h1>

                                        <section className="mt-2 flex items-center gap-1" aria-label={`Product rating`}>
                                            <data value={product.average_review} className="text-sm">
                                                {product.average_review.toFixed(1)}
                                            </data>
                                            <figure className="m-0">
                                                <ProductStars value={product.average_review} size={16} />
                                                <figcaption className="sr-only">
                                                    {product.average_review.toFixed(1)} out of 5 stars
                                                </figcaption>
                                            </figure>
                                            <small className="text-sm text-primary">
                                                ({product.reviews})
                                            </small>
                                        </section>

                                        <section className="flex items-center justify-between">
                                            <h2 className="text-2xl font-light">
                                                ${product.price}
                                            </h2>
                                            <Button
                                                variant="secondary"
                                                className="px-6 py-2 text-xl hover:opacity-80 transition-opacity"
                                                onClick={handleAddToCart}
                                                title="Add to cart"
                                            >
                                                ADD TO CART
                                            </Button>
                                        </section>
                                    </header>

                                    <figure className="h-3/5 basis-1/3 flex justify-center align-center">
                                        <img
                                            src={`data:image/png;base64,${product.images[0]}`}
                                            alt=""
                                            className="max-w-full max-h-full object-contain"
                                        />
                                        <figcaption className="sr-only">{product.name} image</figcaption>
                                    </figure>

                                    <section className="h-3/5 basis-1/3 px-12 flex flex-col justify-center">
                                        <h1 className="mb-6 text-left text-3xl font-extrabold">
                                            Description:
                                        </h1>
                                        {Array.isArray(product.short_description) ? (
                                            <ul className="list-disc pl-5 text-left text-lg">
                                                {product.short_description.map((desc, index) => (
                                                    <li key={index}>{desc}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <h3 className="text-left text-xl">
                                                {product.short_description}
                                            </h3>
                                        )}
                                    </section>
                                </article>

                                <article className="w-full  flex items-start justify-center border-b-2">
                                    <section className="p-16 basis-[50%] border-r">
                                        <table>
                                            <tbody>
                                                {Object.entries(product.attributes).map(([key, value], index) => (
                                                    <tr key={index} className="text-lg text-left">
                                                        <th className="px-4 py-1 align-top">
                                                            {key.split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")}
                                                        </th>
                                                        <td className="px-4 py-1 align-top">
                                                            {value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>

                                    <section className="p-16 basis-[50%] border-l">
                                        <h3 className="mb-4 text-left text-xl font-extrabold">
                                            About this item:
                                        </h3>
                                        {Array.isArray(product.description) ? (
                                            <ul className="list-disc pl-5 text-left text-lg">
                                                {product.description.map((desc, index) => (
                                                    <li
                                                        className="my-1"
                                                        key={index}
                                                    >
                                                        {desc}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <h3 className="text-left text-xl">
                                                {product.description}
                                            </h3>
                                        )}
                                    </section>
                                </article>
                            </>
                        )}
                    </>
                )}
            </main>
        </>
    );
};

export default ProductPage;

