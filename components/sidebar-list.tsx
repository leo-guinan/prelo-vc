import {ThemeToggle} from '@/components/theme-toggle'
import * as React from 'react'
import {useState} from 'react'
import {PitchDeckRequest, PitchDeckStatus} from '@prisma/client/edge';
import {MinusIcon, PlusIcon} from "@/components/ui/icons";
import {SidebarSubmenu} from "@/components/sidebar-submenu";
import {cn} from "@/lib/utils";

interface SidebarListProps {
    userId?: string
    decks: PitchDeckRequest[]
    children?: React.ReactNode
}


export function SidebarList({userId: _, decks}: SidebarListProps) {
    const [open, setOpen] = useState(decks.length > 0)
    const pendingDecks = decks.filter(deck => deck.status === PitchDeckStatus.PENDING)
    const bookCallDecks = decks.filter(deck => deck.status === PitchDeckStatus.BOOK_CALL)
    const maybeDecks = decks.filter(deck => deck.status === PitchDeckStatus.GET_INFO)
    const passDecks = decks.filter(deck => deck.status === PitchDeckStatus.PASS)
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className={cn("flex flex-row p-4 text-center items-center", decks.length > 0 ? 'cursor-pointer' : '')} onClick={() => setOpen(!open)}>
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
                        <div className="space-y-2 px-2">
                            <SidebarSubmenu decks={pendingDecks} category="Pending" color="#FFCC2F"/>
                        </div>

                        <div className="space-y-2 px-2">
                            <SidebarSubmenu decks={bookCallDecks} category="Book Call" color="#8BDDE4"/>
                        </div>
                        <div className="space-y-2 px-2">
                            <SidebarSubmenu decks={maybeDecks} category="Maybe" color="#FFCC2F"/>
                        </div>

                        <div className="space-y-2 px-2">
                            <SidebarSubmenu decks={passDecks} category="Pass" color="#FF7878"/>
                        </div>

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
