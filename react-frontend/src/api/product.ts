import { apiConfig, baseHeaders } from "@/config";
import { handleResponseError } from "@/utils/api";

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

export type ProductReview = {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    title: string;
    description: string;
    created_at?: string;
}

export type ProductsRequestByQuery = {
    query: string;
    ids?: never;
};

export type ProductsRequestByIds = {
    ids: string[];
    query?: never;
};

export type ProductsRequestParams = ProductsRequestByQuery | ProductsRequestByIds;

export type ProductReviewsResponse = ProductReview[];

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
    const defaultErrorMessage = "Unable to fetch products.";
    await handleResponseError(response, defaultErrorMessage);

    return (await response.json()) as ProductsResponse;
};

export const getProductByIdRequest = async (
    productId: string
): Promise<Product> => {
    const response = await fetch(apiConfig.products.detail(productId), {
        method: "GET",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to fetch product.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json() as Promise<Product>;
};

export const getProductReviewsRequest = async (
    productId: string
): Promise<ProductReviewsResponse> => {
    const response = await fetch(apiConfig.products.reviews.list(productId), {
        method: "GET",
        headers: baseHeaders(),
    })
    const defaultErrorMessage = "Unable to fetch product reviews.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json() as Promise<ProductReviewsResponse>;
}

export const createProductRequest = async (
    payload: CreateProductPayload
): Promise<Product> => {
    const response = await fetch(apiConfig.products.base, {
        method: "POST",
        credentials: "include",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to create product.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json() as Promise<Product>;
};

export const updateProductRequest = async (
    productId: string,
    payload: Partial<CreateProductPayload>
): Promise<Product> => {
    const response = await fetch(apiConfig.products.detail(productId), {
        method: "PUT",
        credentials: "include",
        headers: baseHeaders(),
        body: JSON.stringify(payload),
    });
    const defaultErrorMessage = "Unable to update product.";
    await handleResponseError(response, defaultErrorMessage);

    return await response.json() as Promise<Product>;
};

export const deleteProductRequest = async (
    productId: string
): Promise<void> => {
    const response = await fetch(apiConfig.products.detail(productId), {
        method: "DELETE",
        credentials: "include",
        headers: baseHeaders(),
    });
    const defaultErrorMessage = "Unable to delete product.";
    await handleResponseError(response, defaultErrorMessage);
};
