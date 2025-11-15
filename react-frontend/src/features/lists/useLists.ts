import { useContext } from "react";

import { ListsContext } from "./ListsContext";

export const useLists = () => {
    const ctx = useContext(ListsContext);
    if (!ctx) throw new Error("useLists must be used within a ListsProvider");
    return ctx;
};