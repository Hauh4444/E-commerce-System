import { cva } from "class-variance-authority";

export const productCardVariants = cva("h-56 flex border rounded-md overflow-hidden", {
    variants: {
        variant: {
            search: "flex-row",
            list: "flex-row",
            cart: "flex-row",
        },
    },
    defaultVariants: {
        variant: "search",
    },
});