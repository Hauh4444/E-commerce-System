import { useLists } from "@/features/lists/useLists";
import { useSelectedList } from "@/features/lists/useSelectedList";

import { Header } from "@/components/Header";
import { ListTabs } from "@/components/ListTabs";
import { ListProducts } from "@/components/ListProducts";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export const ListsPage = () => {
    // Hooks are managed here and passed down to ensure that certain tab functionality correctly reloads ListProducts.
    // Placing hooks directly inside the components would prevent proper updates.
    const { lists, loading } = useLists();
    const { selectedList, mode, tempName, handlers } = useSelectedList(lists);

    const isCreating = mode === "create";

    return (
        <>
            <Header />
            <main className="w-full min-h-screen bg-gradient-subtle flex flex-col items-center justify-start absolute top-0">
                <Tabs
                    value={selectedList?.id || (isCreating ? "new" : "")}
                    onValueChange={handlers.handleSelectList}
                    className="w-3/4 mb-10 pt-28"
                >
                    <ListTabs
                        lists={lists}
                        loading={loading}
                        selectedList={selectedList}
                        mode={mode}
                        tempName={tempName}
                        {...handlers}
                    />
                    {selectedList && (
                        <TabsContent value={selectedList.id}>
                            <ListProducts list={selectedList} />
                        </TabsContent>
                    )}
                </Tabs>
            </main>
        </>
    );
};

export default ListsPage;
