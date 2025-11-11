import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { type Product, getProductByIdRequest } from "@/api/product";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const ProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);

            try {
                const data = await getProductByIdRequest(productId);
                setProduct(data);
            } catch (productError) {
                toast({
                    title: "Error",
                    description: productError instanceof Error ? productError.message : "Error fetching product",
                    variant: "destructive",
                });
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [navigate, productId, toast]);

    return (
        <>
            <Header />
            {loading && <h2 className="text-2xl font-bold">Loading product...</h2>}
            {product && (
                <main className="bg-gradient-subtle flex flex-col items-center justify-start">
                    <article className="w-full h-[calc(100svh-160px)] flex items-center justify-center border-b-2">
                        <header className="h-3/5 basis-1/3 px-12 flex flex-col justify-center">
                            <h1 className="mb-6 text-left text-3xl font-extrabold">
                                {product.name}
                            </h1>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl">
                                    ${product.price}
                                </h2>
                                <Button variant="secondary" className="px-8 py-6 text-2xl hover:opacity-80 transition-opacity">
                                    ADD TO CART
                                </Button>
                            </div>
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
                </main>
            )}
        </>
    );
};

export default ProductPage;

