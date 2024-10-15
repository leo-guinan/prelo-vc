'use client'
import * as React from 'react'
import { SyntheticEvent, useState } from 'react'
import { SidebarList } from '@/components/sidebar-list'
import { PitchDeck } from "@prisma/client/edge";
import { CloudUploadIcon, IconShare, MagnifyingGlassIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearCurrentDeck } from "@/app/actions/analyze";
import useSwr from "swr";
import { getDecks } from "@/app/actions/interview";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/components/upload-modal";
import { UserWithMemberships } from '@/lib/types';
import { useSubmindPending } from '@/lib/hooks/useSubmindPending';
import Spinner from './spinner';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ChatHistoryProps {
    userId?: string
    user: UserWithMemberships
}

export function DeckSidebar({ userId, user }: ChatHistoryProps) {
    const { submindPending, isLoading } = useSubmindPending(userId as string);
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })


    const router = useRouter();

    const clearExisting = async (e: SyntheticEvent) => {
        e.preventDefault()
        await clearCurrentDeck();
    }

    const { data: decks, mutate } = useSwr(userId, getDecks)

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUploadSuccess = (message: string, uuid: string) => {
        // Handle successful upload (e.g., refresh the deck list)
        mutate();
    };

    const copyShareLink = () => {
        if (isCopied) return
        copyToClipboard(`https://investor.pitchin.bio/${user.slug}`)
    };

    return (
        <div className="flex flex-col h-full">
             {!isLoading && submindPending && (
                <div className="mt-auto p-4">
                    <Spinner size="large" />
                    
                    <p>Your submind is being created. This usually takes about 15 minutes. This message will disappear once it is ready.</p>
                </div>
            )}
                  
            <Button
                onClick={() => setIsUploadModalOpen(true)}
                className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-10 w-full text-zinc-50 dark:text-gray-900 justify-start bg-standard dark:bg-gray-100 px-4 shadow-none transition-colors hover:bg-gray-100 hover:text-gray-900  dark:hover:bg-standard dark:hover:text-zinc-50 my-2'
                )}
            >
                <span className="ml-4">
                    <CloudUploadIcon className="-translate-x-2 stroke-2 size-6" />
                </span>
                Upload New Deck
            </Button>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() => copyShareLink()}
                            className={cn(
                                buttonVariants({ variant: 'outline' }),
                                'h-10 w-full text-zinc-50 dark:text-gray-900 justify-start bg-standard dark:bg-gray-100 px-4 shadow-none transition-colors hover:bg-gray-100 hover:text-gray-900  dark:hover:bg-standard dark:hover:text-zinc-50 my-2'
                            )}
                        >
                            <span className="ml-4">
                                <IconShare className="-translate-x-2 stroke-2 size-6" />
                            </span>
                            {isCopied ? "Copied!" : "Share Your Link"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-left">    
                        <p className="break-words">Receive founder pitch decks, and discover investment opportunities on autopilot</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>  
            <React.Suspense
                fallback={
                    <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
                            />
                        ))}
                    </div>
                }
            >
                <SidebarList userId={userId} decks={decks ?? []} />
            </React.Suspense>
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                user={user}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    )
}
