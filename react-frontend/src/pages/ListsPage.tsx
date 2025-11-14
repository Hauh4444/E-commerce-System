import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pen, Trash } from "lucide-react";
import { type List } from "@/api/lists.ts";
import { type Product, getProductsRequest } from "@/api/product";
import { useLists } from "@/contexts/ListsContext";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

/*
    TODO:
        - Implement delete list confirmation
        - Implement update list name functionality
        - Implement create list functionality
 */

const ListsPage = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { lists, loading, deleteList } = useLists();

    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

    useEffect(() => {
        if (lists.length === 0) return;
        const list = listId ? lists.find((l) => l.id === listId) : lists[0];
        setSelectedList(list || lists[0]);
    }, [lists, listId]);

    const fetchProductsByIds = useCallback(async (ids: string[], signal: AbortSignal) => {
        if (ids.length === 0) {
            setProducts([]);
            return;
        }

        setLoadingProducts(true);
        try {
            const data = await getProductsRequest({ ids }, { signal });
            setProducts(data);
        } finally {
            if (!signal.aborted) setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        if (!selectedList?.product_ids || selectedList.product_ids.length === 0) {
            setProducts([]);
            return;
        }

        const controller = new AbortController();
        fetchProductsByIds(selectedList.product_ids, controller.signal).catch((err) => {
            if (controller.signal.aborted) return;
            console.error(err instanceof Error ? err.message : "Error fetching products by IDs");
        });

        return () => controller.abort();
    }, [selectedList, fetchProductsByIds]);

    const handleSelectList = (list: List) => {
        setSelectedList(list);
        navigate(`/lists/${list.id}`);
    };

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">

                <Tabs
                    value={selectedList?.id || ""}
                    onValueChange={(id) => {
                        const list = lists.find((l) => l.id === id);
                        if (list) handleSelectList(list);
                    }}
                    className="w-3/4 pt-28"
                >
                    <TabsList className="w-full h-auto overflow-x-auto mb-6">
                        {loading ? (
                            <p>Loading lists...</p>
                        ) : (
                            <>
                                {lists.map((list) => (
                                    <div key={list.id} className="relative flex-1 min-w-0">
                                        <TabsTrigger
                                            value={list.id}
                                            className="w-full py-2 flex-1 text-lg font-extrabold relative"
                                        >
                                            {list.name}
                                        </TabsTrigger>

                                        {list.name !== "Wishlist" && selectedList?.id === list.id && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    className="w-9 h-9 p-2 rounded-full absolute right-12 top-1/2 -translate-y-1/2 z-10"
                                                    aria-label="Edit list"
                                                >
                                                    <Pen />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="w-9 h-9 p-2 rounded-full absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                                    onClick={() => deleteList(list.id)}
                                                    aria-label="Delete list"
                                                >
                                                    <Trash />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </TabsList>

                    {loadingProducts ? (
                        <p>Loading products...</p>
                    ) : (
                        <>
                            {lists.map((list) => (
                                <TabsContent key={list.id} value={list.id} className="mb-6">
                                    <ul className="space-y-6">
                                        {products && products.map((product) => (
                                            <li key={product.id}>
                                                <ProductCard variant="list" product={product} list={list} />
                                            </li>
                                        ))}
                                        {(!products || products.length === 0) && <p>No products in this list.</p>}
                                    </ul>
                                </TabsContent>
                            ))}
                        </>
                    )}
                </Tabs>
            </main>
        </>
    );
};

export default ListsPage;