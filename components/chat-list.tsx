import {Separator} from '@/components/ui/separator'
import {ChatMessage} from '@/components/chat-message'
import {AnalysisChatMessage} from "@/lib/types";
import {cn} from "@/lib/utils";
import Image from "next/image";
import ChatMessageLoading from "@/components/analyze/chat-message-loading";

export interface ChatList {
    messages: AnalysisChatMessage[]
    user: {
        name?: string | null
        image?: string | null
    }
    chatMessageLoading: boolean
}

export function ChatList({messages, user, chatMessageLoading}: ChatList) {
    const circleColors = ['bg-loadStart', 'bg-loadNext', 'bg-loadMiddle', 'bg-loadEnd'];

    if (!messages.length) {
        return (
            <>
                {chatMessageLoading && (
                    <>
                        <Separator className="my-4 md:my-8"/>

                        <div className={cn('group relative mb-4 flex items-start')}>

                            <div
                                className='flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground'

                            >
                                <Image src="/logo.png" width={32} height={32} alt="Score My Deck Logo"/>


                            </div>
                            <ChatMessageLoading circleColors={circleColors}/>

                        </div>
                    </>
                )}
            </>
        )
    }

    return (
        <div className="relative mx-auto max-w-xl px-4 mt-8">
            {messages.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message} user={user}/>
                    {index < messages.length - 1 && (
                        <Separator className="my-4 md:my-8"/>
                    )}
                </div>
            ))}
            {chatMessageLoading && (
                <>
                    <Separator className="my-4 md:my-8"/>

                    <div className={cn('group relative mb-4 flex items-start')}>

                        <div
                            className='flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground'

                        >
                            <Image src="/logo.png" width={32} height={32} alt="Score My Deck Logo"/>


                        </div>
                        <ChatMessageLoading circleColors={circleColors}/>

                    </div>
                </>
            )}

        </div>
    )
}