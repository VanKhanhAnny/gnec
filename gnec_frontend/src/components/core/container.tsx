import { cn } from "@/lib/utils"
import { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"

type Props = ComponentProps<"div"> & {
    asChild?: boolean
};

export default function Container({
    asChild = false,
    className,
    children,
    ...rest
}: Props) {
    const Comp = asChild ? Slot : "div"

    return (
        <Comp className={cn("container mx-auto p-8", className)} {...rest}>{children}</Comp>
    )
}
