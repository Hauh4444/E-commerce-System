import { type ReactNode, useEffect, useState } from 'react';

import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 500000

type ToasterToast = ToastProps & {
    id: string
    title?: ReactNode
    description?: ReactNode
    action?: ToastActionElement
}

interface State {
    toasts: ToasterToast[]
}

type ToastOptions = Omit<ToasterToast, "id">

type Action =
    | { type: "ADD_TOAST"; toast: ToasterToast }
    | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string }

let memoryState: State = { toasts: [] }
const listeners: Array<(state: State) => void> = []
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
let count = 0

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

const addToRemoveQueue = (id: string) => {
    if (toastTimeouts.has(id)) return
    toastTimeouts.set(id, setTimeout(() => {
        toastTimeouts.delete(id)
        dispatch({ type: "REMOVE_TOAST", toastId: id })
    }, TOAST_REMOVE_DELAY))
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
        case "UPDATE_TOAST":
            return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) }
        case "DISMISS_TOAST":
            if (action.toastId) addToRemoveQueue(action.toastId)
            else state.toasts.forEach(t => addToRemoveQueue(t.id))
            return { ...state, toasts: state.toasts.map(t => (t.id === action.toastId || !action.toastId) ? { ...t, open: false } : t) }
        case "REMOVE_TOAST":
            if (!action.toastId) return { ...state, toasts: [] }
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.toastId) }
        default:
            return state
    }
}

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach(l => l(memoryState))
}

export function toast(options: ToastOptions) {
    const id = genId()
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
    const update = (props: ToasterToast) => {
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id }
        })
    }

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...options,
            id,
            open: true,
            onOpenChange: open => {
                if (!open) dismiss()
            }
        }
    })

    return { id, dismiss, update }
}

export function useToast() {
    const [state, setState] = useState(memoryState)

    useEffect(() => {
        listeners.push(setState)
        return () => {
            listeners.splice(listeners.indexOf(setState), 1)
        }
    }, [])

    return { ...state, toast, dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }) }
}