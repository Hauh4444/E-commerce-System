import { cva } from "class-variance-authority";

export const productCardVariants = cva(
    "flex border rounded-md overflow-hidden",
    {
        variants: {
            variant: {
                search: "h-56 flex-row",
                list: "h-56 flex-row",
                cart: "h-56 flex-row",
                compact: "h-32 flex-row",
            },
        },
        defaultVariants: {
            variant: "search",
        },
    }
);