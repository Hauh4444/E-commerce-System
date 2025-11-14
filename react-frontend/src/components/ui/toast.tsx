import { forwardRef, type ComponentPropsWithoutRef, type ReactElement, type ComponentRef } from "react";
import {
    Root as ToastRoot,
    Action as ToastActionPrimitive,
    Close as ToastClosePrimitive,
    Title as ToastTitlePrimitive,
    Description as ToastDescriptionPrimitive,
    Viewport as ToastViewportPrimitive,
} from "@radix-ui/react-toast";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastVariants } from "./variants/toast";

const ToastViewport = forwardRef<
    ComponentRef<typeof ToastViewportPrimitive>,
    ComponentPropsWithoutRef<typeof ToastViewportPrimitive>
>(({ className, ...props }, ref) => (
    <ToastViewportPrimitive
        ref={ref}
        className={cn(
            "fixed bottom-4 right-4 z-[999999] flex max-h-screen w-full flex-col-reverse sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]",
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastViewportPrimitive.displayName;

const Toast = forwardRef<
    ComponentRef<typeof ToastRoot>,
    ComponentPropsWithoutRef<typeof ToastRoot> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
    <ToastRoot
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
    />
));
Toast.displayName = ToastRoot.displayName;

const ToastAction = forwardRef<
    ComponentRef<typeof ToastActionPrimitive>,
    ComponentPropsWithoutRef<typeof ToastActionPrimitive>
>(({ className, ...props }, ref) => (
    <ToastActionPrimitive
        ref={ref}
        className={cn(
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
            className
        )}
        {...props}
    />
));
ToastAction.displayName = ToastActionPrimitive.displayName;

const ToastClose = forwardRef<
    ComponentRef<typeof ToastClosePrimitive>,
    ComponentPropsWithoutRef<typeof ToastClosePrimitive>
>(({ className, ...props }, ref) => (
    <ToastClosePrimitive
        ref={ref}
        className={cn(
            "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
            className
        )}
        toast-close=""
        {...props}
    >
        <X className="h-4 w-4" />
    </ToastClosePrimitive>
));
ToastClose.displayName = ToastClosePrimitive.displayName;

const ToastTitle = forwardRef<
    ComponentRef<typeof ToastTitlePrimitive>,
    ComponentPropsWithoutRef<typeof ToastTitlePrimitive>
>(({ className, ...props }, ref) => (
    <ToastTitlePrimitive
        ref={ref}
        className={cn("text-sm font-semibold", className)}
        {...props}
    />
));
ToastTitle.displayName = ToastTitlePrimitive.displayName;

const ToastDescription = forwardRef<
    ComponentRef<typeof ToastDescriptionPrimitive>,
    ComponentPropsWithoutRef<typeof ToastDescriptionPrimitive>
>(({ className, ...props }, ref) => (
    <ToastDescriptionPrimitive
        ref={ref}
        className={cn("text-sm opacity-90", className)}
        {...props}
    />
));
ToastDescription.displayName = ToastDescriptionPrimitive.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = ReactElement<typeof ToastAction>;

export {
    type ToastProps,
    type ToastActionElement,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
};
