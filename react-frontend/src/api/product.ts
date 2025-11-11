import { apiConfig } from '@/config';

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
    attributes?: Record<string, unknown>;
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

export const getProductsRequest = async (
    query?: string,
    options?: { signal?: AbortSignal }
): Promise<ProductsResponse> => {
    const url = new URL(`${apiConfig.baseUrl}${apiConfig.endpoints.products}`);
    if (query) url.searchParams.append("query", query);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
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

export const getProductByIdRequest = async (id: string): Promise<Product> => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.products}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === 'string'
                ? errorBody.error
                : 'Unable to fetch product.';
        throw new Error(message);
    }

    return await response.json() as Promise<Product>;
};

export const createProductRequest = async (
    payload: CreateProductPayload
): Promise<Product> => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.products}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === 'string'
                ? errorBody.error
                : 'Unable to create product.';
        throw new Error(message);
    }

    return await response.json() as Promise<Product>;
};

export const updateProductRequest = async (
    id: string,
    payload: Partial<CreateProductPayload>
): Promise<Product> => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.products}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === 'string'
                ? errorBody.error
                : 'Unable to update product.';
        throw new Error(message);
    }

    return await response.json() as Promise<Product>;
};

export const deleteProductRequest = async (id: string): Promise<{ deleted: boolean; product_id: string }> => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.products}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            typeof errorBody.error === 'string'
                ? errorBody.error
                : 'Unable to delete product.';
        throw new Error(message);
    }

    return await response.json();
};
