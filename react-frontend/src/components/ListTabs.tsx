import { type ForwardedRef, forwardRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent } from "react";
import { Pen, Trash, X, Check, Plus } from "lucide-react";

import { type List } from "@/api/lists";

import { TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ListTabsProps extends HTMLAttributes<HTMLDivElement> {
    lists: List[];
    loading: boolean;
    selectedList: List | null;
    mode: "view" | "edit" | "create";
    tempName: string;
    setTempName: (name: string) => void;
    setMode: (mode: "view" | "edit" | "create") => void;
    resetUI: () => void;
    handleSubmitName: (e?: KeyboardEvent | MouseEvent | null) => Promise<void>;
    handleDeleteList: (id: string) => void;
}

const ListTabs = forwardRef<
    HTMLDivElement,
    ListTabsProps
>(({
    lists,
    loading,
    selectedList,
    mode,
    tempName,
    setTempName,
    setMode,
    resetUI,
    handleSubmitName,
    handleDeleteList,
}, ref: ForwardedRef<HTMLDivElement>) => {
    const activeListId = selectedList?.id;
    const isEditing = mode === "edit";
    const isCreating = mode === "create";

    const isActive = (list: List) => list.id === activeListId;
    const canEdit = (list: List) => isActive(list) && list.name !== "Wishlist";

    if (loading) return <p>Loading lists...</p>;

    return (
        <TabsList ref={ref} className="w-full h-auto overflow-x-auto mb-6">
            {lists.map(list => (
                <section key={list.id} className="relative flex-1">
                    <TabsTrigger value={list.id} className="w-full py-2 px-2 flex-1 text-lg font-extrabold relative">
                        {canEdit(list) && isEditing ? (
                            <Input
                                placeholder="List"
                                className="!text-lg text-center"
                                value={tempName}
                                onChange={e => setTempName(e.target.value)}
                                onKeyDown={handleSubmitName}
                                autoFocus
                            />
                        ) : (
                            list.name
                        )}
                    </TabsTrigger>

                    {canEdit(list) && (
                        <>
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="w-9 h-9 p-2 absolute right-11 top-1/2 -translate-y-1/2 z-10"
                                        onClick={resetUI}
                                    >
                                        <X />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-9 h-9 p-2 absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                        onClick={handleSubmitName}
                                    >
                                        <Check />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="w-9 h-9 p-2 absolute right-10 top-1/2 -translate-y-1/2 z-10"
                                        onClick={() => setMode("edit")}
                                    >
                                        <Pen />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-9 h-9 p-2 absolute right-1 top-1/2 -translate-y-1/2 z-10"
                                        onClick={() => handleDeleteList(list.id)}
                                    >
                                        <Trash />
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </section>
            ))}

            <section className={`relative ${isCreating ? "flex-1" : "w-[44px]"} transition-all duration-500 ease-out`}>
                <TabsTrigger value="new" className="w-full py-2 px-0.5 flex-1 h-11 text-lg font-extrabold relative">
                    {isCreating ? (
                        <Input
                            placeholder="List"
                            className="w-full !text-lg text-center"
                            value={tempName}
                            onChange={e => setTempName(e.target.value)}
                            onKeyDown={handleSubmitName}
                            autoFocus
                        />
                    ) : (
                        <Plus />
                    )}
                </TabsTrigger>

                {isCreating && (
                    <>
                        <Button
                            variant="ghost"
                            className="w-9 h-9 p-2 absolute right-10 top-1/2 -translate-y-1/2 z-10"
                            onClick={resetUI}
                        >
                            <X />
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-9 h-9 p-2 absolute right-1 top-1/2 -translate-y-1/2 z-10"
                            onClick={handleSubmitName}
                        >
                            <Check />
                        </Button>
                    </>
                )}
            </section>
        </TabsList>
    );
});
ListTabs.displayName = "ListTabs";

export { ListTabs };