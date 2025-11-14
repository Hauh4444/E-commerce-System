import { apiConfig } from "@/config";
import { loadAuth } from "@/utils/authStorage";

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


const authHeaders = () => {
    const auth = loadAuth();
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth?.token ? `Bearer ${auth.token}` : "",
    };
};

export const getListsRequest = async (): Promise<ListsResponse> => {
    const response = await fetch(
        `${apiConfig.baseUrl}${apiConfig.endpoints.lists}`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string" ? body.error : "Unable to fetch lists.";
        throw new Error(msg);
    }

    return await response.json();
};

export const createListRequest = async (
    payload: CreateListPayload
): Promise<List> => {
    const response = await fetch(
        `${apiConfig.baseUrl}${apiConfig.endpoints.lists}`,
        {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string" ? body.error : "Unable to create list.";
        throw new Error(msg);
    }

    return await response.json();
};

export const updateListRequest = async (
    id: string,
    payload: UpdateListPayload
): Promise<List> => {
    const response = await fetch(
        `${apiConfig.baseUrl}${apiConfig.endpoints.lists}/${id}`,
        {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string" ? body.error : "Unable to update list.";
        throw new Error(msg);
    }

    return await response.json();
};

export const addProductToListRequest = async (
    listId: string,
    productId: string
): Promise<List> => {
    const response = await fetch(
        `${apiConfig.baseUrl}${apiConfig.endpoints.lists}/${listId}/product/${productId}`,
        {
            method: "POST",
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string"
                ? body.error
                : "Unable to add product to list.";
        throw new Error(msg);
    }

    return await response.json();
};

export const removeProductFromListRequest = async (
    listId: string,
    productId: string
): Promise<List> => {
    const response = await fetch(
        `${apiConfig.baseUrl}${apiConfig.endpoints.lists}/${listId}/product/${productId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string"
                ? body.error
                : "Unable to remove product from list.";
        throw new Error(msg);
    }

    return await response.json();
};

export const deleteListRequest = async (
    id: string
): Promise<void> => {
    const response = await fetch(
        `${apiConfig.baseUrl}${apiConfig.endpoints.lists}/${id}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
            typeof body.error === "string" ? body.error : "Unable to delete list.";
        throw new Error(msg);
    }
};
