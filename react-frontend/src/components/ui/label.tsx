import { forwardRef, type ComponentPropsWithoutRef, type ForwardedRef } from "react";
import { Root as LabelPrimitiveRoot } from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = forwardRef<
    HTMLLabelElement,
    ComponentPropsWithoutRef<typeof LabelPrimitiveRoot> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref: ForwardedRef<HTMLLabelElement>) => (
    <LabelPrimitiveRoot
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
));

Label.displayName = LabelPrimitiveRoot.displayName;

export { Label };
