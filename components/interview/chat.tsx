'use client'
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SWRSubscriptionOptions } from 'swr/subscription'
import useSWRSubscription from 'swr/subscription'
import { PitchDeckProcessingStatus } from "@prisma/client/edge";
import { createPitchDeck, getDecks, sendInterviewChatMessage } from "@/app/actions/interview";
import { Message, PreloChatMessageType, UserWithMemberships } from "@/lib/types";
import Panel, { EmailContent } from "@/components/panel/panel";
import useSwr from "swr";
import { useScrollToBottom } from 'react-scroll-to-bottom';
import { CheckmarkIcon } from "../ui/icons";
import { useSearchParams } from "next/navigation";


interface AnalysisChatProps {
    messages: Message[]
    uuid: string
    user: UserWithMemberships
}


export default function InterviewChat({
    messages,
    uuid,
    user
}: AnalysisChatProps) {
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>(messages)
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
    const [panelView, setPanelView] = useState<string | null>(null)
    const [panelContent, setPanelContent] = useState<string | EmailContent | null>(null)
    const searchParams = useSearchParams()


   
    const { data: decks, mutate } = useSwr(user.id, getDecks)

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


    // Reset panel view and content when search params change
    useEffect(() => {
        setPanelView(null)
        setPanelContent(null)
    }, [searchParams])


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

    // const pickFile = async (selectedFile: File | null) => {
    //     // Check if the file is a PDF
    //     if (selectedFile) {
    //         if (selectedFile.type === 'application/pdf') {
    //             setLoading(true);
    //             const newUploadUrl = await getUploadUrl(selectedFile.name);
    //             if ('error' in newUploadUrl) {
    //                 setErrorMessage('Error getting upload URL. Please try again.');
    //                 setFile(null);
    //                 setLoading(false);
    //                 return;
    //             }
    //             setNewUUID(newUploadUrl.uuid)
    //             setNewBackendId(newUploadUrl.backendId)
    //
    //
    //             setUploadUrl(newUploadUrl.url)
    //             setFile(selectedFile);
    //             setErrorMessage('');
    //             setLoading(false);
    //         } else {
    //             setErrorMessage('Please upload a valid PDF file.');
    //             setFile(null);
    //         }
    //     }
    // }

    useEffect(() => {
        console.log("User id: ", user.id)
    }, [user])

    const handleDrag = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragIn = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setDragActive(true);
        }
    };

    const handleDragOut = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const files = event.dataTransfer.files;
            setSelectedFile(files[0])
            event.dataTransfer.clearData();
            console.log("Selected file set.")
            await sendMessage({ content: "File uploaded", role: "user", file: files[0] })
        }
    };

    const sendMessage = async (message: { content: string, role: "user", file?: File }, quick?: boolean) => {
        // if quick message, think about how to handle it. Set view to tool and content to message.content
        console.log("Sending Message...")
        console.log("Content:", message.content)
        if (!message.content) return
        setIsLoading(true)
        try {
            const newUserMessage = {

                content: message.file ? `Uploaded pitch deck ${message.file.name}` : message.content,
                role: message.role,
                id: "temp",
                type: "text",
            }


            setChatMessageLoading(true)
            // Create a FormData object to send both text and file
            const formData = new FormData();
            formData.append('message', message.content);
            formData.append('role', message.role);
            if (message.file) {

                formData.append('file', message.file);
                setLastUploadedFileName(message.file.name)
            }
            setDisplayedMessages([...displayedMessages,
                newUserMessage
            ])
            scrollToEnd()


            const response = await sendInterviewChatMessage(uuid, formData, user.id);


            if (!response || 'error' in response) {
                setLastUploadedFileName(null)
                console.error("Error sending message: ", response?.error, response?.message)
                setDisplayedMessages([...displayedMessages,
                    newUserMessage,
                {
                    content: "There was an error processing your request. Please try again.",
                    role: 'assistant',
                    id: nanoid(),
                    type: "text" as PreloChatMessageType
                }
                ])
                return
            }
            if (quick) {
                if (response.type === "email") {
                    setPanelView("email")
                    setPanelContent(response.message as EmailContent)
                } else {
                    setPanelView("tool")
                    setPanelContent(response.message)
                }
                
                const newMessage = {
                    content: "Output displayed in panel 👉",
                    role: 'assistant',
                    id: nanoid(),
                    type: "text" as PreloChatMessageType
                }
                setDisplayedMessages([...displayedMessages, newUserMessage, newMessage]);
                setChatMessageLoading(false)
                scrollToEnd()
                return
            }

            const newMessage = {
                content: response.message,
                role: 'assistant',
                id: nanoid(),
                type: "text" as PreloChatMessageType
            }
            // const newClaudeMessage = {
            //     content: response.claude_message,
            //     role: 'assistant',
            //     id: nanoid()
            // }
            //
            // const newGPT4oMessage = {
            //     content: response.gpt4o_message,
            //     role: 'assistant',
            //     id: nanoid()
            // }
            // setDisplayedClaudeMessage(newClaudeMessage)
            // setDisplayedGPT4oMessage(newGPT4oMessage)

            setDisplayedMessages([...displayedMessages, newUserMessage, newMessage]);

            setChatMessageLoading(false)

            scrollToEnd()

        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)

        }
    }

    const selectedTemplate = (template: string) => {
        console.log("Selected template: ", template)
        sendMessage({ content: template, role: "user" })
    }

    return (
        <>
            <div className={'pt-4 md:pt-10 size-full mx-auto box-border'}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}

            >
                {dragActive && (
                    <div
                        className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center"

                    >
                        <div className="text-white text-2xl font-bold">Drop PDF here</div>
                    </div>
                )}
                <>
                    <div className="flex flex-col-reverse sm:flex-row h-full">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel>
                                <div
                                    className="flex flex-col w-full h-full">
                                    <div className="flex flex-col p-y-12 w-4/5 mx-auto h-full">

                                        <ChatList messages={displayedMessages} user={user}
                                            chatMessageLoading={chatMessageLoading}
                                             />
                                        

                                        <ChatPanel
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
                                <ScrollArea className="flex flex-col size-full pb-8">
                                    <Panel user={user} decks={decks} view={panelView} content={panelContent} />
                                </ScrollArea>
                            </ResizablePanel>
                        </ResizablePanelGroup>


                    </div>

                </>

            </div>
        </>
    )

}