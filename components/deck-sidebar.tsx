'use client'
import * as React from 'react'
import { SyntheticEvent, useState, useEffect } from 'react'
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
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ChatHistoryProps {
    userId?: string
    user: UserWithMemberships
}

export function DeckSidebar({ userId, user }: ChatHistoryProps) {
    const { submindPending, isLoading, mutate: mutateSubmindPending } = useSubmindPending(userId as string);
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
    const router = useRouter();
    const { data: decks, mutate } = useSwr(userId, getDecks)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSubmindCompleteModalOpen, setIsSubmindCompleteModalOpen] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (submindPending) {
            interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevProgress + (100 / (15 * 60)); // Increase by 1/900th every second (15 minutes total)
                });
            }, 1000);
        } else if (progress === 100) {
            setIsSubmindCompleteModalOpen(true);
        }

        return () => clearInterval(interval);
    }, [submindPending, progress]);

    const clearExisting = async (e: SyntheticEvent) => {
        e.preventDefault()
        await clearCurrentDeck();
    }

    const handleUploadSuccess = (message: string, uuid: string) => {
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
                    <Progress value={progress} className="w-full mb-2" />
                    <p className="text-sm text-gray-500">Estimated time remaining: {Math.max(0, Math.ceil(15 - (progress / 100 * 15)))} minutes</p>
                    <p className="mt-2">Your submind is being created. This usually takes about 15 minutes. This message will disappear once it is ready.</p>
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
            <Dialog open={isSubmindCompleteModalOpen} onOpenChange={setIsSubmindCompleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your Submind is Ready!</DialogTitle>
                        <DialogDescription>
                            Your submind has been successfully created. You can now upload a deck to get started with your AI-powered investment analysis.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => {
                        setIsSubmindCompleteModalOpen(false);
                        setIsUploadModalOpen(true);
                    }}>
                        Upload a Deck
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
