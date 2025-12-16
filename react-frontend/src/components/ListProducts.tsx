import { useEffect, useState, useCallback, forwardRef, type ForwardedRef } from "react";

import { type Product } from "@/api/product";
import { type List } from "@/api/lists";
import { getProductsRequest } from "@/api/product";

import { ProductCard } from "./ProductCard";

type ListProductsProps = {
    list: List | null
};

const ListProducts = forwardRef<
    HTMLUListElement,
    ListProductsProps
>(({ list }, ref: ForwardedRef<HTMLUListElement>) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProductsByIds = useCallback(async (ids: string[], signal: AbortSignal) => {
        if (!ids.length) {
            setProducts([]);
            return;
        }
        setLoading(true);
        try {
            const data = await getProductsRequest({ ids }, { signal });
            if (!signal.aborted) setProducts(data);
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!list?.product_ids?.length) {
            setProducts([]);
            return;
        }
        const controller = new AbortController();
        fetchProductsByIds(list.product_ids, controller.signal).catch(err => {
            if (!controller.signal.aborted) console.error(err);
        });
        return () => controller.abort();
    }, [list, fetchProductsByIds]);

    if (loading) return <p>Loading products...</p>;
    if (!products.length) return <p>No products in this list.</p>;

    return (list &&
        <ul ref={ref} className="space-y-6">
            {products.map(product => (
                <li key={product.id}>
                    <ProductCard variant="list" product={product} list={list!} />
                </li>
            ))}
        </ul>
    );
});
ListProducts.displayName = "ListProducts";

export { ListProducts };