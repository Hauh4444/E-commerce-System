import { createContext } from "react";

export interface AddressResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

export interface AddressContextValue {
    query: string;
    results: AddressResult[];
    lat: number;
    lng: number;
    address: string;
    searchAddress: (value: string) => void;
    selectAddress: (place: AddressResult) => void;
    setAddress: (value: string) => void;
}

export const AddressContext = createContext<AddressContextValue | null>(null);