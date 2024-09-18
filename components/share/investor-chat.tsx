'use client'
import { ChatList } from "@/components/chat-list";
import { SimpleChatPanel } from "@/components/simple-chat-panel";
import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SWRSubscriptionOptions } from 'swr/subscription'
import useSWRSubscription from 'swr/subscription'
import { PitchDeckProcessingStatus } from "@prisma/client/edge";
import { createPitchDeck, getDecks, sendInterviewChatMessage } from "@/app/actions/interview";
import { Message, PreloChatMessage, PreloChatMessageType, UserWithMemberships } from "@/lib/types";
import Panel from "@/components/panel/panel";
import useSwr from "swr";
import { useScrollToBottom } from 'react-scroll-to-bottom';
import { sendSimpleMessage } from "@/app/actions/share";
import { SharedChatList } from "./shared-chat-list";
import ShareProfile from "./share-profile";

interface InvestorChatProps {
    messages: PreloChatMessage[]
    uuid: string
    user: UserWithMemberships
    onMessagesUpdate: (messages: PreloChatMessage[]) => void // New prop
}

export default function InvestorChat({
    messages,
    uuid,
    user,
    onMessagesUpdate
}: InvestorChatProps) {
    const [displayedMessages, setDisplayedMessages] = useState<PreloChatMessage[]>(messages)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const [chatMessageLoading, setChatMessageLoading] = useState(false)

    const scrollToEnd = useScrollToBottom();


    useEffect(() => {
        console.log('Displayed messages investor chat', displayedMessages)
    }, [displayedMessages])

    useEffect(() => {
        console.log('Messages investor chat', messages)
    }, [messages])

    useEffect(() => {
        setDisplayedMessages(messages)
        onMessagesUpdate(messages) // Update parent component's state
    }, [messages, onMessagesUpdate])


    const sendMessage = async (message: { content: string, role: "user" }) => {
        console.log("Sending Message...")
        console.log("Content:", message.content)
        if (!message.content) return
        setIsLoading(true)
        try {
            const newUserMessage = {

                content: message.content,
                role: message.role,
                id: "temp",
                type: "text",
            }

            setDisplayedMessages((prevMessages) => {
                const newMessages = [...prevMessages, newUserMessage]
                onMessagesUpdate(newMessages) // Update parent component's state
                return newMessages
            });

            setChatMessageLoading(true)
            // Create a FormData object to send both text and file
            const response = await sendSimpleMessage(user.slug ?? "", message.content, uuid)
            if (!response || 'error' in response) {
                console.error("Error sending message: ", response.error, response.message)
                return
            }

            scrollToEnd()


            const newMessage = {
                content: response.message,
                role: 'assistant',
                id: nanoid(),
                type: "text" as PreloChatMessageType
            }


            setDisplayedMessages((prevMessages) => {
                const newMessages = [...prevMessages, newMessage]
                onMessagesUpdate(newMessages) // Update parent component's state
                return newMessages
            });

            setChatMessageLoading(false)

            scrollToEnd()

        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)

        }
    }

    return (
        <>
            <div className={'pt-4 md:pt-10 size-full mx-auto box-border h-screen'}


            >

                <>
                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel>
                                <div
                                    className="flex flex-col w-full h-full">

                                    <div className="flex flex-col p-y-12 w-4/5 mx-auto h-full">

                                        <SharedChatList messages={displayedMessages} user={user}
                                            chatMessageLoading={chatMessageLoading} />

                                        <SimpleChatPanel
                                            isLoading={isLoading}
                                            input={input}
                                            setInput={setInput}
                                            sendMessage={sendMessage}

                                        />
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />
                            <ResizablePanel>
                                <div className="flex flex-col size-full pb-8">
                                    <ShareProfile user={user} />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>


                    </div>

                </>

            </div>
        </>
    )

}