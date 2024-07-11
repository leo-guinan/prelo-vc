import * as React from 'react'
import {useState} from 'react'
import {PitchDeckRequest} from '@prisma/client/edge';
import {SidebarItems} from "@/components/sidebar-items";
import {MinusIcon, PlusIcon} from "@/components/ui/icons";

interface SidebarSubmenuProps {
    userId?: string
    decks: PitchDeckRequest[]
    children?: React.ReactNode
    category: string
    color: string
}


export function SidebarSubmenu({userId: _, decks, category, color}: SidebarSubmenuProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            {decks?.length > 0 && (
                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-row p-4 text-center items-center cursor-pointer" onClick={() => setOpen(!open)}>

                        <>
                            {!open && (
                                <PlusIcon
                                    overrideColor={color}
                                    className="size-8 text-gray-500 dark:text-gray-400"/>
                            )}
                            {open && (
                                <MinusIcon
                                    overrideColor={color}
                                    className="size-8 text-gray-500 dark:text-gray-400"/>
                            )}
                        </>


                        <span className="ml-2">{category}</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {open && (
                            <div className="space-y-2 px-2">
                                <SidebarItems decks={decks}/>
                            </div>
                        )}
                    </div>
                </div>
            )
            }
            {!decks || decks.length === 0 && (
                <>
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex flex-row p-4 text-center items-center">

                            <>
                                {!open && (
                                    <PlusIcon
                                        overrideColor={'#E8E8E8'}
                                        className="size-8 text-gray-500 dark:text-gray-400"/>
                                )}
                            </>


                            <span className="ml-2">{category}</span>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
