import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { PreloChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ChatMessageLoading from "@/components/analyze/chat-message-loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import FAQ from "@/components/analyze/faq";
import { useState } from 'react';
import { CheckmarkIcon } from './ui/icons';

export interface ChatList {
    messages: PreloChatMessage[]
    user: {
        name?: string | null
        image?: string | null
    }
    chatMessageLoading: boolean
    ref?: React.RefObject<HTMLDivElement>
}

export function ChatList({ messages, user, chatMessageLoading }: ChatList) {
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
                                    <Image src="/logo.png" width={32} height={32} alt="PreloVC" />


                                </div>
                                <ChatMessageLoading circleColors={circleColors} />

                            </div>
                        </>
                    )}
                    {!chatMessageLoading && (
                        <>
                            <FAQ user={user} />
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
                        <ChatMessage message={message} user={user} />
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