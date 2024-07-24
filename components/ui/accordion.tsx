"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import {cn} from "@/lib/utils"
import {MinusIcon, PlusIcon} from "@/components/ui/icons";

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className, ...props}, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b", className)}
        {...props}
    />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { iconColor?: string }
>(({className, children, iconColor = "currentColor", ...props}, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                ref={ref}
                className={cn(
                    "flex flex-1 items-center justify-start py-4 font-medium transition-all hover:underline",
                    className
                )}
                onClick={handleToggle}
                {...props}
            >
                <div className="w-1/5">
                    {isOpen ? (
                        <MinusIcon className="size-10 -ml-1 mr-4" overrideColor={iconColor}/>
                        // <Minus className="h-4 w-4 shrink-0 transition-transform duration-200"/>
                    ) : (
                        <PlusIcon className="size-10 -ml-1 mr-4" overrideColor={iconColor}/>
                        // <Plus className="h-4 w-4 shrink-0 transition-transform duration-200"/>
                    )}
                </div>
                <div>
                    {children}
                </div>
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className, children, ...props}, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-base transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("pb-4 pt-0 mx-12", className)}>{children}</div>
    </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent}
