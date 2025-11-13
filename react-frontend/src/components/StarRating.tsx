import { forwardRef, type HTMLAttributes, type ForwardedRef } from "react";
import { Star } from "@/components/ui/star";
import { cn } from "@/lib/utils";

export interface StarRatingProps extends HTMLAttributes<HTMLUListElement> {
    value: number;
    max?: number;
    size?: number;
}

const StarRating = forwardRef<
    HTMLUListElement,
    StarRatingProps
>(({ value, max = 5, size = 24, className, ...props }, ref: ForwardedRef<HTMLUListElement>) => {
        const fullStars = Math.floor(Math.round(value * 2) / 2);
        const hasHalfStar = Math.round(value * 2) / 2 - fullStars >= 0.5;

        return (
            <ul
                ref={ref}
                className={cn("w-fit relative flex items-center list-none p-0 m-0", className)}
                aria-label={`Rating: ${value} out of ${max} stars`}
                role="img"
                {...props}
            >
                {Array.from({ length: max }).map((_, i) => (
                    <li key={`empty-${i}`} aria-hidden="true">
                        <Star variant="empty" size={size} />
                    </li>
                ))}

                <ul
                    className="absolute top-0 left-0 flex overflow-hidden p-0 m-0 pointer-events-none"
                    aria-hidden="true"
                >
                    {Array.from({ length: fullStars }).map((_, i) => (
                        <li key={`full-${i}`}>
                            <Star variant="full" size={size} />
                        </li>
                    ))}
                    {hasHalfStar && (
                        <li className="overflow-hidden" style={{ width: size / 2 }}>
                            <Star variant="half" size={size} />
                        </li>
                    )}
                </ul>
            </ul>
        );
    }
);
StarRating.displayName = "StarRating";

export { StarRating };