import { type PropsWithChildren, useReducer, useRef } from "react";

import { AddressContext, type AddressResult } from "./AddressContext";
import { addressReducer, initialAddressState } from "./AddressReducer";

import { useToast } from "@/features/toast/useToast.ts";

export const AddressProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(
        addressReducer,
        initialAddressState
    );

    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<number | null>(null);

    const { toast } = useToast();

    const searchAddress = (value: string) => {
        dispatch({ type: "SET_QUERY", payload: value });

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = window.setTimeout(async () => {
            if (abortRef.current) abortRef.current.abort();

            if (value.length < 3) {
                dispatch({ type: "CLEAR_RESULTS" });
                return;
            }

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
                        value
                    )}`,
                    { signal: controller.signal }
                );

                const data = (await res.json()) as AddressResult[];
                const sorted = data.sort(
                    (a, b) => Number(b.place_id) - Number(a.place_id)
                );

                dispatch({ type: "SET_RESULTS", payload: sorted });
            } catch (addressError) {
                const message = addressError instanceof Error ? addressError.message : "Unable to search for address";
                toast({ title: "Address error", description: message, variant: "destructive" });
            }
        }, 300);
    };

    const selectAddress = (place: AddressResult) => {
        dispatch({ type: "SELECT_ADDRESS", payload: place });
    };

    const setAddress = (value: string) => {
        dispatch({ type: "SET_ADDRESS", payload: value });
    };

    return (
        <AddressContext.Provider
            value={{
                ...state,
                searchAddress,
                selectAddress,
                setAddress,
            }}
        >
            {children}
        </AddressContext.Provider>
    );
};