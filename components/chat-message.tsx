// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx
'use client'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
//@ts-ignore
import remarkCollapse from 'remark-collapse'

import {cn} from '@/lib/utils'
import {CodeBlock} from '@/components/ui/codeblock'
import {MemoizedReactMarkdown} from '@/components/markdown'
import {ChatMessageActions} from '@/components/chat-message-actions'
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Image from 'next/image'
import ChatUser from "@/components/analyze/chat-user";
import {Message, PreloChatMessage} from "@/lib/types";
import {TextMessage} from "@/components/messages/text-message";
import {DeckReportMessage} from "@/components/messages/deck-report-message";

import {type FileMessage as FileMessageType, DeckReportMessage as DeckReportMessageType} from "@/lib/types";

export interface ChatMessageProps {
    message: Message,
    user: {
        name?: string | null
        image?: string | null

    }
}

export function ChatMessage({message, user, ...props}: ChatMessageProps) {
    return (
        <div
            className={cn('group relative mb-4 flex items-start max-w-xl')}
            {...props}
        >
            <div
                className={cn(
                    'flex size-8 shrink-0 select-none items-center justify-center rounded-full ',
                    message.role === 'user'
                        ? ''
                        : 'bg-primary text-primary-foreground'
                )}
            >
                {message.role === 'user' ? <ChatUser user={user}/> :
                    <Image src="/logo.png" width={32} height={32} alt="PreloVC Logo" className="rounded-full" />}
            </div>
            <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
                {message.type === "text" && (
                    <TextMessage content={message.content}/>
                )}
                {message.type === "deck_report" && (
                    <DeckReportMessage message={message as DeckReportMessageType} />
                )}
                <ChatMessageActions message={message}/>
            </div>
        </div>
    )
}
