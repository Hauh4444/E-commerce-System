import { cva } from "class-variance-authority";

export const starVariants = cva(
    "cursor-pointer transition-colors",
    {
        variants: {
            variant: {
                full: "fill-yellow-400 text-yellow-400",
                half: "fill-yellow-400 text-yellow-400",
                empty: "text-muted-foreground",
            },
        },
        defaultVariants: {
            variant: "empty",
        },
    }
);