"use client"
import { Separator } from '@/components/ui/separator'
import { PreloChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ChatMessageLoading from "@/components/analyze/chat-message-loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { UserIcon } from 'lucide-react';
import { SharedChatMessage } from "./shared-chat-message";

export interface ChatList {
    messages: PreloChatMessage[]
    user: {
        name?: string | null
        image?: string | null
    }
    chatMessageLoading: boolean
    ref?: React.RefObject<HTMLDivElement>
    anonymous?: boolean
}

export function SharedChatList({ messages, user, chatMessageLoading, anonymous }: ChatList) {
    const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
        useScrollAnchor()

    const circleColors = ['bg-loadStart', 'bg-loadNext', 'bg-loadMiddle', 'bg-loadEnd'];

    if (!messages.length) {
        return (
            <>
                <div className="relative px-4 h-full pb-[225px]" ref={scrollRef}>

                    {chatMessageLoading && (
                        <>
                            <Separator className="my-4 md:my-8" />

                            <div className={cn('group relative mb-4 flex items-start')}>

                                <div
                                    className='flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground'

                                >
                                    {!anonymous && (
                                        <Image src="/logo.png" width={32} height={32} alt="PreloVC" />
                                    )}
                                    {anonymous && (
                                        <div className="size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                    )}


                                </div>
                                <ChatMessageLoading circleColors={circleColors} />

                            </div>
                        </>
                    )}
                    {!chatMessageLoading && (
                        <>
                            <h1>Need something to put here.</h1>
                        </>
                    )}
                </div>
            </>
        )
    }

    return (
        <div className="relative px-4 h-full pb-[225px]" ref={scrollRef}>
            <ScrollArea className="flex flex-col size-full pb-8" ref={messagesRef}>
                {messages.map((message, index) => (
                    <div key={index}>
                        {index === messages.length - 1 && (
                            <ChatScrollAnchor trackVisibility={true} />
                        )}
                        <SharedChatMessage message={message} user={user} />
                        {index < messages.length - 1 && (
                            <Separator className="my-4 md:my-8" />
                        )}

                    </div>
                ))}
                {chatMessageLoading && (
                    <>
                        <Separator className="my-4 md:my-8" />

                        <div className={cn('group relative mb-4 flex items-start')}>

                            <div
                                className='flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground'

                            >
                                <Image src="/logo.png" width={32} height={32} alt="PreloVC Logo" className="rounded-full" />


                            </div>
                            <ChatMessageLoading circleColors={circleColors} />

                        </div>
                    </>
                )}
               
            </ScrollArea>
        </div>

    )
}