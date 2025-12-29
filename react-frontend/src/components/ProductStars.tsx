import { forwardRef, type HTMLAttributes, type ForwardedRef } from "react";

import { Star } from "./ui/star";

export interface ProductStarsProps extends HTMLAttributes<HTMLUListElement> {
    value: number;
    max?: number;
    size?: number;
}

const ProductStars = forwardRef<
    HTMLUListElement,
    ProductStarsProps
>(({ value, max = 5, size = 24, ...props }, ref: ForwardedRef<HTMLUListElement>) => {
        const fullStars = Math.floor(Math.round(value * 2) / 2);
        const hasHalfStar = Math.round(value * 2) / 2 - fullStars >= 0.5;

        return (
            <ul
                ref={ref}
                className="w-fit relative flex items-center list-none p-0 m-0"
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
                    className="absolute top-[50%] left-0 flex overflow-hidden p-0 m-0 pointer-events-none translate-y-[-50%]"
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
ProductStars.displayName = "ProductStars";

export { ProductStars };