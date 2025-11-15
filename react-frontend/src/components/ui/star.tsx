import { forwardRef, type ComponentPropsWithoutRef, type ForwardedRef } from "react";
import { Star as StarIcon, StarHalf as StarHalfIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

import { starVariants } from "./variants"

const Star = forwardRef<
    SVGSVGElement,
    ComponentPropsWithoutRef<"svg"> & VariantProps<typeof starVariants> & { size?: number }
>(({ variant, className, size = 24, ...props }, ref: ForwardedRef<SVGSVGElement>) => {
    const Icon = variant === "half" ? StarHalfIcon : StarIcon;

    return (
        <Icon
            ref={ref}
            className={cn(starVariants({ variant }), className)}
            width={size}
            height={size}
            {...props}
        />
    );
});

Star.displayName = "Star";

export { Star };
