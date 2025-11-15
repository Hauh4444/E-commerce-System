import { useState, useEffect, type KeyboardEvent, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { type List } from "@/api/lists.ts";

import { useLists } from "./useLists";

export const useSelectedList = (lists: List[]) => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { createList, updateList, deleteList } = useLists();

    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [mode, setMode] = useState<"view" | "edit" | "create">("view");
    const [tempName, setTempName] = useState("");

    useEffect(() => {
        if (!lists.length) return;
        const list = listId ? lists.find(l => l.id === listId) : lists[0];
        setSelectedList(list || lists[0]);
    }, [lists, listId]);

    useEffect(() => {
        if (mode === "edit" && selectedList) setTempName(selectedList.name);
    }, [selectedList, mode]);

    const resetUI = () => {
        setMode("view");
        setTempName("");
        setSelectedList(lists[0] || null);
    };

    const handleSubmitName = async (e?: KeyboardEvent | MouseEvent | null) => {
        if (e && "key" in e && e.key !== "Enter") return;
        const name = tempName.trim();
        if (!name) return;

        try {
            if (mode === "edit" && selectedList) {
                const updated = await updateList(selectedList.id, name);
                setSelectedList(updated);
            } else if (mode === "create") {
                const newList = await createList(name);
                setSelectedList(newList);
                navigate(`/lists/${newList.id}`);
            }
            resetUI();
        } catch (err) {
            console.error("Error saving list:", err);
        }
    };

    const handleSelectList = (id: string) => {
        if (id === "new") {
            setMode("create");
            setSelectedList(null);
            return;
        }
        const list = lists.find(l => l.id === id);
        if (!list) return;
        setSelectedList(list);
        setMode("view");
        navigate(`/lists/${list.id}`);
    };

    const handleDeleteList = async (id: string) => {
        try {
            await deleteList(id);
            resetUI();
        } catch (err) {
            console.error("Error deleting list:", err);
        }
    };

    return {
        selectedList,
        mode,
        tempName,
        handlers: {
            resetUI,
            handleSubmitName,
            handleSelectList,
            handleDeleteList,
            setTempName,
            setMode,
        },
    };
};
