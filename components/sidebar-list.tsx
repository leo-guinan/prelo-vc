import {ThemeToggle} from '@/components/theme-toggle'
import * as React from 'react'
import {useState} from 'react'
import {PitchDeck} from '@prisma/client/edge';
import {MinusIcon, PlusIcon} from "@/components/ui/icons";
import {cn} from "@/lib/utils";
import PitchDeckList from "@/components/interview/pitch-deck-list";

interface SidebarListProps {
    userId?: string
    decks: PitchDeck[]
    children?: React.ReactNode
}


export function SidebarList({userId: _, decks}: SidebarListProps) {
    const [open, setOpen] = useState(decks.length > 0)
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className={cn("flex flex-row p-4 text-center items-center", decks.length > 0 ? 'cursor-pointer' : '')}
                 onClick={() => setOpen(!open)}>
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
                {open && (
                    <>
                        <PitchDeckList decks={decks} />
                    </>
                )
                }
            </div>
            <div className="flex items-center justify-between p-4">
                <ThemeToggle/>
                {/*<ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />*/}
            </div>
        </div>
    )
}
