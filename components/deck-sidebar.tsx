'use client'
import * as React from 'react'
import {SyntheticEvent} from 'react'
import {SidebarList} from '@/components/sidebar-list'
import {PitchDeck} from "@prisma/client/edge";
import {MagnifyingGlassIcon} from "@/components/ui/icons";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {clearCurrentDeck} from "@/app/actions/analyze";
import useSwr from "swr";
import {getDecks} from "@/app/actions/interview";

interface ChatHistoryProps {
    userId?: string
}


export function DeckSidebar({userId}: ChatHistoryProps) {

    const router = useRouter();

    const clearExisting = async (e: SyntheticEvent) => {
        e.preventDefault()
        await clearCurrentDeck();
    }

    const {data: decks, mutate} = useSwr(userId, getDecks)


    return (
        <div className="flex flex-col h-full">
            <React.Suspense
                fallback={
                    <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
                        {Array.from({length: 10}).map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
                            />
                        ))}
                    </div>
                }
            >
                <SidebarList userId={userId} decks={decks ?? []}/>
            </React.Suspense>
        </div>
    )
}
