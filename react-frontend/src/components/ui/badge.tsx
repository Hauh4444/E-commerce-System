import { type HTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

import { badgeVariants } from "./variants";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge };
