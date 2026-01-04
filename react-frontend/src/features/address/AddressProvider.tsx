import { type PropsWithChildren, useRef, useState } from "react";

import { type AddressResult, AddressContext } from "./AddressContext";

export const AddressProvider = ({ children }: PropsWithChildren) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AddressResult[]>([]);
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState(41.8781);
    const [lng, setLng] = useState(-87.6298);

    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<number | null>(null);

    const searchAddress = (value: string) => {
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = window.setTimeout(async () => {
            if (abortRef.current) abortRef.current.abort();

            if (value.length < 3) {
                setResults([]);
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
                const sorted = data.sort((a, b) => (b.place_id as any) - (a.place_id as any));
                setResults(sorted);
            } catch (err) {
                if ((err as any).name !== "AbortError") console.error(err);
            }
        }, 300);
    };

    const selectAddress = (place: AddressResult) => {
        setResults([]);
        setQuery(place.display_name);
        setAddress(place.display_name);
        setLat(parseFloat(place.lat));
        setLng(parseFloat(place.lon));
    };

    return (
        <AddressContext.Provider
            value={{ query, results, lat, lng, address, searchAddress, selectAddress, setAddress }}
        >
            {children}
        </AddressContext.Provider>
    );
};