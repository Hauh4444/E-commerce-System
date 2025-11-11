import { createContext, type ReactNode, useContext } from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

export type ToasterToast = ToastProps & {
    id: string;
    title?: ReactNode;
    description?: ReactNode;
    action?: ToastActionElement;
};

export type ToastContextValue = {
    toasts: ToasterToast[];
    toast: (props: Omit<ToasterToast, "id">) => {
        id: string;
        dismiss: () => void;
        update: (props: ToasterToast) => void;
    };
    dismiss: (toastId?: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
