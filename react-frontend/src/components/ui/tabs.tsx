import { forwardRef, type ComponentPropsWithoutRef, type ForwardedRef, type ComponentRef } from "react";
import {
    Root as TabsRoot,
    List as TabsListPrimitive,
    Trigger as TabsTriggerPrimitive,
    Content as TabsContentPrimitive
} from "@radix-ui/react-tabs";

import { cn } from "@/utils/cn";

const Tabs = TabsRoot;

const TabsList = forwardRef<
    ComponentRef<typeof TabsListPrimitive>,
    ComponentPropsWithoutRef<typeof TabsListPrimitive>
>(({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <TabsListPrimitive
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsListPrimitive.displayName;

const TabsTrigger = forwardRef<
    ComponentRef<typeof TabsTriggerPrimitive>,
    ComponentPropsWithoutRef<typeof TabsTriggerPrimitive>
>(({ className, ...props }, ref: ForwardedRef<HTMLButtonElement>) => (
    <TabsTriggerPrimitive
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsTriggerPrimitive.displayName;

const TabsContent = forwardRef<
    ComponentRef<typeof TabsContentPrimitive>,
    ComponentPropsWithoutRef<typeof TabsContentPrimitive>
>(({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <TabsContentPrimitive
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsContentPrimitive.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
