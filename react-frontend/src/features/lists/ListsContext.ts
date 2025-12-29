import { createContext } from "react";

import type { List } from "@/api/lists";

export type ListsContextValue = {
    lists: List[];
    loading: boolean;
    error: string | null;
    fetchLists: () => Promise<void>;
    createList: (name: string) => Promise<List>;
    updateList: (id: string, name: string) => Promise<List>;
    addProductToList: (listId: string, productId: string) => Promise<List>;
    removeProductFromList: (listId: string, productId: string) => Promise<List | void>;
    deleteList: (id: string) => Promise<void>;
    clearError: () => void;
};

export const ListsContext = createContext<ListsContextValue | null>(null);
