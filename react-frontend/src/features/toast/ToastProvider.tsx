import { useState, useEffect, type ReactNode, type FC } from "react";

import { ToastContext, type ToastContextValue } from "./ToastContext";

import { type ToastActionElement, type ToastProps } from "@/components/ui/toast";

export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = ToastProps & {
    id: string;
    title?: ReactNode;
    description?: ReactNode;
    action?: ToastActionElement;
};

type State = { toasts: ToasterToast[] };
type Toast = Omit<ToasterToast, "id">;

type Action =
    | { type: "ADD_TOAST"; toast: ToasterToast }
    | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string };

let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
            };
        case "DISMISS_TOAST": {
            const { toastId } = action;
            if (toastId) addToRemoveQueue(toastId);
            else state.toasts.forEach((t) => addToRemoveQueue(t.id));
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t)),
            };
        }
        case "REMOVE_TOAST":
            if (!action.toastId) return { ...state, toasts: [] };
            return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
        default:
            return state;
    }
};

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) return;
    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: "REMOVE_TOAST", toastId });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);

    const toastFn = (props: Toast) => {
        const id = genId();
        const update = (props: ToasterToast) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });
        const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

        dispatch({
            type: "ADD_TOAST",
            toast: {
                ...props,
                id,
                open: true,
                onOpenChange: (open) => {
                    if (!open) dismiss();
                },
            },
        });

        return { id, dismiss, update };
    };

    const contextValue: ToastContextValue = {
        ...state,
        toast: toastFn,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    };

    return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};
