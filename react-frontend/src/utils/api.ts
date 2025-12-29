export async function handleResponseError(response: Response, defaultErrorMessage: string) {
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = typeof errorBody.error === "string" ? errorBody.error : defaultErrorMessage;
        throw new Error(message);
    }
}
