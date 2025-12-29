import { type MouseEvent, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { type Product, type ProductReview, getProductByIdRequest, getProductReviewsRequest } from "@/api/product";

import { useCart } from "@/features/cart/useCart";

import { Header } from "@/components/Header";
import { ProductStars } from "@/components/ProductStars";
import { Button } from "@/components/ui/button";

const ProductPage = () => {
    const { productId } = useParams();
    const { addItem } = useCart();

    const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
    const [loadingProductReviews, setLoadingProductReviews] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [productReviews, setProductReviews] = useState<ProductReview[]>([]);

    const reviewsRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoadingProduct(true);

            try {
                const data = await getProductByIdRequest(productId);
                setProduct(data);
            } finally {
                setLoadingProduct(false);
            }
        };

        const fetchProductReviews = async () => {
            setLoadingProductReviews(true);

            try {
                const data = await getProductReviewsRequest(productId);
                setProductReviews(data);
            } finally {
                setLoadingProductReviews(false);
            }
        }

        fetchProduct().catch((productError) => {
            console.error(productError instanceof Error ? productError.message : "Error fetching product.")
        });

        fetchProductReviews().catch((productReviewsError) => {
            console.error(productReviewsError instanceof Error ? productReviewsError.message : "Error fetching product reviews.")
        });
    }, [productId]);

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!product) return;

        const { id, name, price, currency, images } = product;
        addItem({ id, name, price, currency, images, quantity: 1 });
    }

    const handleScrollToReviews = () => {
        if (!reviewsRef.current) return;

        const headerOffset = 80;
        const elementPosition = reviewsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    return (
        <>
            <Header />
            <main className="w-full bg-gradient-subtle flex flex-col items-center justify-start">
                {loadingProduct ? (
                    <h2 className="my-8 text-2xl font-bold">Loading product...</h2>
                ) : (product && (
                    <>
                        <article className="w-full h-[calc(100svh-160px)] flex items-center justify-center border-b-2">
                            <header className="h-3/5 basis-1/3 px-12 flex flex-col justify-center">
                                <h1 className="text-left text-3xl font-extrabold">
                                    {product.name}
                                </h1>

                                <section className="mt-2 flex items-center gap-1" aria-label="Product rating">
                                    <data value={product.average_review} className="text-sm">
                                        {product.average_review.toFixed(1)}
                                    </data>
                                    <figure className="mt-[-1px] mb-0" onClick={handleScrollToReviews}>
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

                        <article className="w-full flex items-stretch justify-center border-b-2">
                            <section className="p-16 flex-1 basis-[50%] border-r">
                                <table>
                                    <tbody>
                                        {Object.entries(product.attributes).map(([key, value], index) => (
                                            <tr key={index} className="text-lg text-left">
                                                <th className="pr-4 py-1 align-top">
                                                    {key.split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")}
                                                </th>
                                                <td className="pl-4 py-1 align-top">
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

                        <article className="w-full flex items-stretch justify-center border-b-2" ref={reviewsRef}>
                            <ul className="p-16 flex flex-col basis-[50%] gap-4 border-r">
                                {loadingProductReviews ? (
                                    <h2 className="my-8 text-2xl font-bold">Loading product reviews...</h2>
                                ) : (productReviews && productReviews.map((review, index) => (
                                    <li key={index} className="w-full">
                                        <span className="flex items-center">
                                            <figure className="h-fit m-0">
                                                <ProductStars value={review.rating} size={20} />
                                                <figcaption className="sr-only">
                                                    {product.average_review.toFixed(1)} out of 5 stars
                                                </figcaption>
                                            </figure>
                                            <h2 className="w-fit ml-4 text-2xl font-bold">
                                                {review.title}
                                            </h2>
                                        </span>
                                        <h3 className="w-fit text-base text-muted-foreground font-light">
                                            {review.created_at && new Date(review.created_at).toLocaleString(undefined, {
                                                weekday: "long",
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}
                                        </h3>
                                        <p className="mt-2 text-left text-lg">
                                            {review.description}
                                        </p>
                                    </li>
                                )))}
                            </ul>

                            <section className="p-16 basis-[50%] border-l">

                            </section>
                        </article>
                    </>
                ))}
            </main>
        </>
    );
};

export default ProductPage;

