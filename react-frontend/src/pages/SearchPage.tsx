import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type Product, getProductsRequest } from "@/api/product";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[] | null>(null);

    const fetchProducts = useCallback(async (query: string, signal: AbortSignal) => {
        if (!query) {
            setProducts([]);
            return;
        }

        setLoading(true);

        try {
            const data = await getProductsRequest({ query }, { signal });
            setProducts(data);
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts(query, controller.signal).catch((productsError) => {
            if (controller.signal.aborted) return;
            console.error(productsError instanceof Error ? productsError.message : "Error fetching products");
        });

        return () => controller.abort();
    }, [query, fetchProducts]);

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <ul className="w-3/4 mt-20 mb-8 space-y-6">
                    <li className="mt-6 pl-4 text-xl text-left">
                        {products ? products.length : 0} result{products && products.length != 1 && 's'} for '{query}':
                    </li>
                    {loading ? (
                        <h2 className="text-2xl font-bold">Loading products...</h2>
                    ) : (
                        <>
                            {products && products.map((product) => (
                                <li key={product.id}>
                                    <ProductCard variant="search" product={product} />
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </main>
        </>
    );
};

export default SearchPage;

