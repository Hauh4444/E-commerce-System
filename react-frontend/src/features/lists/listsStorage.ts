import { type List } from "@/api/lists";

const LISTS_STORAGE_KEY = "avento_lists";

export const loadLists = (): List[] => {
    try {
        const raw = localStorage.getItem(LISTS_STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as List[];
    } catch {
        return [];
    }
};

export const saveLists = (lists: List[]) => {
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
};