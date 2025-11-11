import {type ComponentPropsWithoutRef, type ComponentRef, forwardRef, type HTMLAttributes} from "react";
import {
    Root as DropdownMenu,
    Trigger as DropdownMenuTrigger,
    Group as DropdownMenuGroup,
    Portal as DropdownMenuPortal,
    Sub as DropdownMenuSub,
    RadioGroup as DropdownMenuRadioGroup,
    SubTrigger as DropdownMenuSubTriggerPrimitive,
    SubContent as DropdownMenuSubContentPrimitive,
    Content as DropdownMenuContentPrimitive,
    Item as DropdownMenuItemPrimitive,
    CheckboxItem as DropdownMenuCheckboxItemPrimitive,
    RadioItem as DropdownMenuRadioItemPrimitive,
    Label as DropdownMenuLabelPrimitive,
    Separator as DropdownMenuSeparatorPrimitive,
    ItemIndicator,
} from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenuSubTrigger = forwardRef<
    ComponentRef<typeof DropdownMenuSubTriggerPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuSubTriggerPrimitive> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuSubTriggerPrimitive
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuSubTriggerPrimitive>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = forwardRef<
    ComponentRef<typeof DropdownMenuSubContentPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuSubContentPrimitive>
>(({ className, ...props }, ref) => (
    <DropdownMenuSubContentPrimitive
        ref={ref}
        className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out",
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuContent = forwardRef<
    ComponentRef<typeof DropdownMenuContentPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuContentPrimitive> & { sideOffset?: number }
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPortal>
        <DropdownMenuContentPrimitive
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                className
            )}
            {...props}
        />
    </DropdownMenuPortal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
    ComponentRef<typeof DropdownMenuItemPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitive> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuItemPrimitive
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = forwardRef<
    ComponentRef<typeof DropdownMenuCheckboxItemPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItemPrimitive>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuCheckboxItemPrimitive
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <ItemIndicator>
                <Check className="h-4 w-4" />
            </ItemIndicator>
        </span>
        {children}
    </DropdownMenuCheckboxItemPrimitive>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = forwardRef<
    ComponentRef<typeof DropdownMenuRadioItemPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuRadioItemPrimitive>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuRadioItemPrimitive
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <ItemIndicator>
                <Circle className="h-2 w-2 fill-current" />
            </ItemIndicator>
        </span>
        {children}
    </DropdownMenuRadioItemPrimitive>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = forwardRef<
    ComponentRef<typeof DropdownMenuLabelPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuLabelPrimitive> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuLabelPrimitive
        ref={ref}
        className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
        {...props}
    />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = forwardRef<
    ComponentRef<typeof DropdownMenuSeparatorPrimitive>,
    ComponentPropsWithoutRef<typeof DropdownMenuSeparatorPrimitive>
>(({ className, ...props }, ref) => (
    <DropdownMenuSeparatorPrimitive
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};
