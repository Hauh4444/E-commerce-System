import { forwardRef, type ComponentPropsWithoutRef, type ForwardedRef } from "react";
import { Star as StarIcon, StarHalf as StarHalfIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const starVariants = cva(
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
