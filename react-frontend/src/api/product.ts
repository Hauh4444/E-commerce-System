import { apiConfig, baseHeaders } from "@/config";
import { authHeaders } from "@/api/auth";

export type Product = {
    id: string;
    name: string;
    description: string | string[];
    short_description: string | string[];
    price: number;
    currency: string;
    inventory: number;
    category: string;
    images: string[];
    attributes: Record<string, string>;
    average_review: number;
    reviews: number;
    created_at?: string;
    updated_at?: string;
};

export type ProductsResponse = Product[];

export type CreateProductPayload = {
    name: string;
    description?: string;
    price: number;
    currency: string;
    inventory?: number;
    category?: string;
    images?: string[];
    attributes?: Record<string, unknown>;
};

export type ProductsRequestByQuery = {
    query: string;
    ids?: never;
};

export type ProductsRequestByIds = {
    ids: string[];
    query?: never;
};

export type ProductsRequestParams = ProductsRequestByQuery | ProductsRequestByIds;

export const getProductsRequest = async (
    params: ProductsRequestParams,
    options?: { signal?: AbortSignal }
): Promise<ProductsResponse> => {
    const url = new URL(apiConfig.products.base);

    if ("ids" in params) {
        const ids = params.ids ?? [];
        if (ids.length === 0) return [];
        url.searchParams.append("ids", ids.join(","));
    } else if ("query" in params) {
        url.searchParams.append("query", params.query);
    } else {
        throw new Error("Must provide either 'query' or 'ids'");
    }

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: baseHeaders(),
        signal: options?.signal,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to fetch products.";
        throw new Error(message);
    }

    return (await response.json()) as ProductsResponse;
};

export const getProductByIdRequest = async (
    productId: string
): Promise<Product> => {
    const response = await fetch(apiConfig.products.detail(productId), {
        method: "GET",
        headers: baseHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to fetch product.";
        throw new Error(message);
    }

    return await response.json() as Promise<Product>;
};

export const createProductRequest = async (
    payload: CreateProductPayload
): Promise<Product> => {
    const response = await fetch(apiConfig.products.base, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to create product.";
        throw new Error(message);
    }

    return await response.json() as Promise<Product>;
};

export const updateProductRequest = async (
    productId: string,
    payload: Partial<CreateProductPayload>
): Promise<Product> => {
    const response = await fetch(apiConfig.products.detail(productId), {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to update product.";
        throw new Error(message);
    }

    return await response.json() as Promise<Product>;
};

export const deleteProductRequest = async (
    productId: string
): Promise<{ deleted: boolean; product_id: string }> => {
    const response = await fetch(apiConfig.products.detail(productId), {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === "string"
                ? errorBody.error
                : "Unable to delete product.";
        throw new Error(message);
    }

    return await response.json();
};
