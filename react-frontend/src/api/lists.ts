import { apiConfig, baseHeaders } from "@/config";
import { handleResponseError } from "@/utils/api.ts";

export type List = {
    id: string;
    name: string;
    product_ids: string[];
    created_at?: string;
    updated_at?: string;
};

export type ListsResponse = List[];

export type CreateListPayload = {
    name: string;
};

export type UpdateListPayload = {
    name: string;
};

export const getListsRequest = async (): Promise<ListsResponse> => {
    const response = await fetch(apiConfig.lists.base, {
        method: "GET",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to fetch lists.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const createListRequest = async (
    payload: CreateListPayload
): Promise<List> => {
    const response = await fetch(apiConfig.lists.base, {
        method: "POST",
        credentials: "include",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to create list.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const updateListRequest = async (
    listId: string,
    payload: UpdateListPayload
): Promise<List> => {
    const response = await fetch(apiConfig.lists.detail(listId), {
        method: "PUT",
        credentials: "include",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to update list.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const addProductToListRequest = async (
    listId: string,
    productId: string
): Promise<List> => {
    const response = await fetch(apiConfig.lists.addProduct(listId, productId), {
        method: "POST",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to add product to list.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const removeProductFromListRequest = async (
    listId: string,
    productId: string
): Promise<List> => {
    const response = await fetch(apiConfig.lists.removeProduct(listId, productId), {
        method: "DELETE",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to remove product from list.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json();
};

export const deleteListRequest = async (
    listId: string
): Promise<void> => {
    const response = await fetch(apiConfig.lists.detail(listId), {
        method: "DELETE",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to delete list.";
    await handleResponseError(response, defaultErrorMessage);
};
