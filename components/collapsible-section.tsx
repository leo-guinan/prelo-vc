'use client'
import {useState} from "react";
import {MinusIcon, PlusIcon} from "@/components/ui/icons";
import {cn} from "@/lib/utils";

export default function CollapsibleSection({
                                               title,
                                               children,
                                               headerColor,

                                               iconColor,
                                           }: {
                                               title: string
                                               children: React.ReactNode
                                               headerColor?: string
                                               iconColor?: string
                                           }
) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className={cn("w-full mb-8")}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn("rounded-full bg-green-600 text-2xl items-center flex w-full py-4 text-left ", headerColor ? `bg-${headerColor}` : "")}
            >

                {isOpen && (
                    <>
                        <MinusIcon className="size-10" overrideColor={iconColor} />
                    </>
                )}
                {!isOpen && (
                    <>
                        <PlusIcon className="size-10" overrideColor={iconColor} />
                    </>
                )}
                <span className="ml-4">{title}</span>
            </button>
            {isOpen && (
                <div className="p-6 border-t border-gray-200 ml-8">{children}</div>
            )}
        </div>
    )
}