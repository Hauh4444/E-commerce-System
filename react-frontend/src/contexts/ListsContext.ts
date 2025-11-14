import { createContext, useContext } from "react";
import type { List } from "@/api/lists";

export type ListsContextValue = {
    lists: List[];
    loading: boolean;
    error: string | null;

    fetchLists: () => Promise<void>;
    createList: (name: string) => Promise<void>;
    updateList: (id: string, name: string) => Promise<void>;
    addProductToList: (listId: string, productId: string) => Promise<List>;
    removeProductFromList: (listId: string, productId: string) => Promise<List>;
    deleteList: (id: string) => Promise<void>;
    clearError: () => void;
};

export const ListsContext = createContext<ListsContextValue | null>(null);

export const useLists = () => {
    const ctx = useContext(ListsContext);
    if (!ctx) throw new Error("useLists must be used within a ListsProvider");
    return ctx;
};
