import { createContext } from "react";

export interface AddressResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

export interface AddressState {
    query: string;
    results: AddressResult[];
    address: string;
    lat: number;
    lng: number;
}

export interface AddressContextValue extends AddressState {
    searchAddress: (value: string) => void;
    selectAddress: (place: AddressResult) => void;
    setAddress: (value: string) => void;
}

export const AddressContext = createContext<AddressContextValue | null>(null);