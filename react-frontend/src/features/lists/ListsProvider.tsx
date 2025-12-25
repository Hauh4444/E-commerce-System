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

import { useToast } from "@/features/toast/useToast";

export const ListsProvider = ({ children }: PropsWithChildren) => {
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();

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
            toast({ title: "Error fetching lists", description: error, variant: "destructive" });
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, [toast, error]);

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
            toast({ title: "List created", description: `${name} created successfully.` });
            return created;
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to create list");
            toast({ title: "Error creating list", description: error, variant: "destructive" });
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, [toast, error]);

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
            toast({ title: "List updated", description: `List name successfully updated to ${name}.` });
            return updated;
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to update list");
            toast({ title: "Error updating list", description: error, variant: "destructive" });
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, [toast, error]);

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
            toast({ title: "Product added", description: `Product successfully added to ${updated.name}.` });
            return updated;
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to add product to list");
            toast({ title: "Error adding product", description: error, variant: "destructive" });
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, [toast, error]);

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
            toast({ title: "Product removed", description: `Product removed from ${updated.name}.` });
            return updated;
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to remove product from list");
            toast({ title: "Error removing product", description: error, variant: "destructive" });
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, [toast, error]);

    const deleteList = useCallback(async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this list? This action cannot be undone and will permanently remove all of the list data."
        );
        if (!confirmed) return;

        setLoading(true);
        setError(null);
        try {
            const name = lists.find(l => l.id === id)?.name;
            await deleteListRequest(id);
            setLists(prev => {
                const updatedLists = prev.filter(l => l.id !== id);
                saveLists(updatedLists);
                return updatedLists;
            });
            toast({ title: "List deleted", description: `${name} deleted successfully.` });
        } catch (listsError) {
            setError(listsError instanceof Error ? listsError.message : "Unable to delete list");
            toast({ title: "Error deleting list", description: error, variant: "destructive" });
            throw listsError;
        } finally {
            setLoading(false);
        }
    }, [lists, toast, error]);

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
