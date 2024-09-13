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

interface AnalysisChatProps {
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
}: AnalysisChatProps) {
    const [displayedMessages, setDisplayedMessages] = useState<PreloChatMessage[]>(messages)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [completedDialogOpen, setCompletedDialogOpen] = useState<boolean>(false)
    const [chatMessageLoading, setChatMessageLoading] = useState(false)
    const socketRef = useRef<WebSocket | null>(null)
    const [shouldReconnect, setShouldReconnect] = useState(true);
    const [lastUploadedFileName, setLastUploadedFileName] = useState<string | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollToEnd = useScrollToBottom();

    const { data: decks, mutate } = useSwr(user.id, getDecks)

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

    const connectWebSocket = useCallback(() => {
        if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) return;
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}prelo/${uuid}/`);
        socketRef.current = socket;

        socket.addEventListener('open', () => {
            console.log('WebSocket connection opened.');
        });

        socket.addEventListener('close', () => {
            console.log('WebSocket connection closed.');
            if (shouldReconnect) {
                setTimeout(() => connectWebSocket(), 5000); // Attempt to reconnect after 5 seconds
            }
        });

        socket.addEventListener('error', (event) => {
            console.error('WebSocket error: ', event);
            socket.close();
        });
    }, [shouldReconnect]);

    useEffect(() => {
        connectWebSocket();
        return () => {
            setShouldReconnect(false);
            socketRef.current?.close();
        };
    }, [connectWebSocket]);
    const {
        data,
        error
    } = useSWRSubscription(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}prelo/${uuid}/` as string, (key, { next }: SWRSubscriptionOptions<number, Error>) => {
        console.log("key", key)
        connectWebSocket(); // initiate WebSocket connection

        const socket = socketRef.current;
        if (socket) {
            socket.addEventListener('message', (event) => next(null, event.data));
            // @ts-ignore
            socket.addEventListener('error', (event) => next(event.error));
        }

        return () => socket?.close();
    })


    useEffect(() => {
        if (!data) return
        const parsedData = JSON.parse(data.toString())
        console.log("parsedData", parsedData)
        if (parsedData.deck_uuid) {
            if (parsedData.status === "received") {
                void createPitchDeck(parsedData.deck_uuid, user.id, lastUploadedFileName)
                void mutate([...decks ?? [], {
                    uuid: parsedData.deck_uuid,
                    name: lastUploadedFileName ?? "Pitch Deck",
                    id: -1,
                    ownerId: user.memberships[0].id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    status: PitchDeckProcessingStatus.PROCESSING,
                    reportUUID: null,
                    matchScore: null,
                    companyName: null,
                    recommendedNextStep: null
                }])
                setLastUploadedFileName(null)

                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({
                        deck_uuid: parsedData.deck_uuid,
                        type: "acknowledge_received",
                        message: "Got it."
                    }));
                }

            } else if (parsedData.status === "analyzed") {
                console.log(parsedData.company_name)
                const newMessage = {
                    content: parsedData.report_summary,
                    deck_uuid: parsedData.deck_uuid,
                    report_uuid: parsedData.report_uuid,
                    report_summary: parsedData.report_summary,
                    recommended_next_steps: JSON.parse(parsedData.recommended_next_steps),
                    deck_score: parsedData.deck_score,
                    company_name: parsedData.company_name,
                    role: 'assistant',
                    id: nanoid(),
                    type: "deck_report"
                }
                void mutate([...(decks?.map(deck => {
                    if (deck.uuid === parsedData.deck_uuid) {
                        return {
                            ...deck,
                            status: PitchDeckProcessingStatus.COMPLETE,
                            reportUUID: parsedData.report_uuid
                        }
                    }
                    return deck
                }) ?? [])])
                setDisplayedMessages([...displayedMessages, newMessage])
                scrollToEnd()
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({
                        report_uuid: parsedData.report_uuid,
                        deck_uuid: parsedData.deck_uuid,
                        type: "acknowledge_analyzed",
                        message: "Got it."

                    }));
                }
            }
        }

        setCompletedDialogOpen(true)
    }, [data])

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


            // const response = await sendInterviewChatMessage(uuid, formData, user.id);

            // if (!response || 'error' in response) {
            //     setLastUploadedFileName(null)
            //     console.error("Error sending message: ", response.error, response.message)
            //     setDisplayedMessages([...displayedMessages,
            //         newUserMessage,
            //         {
            //             content: "There was an error processing your request. Please try again.",
            //             role: 'assistant',
            //             id: nanoid(),
            //             type: "text" as PreloChatMessageType
            //         }
            //     ])
            //     return
            // }

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




                    </div>

                </>

            </div>
        </>
    )

}