'use client'

import {type Message} from 'ai/react'

import {cn} from '@/lib/utils'
import {ChatList} from '@/components/chat-list'
import {ChatPanel} from '@/components/chat-panel'
import {EmptyScreen} from '@/components/empty-screen'
import {ChatScrollAnchor} from '@/components/chat-scroll-anchor'
import {ComponentProps, useState} from "react";
import {sendChatMessage} from "@/app/actions/chats";

export interface ChatProps extends ComponentProps<'div'> {
    initialMessages: Message[]
    id?: string
    userId?: string
}

export function Chat({ initialMessages, className}: ChatProps) {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = async (message: { content: string, role: "user" }) => {
        setIsLoading(true)
        try {
            console.log("Getting response...")
            setMessages([...messages, {
                content: message.content,
                role: message.role,
                createdAt: new Date(),
                id: "temp"
            }])

            const response = await sendChatMessage(message)

            if ('error' in response) {
                console.error(response.error)
                return
            }
            console.log("response", response)

            //@ts-ignore
            setMessages([...messages, {
                content: response.content,
                //@ts-ignore
                role: response.role,
                createdAt: new Date(),
                id: response.id

            }])
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
                {messages.length ? (
                    <>
                        <ChatList messages={messages}/>
                        <ChatScrollAnchor trackVisibility={isLoading}/>
                    </>
                ) : (
                    <EmptyScreen/>
                )}
            </div>
            <ChatPanel
                isLoading={isLoading}
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
            />


        </>
    )
}
