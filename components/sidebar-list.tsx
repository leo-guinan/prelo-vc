import {ThemeToggle} from '@/components/theme-toggle'
import * as React from 'react'
import {PitchDeckRequest} from '@prisma/client/edge';
import {SidebarItems} from "@/components/sidebar-items";

interface SidebarListProps {
    userId?: string
    decks: PitchDeckRequest[]
    children?: React.ReactNode
}


export function SidebarList({userId: _, decks}: SidebarListProps) {

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="p-4 text-center">Pitch Decks</div>
            <div className="flex-1 overflow-auto">
                {decks?.length && (
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
