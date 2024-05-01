'use client'
import {ChatList} from "@/components/chat-list";
import {ChatScrollAnchor} from "@/components/chat-scroll-anchor";
import {EmptyScreen} from "@/components/empty-screen";
import {ChatPanel} from "@/components/chat-panel";
import {useEffect, useRef, useState} from "react";
// import {sendPreloChatMessage} from "@/app/actions/prelo";
import {ICloseEvent, IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";
import {PitchDeckScores} from "@/lib/types";
import {sendChatMessage} from "@/app/actions/analyze";

interface PreloChatMessage {
    id: string
    content: string
    role: string
}

interface AnalysisChatProps {
    messages: PreloChatMessage[]
    pitchDeckAnalysis: string
    complete: boolean
    uuid: string
    scores: PitchDeckScores
}

export default function AnalysisChat({messages, pitchDeckAnalysis, uuid, scores, complete}: AnalysisChatProps) {
    const [displayedMessages, setDisplayedMessages] = useState<PreloChatMessage[]>(messages)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const client = useRef<W3CWebSocket | null>(null)
    const [currentStep, setCurrentStep] = useState<number>(0)


    useEffect(() => {

        const connectSocket = () => {

            // client.current = new W3CWebSocket(`ws://localhost:3000/api/socket/`)
            if (uuid) {
                if (!client.current) {
                    client.current = new W3CWebSocket(
                        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}prelo/${uuid}/`
                    )
                }

                // client.current = new W3CWebSocket(
                //     `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}cofounder/${sessionId}/`
                // )

                client.current.onopen = () => {
                    console.log("WebSocket Client Connected")
                }

                client.current.onmessage = (message: IMessageEvent) => {
                    const data = JSON.parse(message.data.toString())
                    if (data.status) {
                        switch (data.status) {
                            case "RA":
                                setCurrentStep(1)
                                break
                            case "RR":
                                setCurrentStep(2)
                                break
                            case "CP":
                                setCurrentStep(3)
                                setDisplayedMessages(d => [{
                                    content: data.message,
                                    role: 'assistant',
                                    id: data.id
                                }])
                                break
                            default:
                                setCurrentStep(0)

                        }
                    }
                    // make sure message id isn't already in the list
                    if (displayedMessages.find(m => m.id === data.id)) {
                        //replace the message
                        setDisplayedMessages(d => d.map(m => m.id === data.id ? data : m))
                    }
                    if (data.message) {
                        setDisplayedMessages(d => [...d, {
                            content: data.message,
                            role: 'assistant',
                            id: data.id
                        }])
                    }
                }

                client.current.onclose = (event: ICloseEvent) => {
                    setTimeout(() => {
                        connectSocket()
                    }, 5000) // retries after 5 seconds.
                }

                client.current.onerror = (error: Error) => {
                    console.log(`WebSocket Error: ${JSON.stringify(error)}`)
                }
            }
        }

        connectSocket()
    }, [displayedMessages, uuid])

    const sendMessage = async (message: { content: string, role: "user" }) => {
        if (!message.content) return
        setIsLoading(true)
        try {
            setDisplayedMessages([...displayedMessages, {
                content: message.content,
                role: message.role,
                id: "temp"
            },
                {
                    content: "...",
                    role: 'assistant',
                    id: "temp"
                }
            ])

            const response = await sendChatMessage(uuid, message);

            if (!response) {
                console.error("No response")
                return
            }

            setDisplayedMessages([...displayedMessages, {
                content: message.content,
                role: message.role,
                id: "temp"
            },
                {
                    content: "...",
                    role: 'assistant',
                    id: response
                }
            ])
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className={'pb-[200px] pt-4 md:pt-10'}>
                {displayedMessages.length ? (
                    <>
                        <ChatList messages={displayedMessages}/>
                        <ChatScrollAnchor/>
                    </>
                ) : (
                    <EmptyScreen currentStep={currentStep}/>
                )}
            </div>
            {displayedMessages.length > 0 && (
                <ChatPanel
                    isLoading={isLoading}
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}

                />
            )}


        </>
    )

}