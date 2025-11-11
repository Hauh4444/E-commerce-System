import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { type Product, getProductsRequest } from "@/api/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[] | null>(null);

    const fetchProducts = useCallback(async (query: string, signal: AbortSignal) => {
        if (!query) {
            setProducts([]);
            return;
        }

        setLoading(true);

        try {
            const data = await getProductsRequest(query, { signal });
            setProducts(data);
        } catch (productError) {
            if (signal.aborted) return;
            console.error(productError instanceof Error ? productError.message : "Error fetching products");
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts(query, controller.signal);

        return () => controller.abort();
    }, [query, fetchProducts]);

    return (
        <>
            <Header />
            {loading && <h2 className="text-2xl font-bold">Loading products...</h2>}
            {products && (
                <main className="">
                    <ul className="w-3/4 mt-6 mx-auto space-y-6">
                        {products.map((product) => (
                            <li key={product.id}>
                                <Card className="h-56 flex">
                                    <CardHeader className="min-w-[14rem] basis-[14rem] flex justify-center items-center">
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
                                    </CardHeader>

                                    <CardContent className="flex-1 my-auto p-0 text-left">
                                        <Link to={`/product/${product.id}`}>
                                            <CardTitle className="mb-2 text-xl hover:text-secondary">
                                                {product.name}
                                            </CardTitle>
                                        </Link>
                                        <CardDescription className="text-lg">
                                            ${product.price}
                                        </CardDescription>
                                    </CardContent>

                                    <CardContent className="min-w-[14rem] basis-[14rem] p-6 flex flex-col items-center justify-end">
                                        <Button
                                            variant="secondary"
                                            className="px-6 py-2 rounded-full text-base hover:opacity-80 transition-opacity"
                                        >
                                            ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                    </ul>
                </main>
            )}
        </>
    );
};

export default SearchPage;

