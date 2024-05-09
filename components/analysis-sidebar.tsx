'use client'
import * as React from 'react'
import {SidebarList} from '@/components/sidebar-list'
import {PitchDeckRequest} from "@prisma/client/edge";
import {IconPlus} from "@/components/ui/icons";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {clearCurrentDeck} from "@/app/actions/analyze";
import {SyntheticEvent} from "react";

interface ChatHistoryProps {
    userId?: string
    decks: PitchDeckRequest[]
}



export function AnalysisSidebar({userId, decks }: ChatHistoryProps) {

    const router = useRouter();

    const clearExisting = async (e: SyntheticEvent) => {
        e.preventDefault()
        await clearCurrentDeck();
    }

    return (
        <div className="flex flex-col h-full">
            <div className="px-2 my-4">
              <Link
                  onClick={clearExisting}
                href="#"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
                )}
              >
                <IconPlus className="-translate-x-2 stroke-2" />
                Analyze New Deck
              </Link>
            </div>
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
                <SidebarList userId={userId} decks={decks} />
            </React.Suspense>
        </div>
    )
}
