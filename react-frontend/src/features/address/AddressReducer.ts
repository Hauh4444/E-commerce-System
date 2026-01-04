import { type AddressResult, type AddressState } from "./AddressContext";

export type AddressAction =
    | { type: "SET_QUERY"; payload: string }
    | { type: "SET_RESULTS"; payload: AddressResult[] }
    | { type: "CLEAR_RESULTS" }
    | { type: "SET_ADDRESS"; payload: string }
    | { type: "SELECT_ADDRESS"; payload: AddressResult };

export const initialAddressState: AddressState = {
    query: "",
    results: [],
    address: "",
    lat: 41.8781,
    lng: -87.6298,
};

export function addressReducer(
    state: AddressState,
    action: AddressAction
): AddressState {
    switch (action.type) {
        case "SET_QUERY":
            return { ...state, query: action.payload };
        case "SET_RESULTS":
            return { ...state, results: action.payload };
        case "CLEAR_RESULTS":
            return { ...state, results: [] };
        case "SET_ADDRESS":
            return { ...state, address: action.payload };
        case "SELECT_ADDRESS":
            return {
                ...state,
                query: action.payload.display_name,
                address: action.payload.display_name,
                lat: parseFloat(action.payload.lat),
                lng: parseFloat(action.payload.lon),
                results: [],
            };
        default:
            return state;
    }
}