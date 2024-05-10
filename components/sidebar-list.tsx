import {ThemeToggle} from '@/components/theme-toggle'
import * as React from 'react'
import {useState} from 'react'
import {PitchDeckRequest} from '@prisma/client/edge';
import {SidebarItems} from "@/components/sidebar-items";
import {MinusIcon, PlusIcon} from "@/components/ui/icons";
import {cn} from "@/lib/utils";

interface SidebarListProps {
    userId?: string
    decks: PitchDeckRequest[]
    children?: React.ReactNode
}


export function SidebarList({userId: _, decks}: SidebarListProps) {
    const [open, setOpen] = useState(decks.length > 0)

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-row p-4 text-center items-center" onClick={() => setOpen(!open)}>
                {decks.length > 0 && (
                    <>
                        {!open && (
                            <PlusIcon
                                className="size-8 text-gray-500 dark:text-gray-400"/>
                        )}
                        {open && (
                            <MinusIcon
                                className="size-8 text-gray-500 dark:text-gray-400"/>
                        )}
                    </>
                )}
                {decks.length === 0 && (
                <>
                        {!open && (
                            <PlusIcon
                                overrideColor="#E8E8E8"
                                className="size-8 text-zinc-50"/>
                        )}
                        {open && (
                            <MinusIcon
                                overrideColor="#E8E8E8"
                                className="size-8 text-zinc-50 "/>
                        )}
                    </>
                    )}
                <span className="ml-2">View Pitch Decks</span>
            </div>
            <div className="flex-1 overflow-auto">
                {open && decks?.length && (
                    <div className="space-y-2 px-2">
                        <SidebarItems decks={decks}/>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between p-4">
                <ThemeToggle/>
                {/*<ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />*/}
            </div>
        </div>
    )
}
