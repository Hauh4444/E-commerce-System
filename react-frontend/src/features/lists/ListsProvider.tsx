import { useState, useCallback, useMemo, useEffect, type PropsWithChildren } from "react";

import {
    getListsRequest,
    createListRequest,
    updateListRequest,
    addProductToListRequest,
    removeProductFromListRequest,
    deleteListRequest,
    type List,
    type ListsResponse,
} from "@/api/lists";

import { ListsContext, type ListsContextValue } from "./ListsContext";
import { loadLists, saveLists } from "./listsStorage";

export const ListsProvider = ({ children }: PropsWithChildren) => {
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const stored = loadLists();
        if (stored) setLists(stored);
    }, []);

    const fetchLists = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data: ListsResponse = await getListsRequest();
            setLists(data);
            saveLists(data);
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to fetch lists");
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, []);

    const createList = useCallback(async (name: string) => {
        setLoading(true);
        setError(null);
        try {
            const created: List = await createListRequest({ name });
            setLists(prev => {
                const updated = [...prev, created];
                saveLists(updated);
                return updated;
            });
            return created;
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to create list");
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateList = useCallback(async (id: string, name: string) => {
        setLoading(true);
        setError(null);
        try {
            const updated: List = await updateListRequest(id, { name });
            setLists(prev => {
                const updatedLists = prev.map(l => (l.id === id ? updated : l));
                saveLists(updatedLists);
                return updatedLists;
            });
            return updated;
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to update list");
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, []);

    const addProductToList = useCallback(async (listId: string, productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const updated: List = await addProductToListRequest(listId, productId);
            setLists(prev => {
                const updatedLists = prev.map(l => (l.id === listId ? updated : l));
                saveLists(updatedLists);
                return updatedLists;
            });
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to add product to list");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeProductFromList = useCallback(async (listId: string, productId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove product from this list? This action cannot be undone."
        );
        if (!confirmed) return;

        setLoading(true);
        setError(null);
        try {
            const updated: List = await removeProductFromListRequest(listId, productId);
            setLists(prev => {
                const updatedLists = prev.map(l => (l.id === listId ? updated : l));
                saveLists(updatedLists);
                return updatedLists;
            });
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to remove product from list");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteList = useCallback(async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this list? This action cannot be undone and will permanently remove all of the list data."
        );
        if (!confirmed) return;

        setLoading(true);
        setError(null);
        try {
            await deleteListRequest(id);
            setLists(prev => {
                const updatedLists = prev.filter(l => l.id !== id);
                saveLists(updatedLists);
                return updatedLists;
            });
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to delete list");
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const value: ListsContextValue = useMemo(() => ({
        lists,
        loading,
        error,
        fetchLists,
        createList,
        updateList,
        addProductToList,
        removeProductFromList,
        deleteList,
        clearError,
    }), [lists, loading, error, fetchLists, createList, updateList, addProductToList, removeProductFromList, deleteList, clearError]);

    return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
};
