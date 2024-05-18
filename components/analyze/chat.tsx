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
import Scores from "@/components/analyze/scores";
import {nanoid} from "@/lib/utils";
import Report from "@/components/analyze/report";
import FAQ from "@/components/analyze/faq";

interface PreloChatMessage {
    id: string
    content: string
    role: string
}

interface AnalysisChatProps {
    messages: PreloChatMessage[]
    uuid: string
    scores: PitchDeckScores
    title: string
    concerns: string
    believe: string
    traction: string
    recommendation: string
    summary: string
    user: {
        name?: string | null
        image?: string | null
    }
    recommendationOption: RecommendationOption
}

export interface RecommendationOption {
    value: "contact" | "maybe" | "pass"
}

export default function AnalysisChat({
                                         messages,
                                         uuid,
                                         scores,
                                         title,
                                         user,
                                         concerns,
                                         believe,
                                         traction,
                                         recommendation,
                                         summary,
                                         recommendationOption
                                     }: AnalysisChatProps) {
    const [displayedMessages, setDisplayedMessages] = useState<PreloChatMessage[]>(messages)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const client = useRef<W3CWebSocket | null>(null)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [loadedScores, setLoadedScores] = useState<PitchDeckScores | null>(scores)
    const [displayedTitle, setDisplayedTitle] = useState<string>(title)
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [chatMessageLoading, setChatMessageLoading] = useState(false)
    const [displayedRecommendation, setDisplayedRecommendation] = useState<string>(recommendation)
    const [displayedPitchDeckSummary, setDisplayPitchDeckSummary] = useState<string>(summary)
    const [displayedTraction, setDisplayTraction] = useState<string>(traction)
    const [displayedConcerns, setDisplayedConcerns] = useState<string>(concerns)
    const [displayedBelieve, setDisplayedBelieve] = useState<string>(believe)
    const [displayedRecommendationOption, setDisplayedRecommendationOption] = useState<RecommendationOption | null>(recommendationOption)

    useEffect(() => {
        console.log(`displayedRecommendationOption: ${displayedRecommendationOption}`)
        console.log(`displayedRecommendation: ${displayedRecommendation}`)
        console.log(`displayedTraction: ${displayedTraction}`)
        console.log(`displayedConcerns: ${displayedConcerns}`)
        console.log(`displayedBelieve: ${displayedBelieve}`)
        console.log(`displayedPitchDeckSummary: ${displayedPitchDeckSummary}`)
    }, [displayedRecommendationOption, displayedRecommendation, displayedTraction, displayedConcerns, displayedBelieve, displayedPitchDeckSummary]) // Dependency array includes the data triggering the scroll


    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [displayedMessages]); // Dependency array includes the data triggering the scroll

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

                    if (data.scores) {
                        setLoadedScores(data.scores)
                    }
                    if (data.name) {
                        setDisplayedTitle(data.name)
                    }
                    if (data.pitch_deck_summary) {
                        setDisplayPitchDeckSummary(data.pitch_deck_summary)
                    }
                    if (data.traction) {
                        setDisplayTraction(data.traction)
                    }
                    if (data.concerns) {
                        setDisplayedConcerns(data.concerns)
                    }
                    if (data.believe) {
                        setDisplayedBelieve(data.believe)
                    }
                    if (data.recommendation) {
                        setDisplayedRecommendation(data.recommendation)
                    }
                    if (data.summary) {
                        setDisplayPitchDeckSummary(data.summary)
                    }
                    if (data.recommendation) {
                        setDisplayedRecommendationOption({value: data.recommendation})
                    }
                    if (data.recommendation_reasons) {
                        setDisplayedRecommendation(data.recommendation_reasons)
                    }


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
            setDisplayedMessages([...displayedMessages,
                {
                    content: message.content,
                    role: message.role,
                    id: "temp"
                },
            ])
            setChatMessageLoading(true)

            const response = await sendChatMessage(uuid, message);

            if (!response) {
                console.error("No response")
                return
            }
            setChatMessageLoading(false)

            setDisplayedMessages([...displayedMessages,
                {
                    content: message.content,
                    role: message.role,
                    id: "temp"
                },
                {
                    content: response,
                    role: 'assistant',
                    id: nanoid()
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
            <div className={'pt-4 md:pt-10 size-full mx-auto overflow-hidden box-border'}>
                {displayedRecommendationOption && displayedRecommendation && displayedTraction && displayedConcerns && displayedBelieve && displayedPitchDeckSummary ? (
                    <>
                        <div className="flex flex-col-reverse sm:flex-row h-[calc(100vh-200px)]">
                            <div className="flex flex-col size-full sm:w-1/2 overflow-y-scroll pb-[200px]  ">
                                <div className="p-y-12">
                                    <ChatList messages={displayedMessages} user={user}
                                              chatMessageLoading={chatMessageLoading}/>
                                    <ChatScrollAnchor/>
                                    <ChatPanel
                                        isLoading={isLoading}
                                        input={input}
                                        setInput={setInput}
                                        sendMessage={sendMessage}

                                    />
                                    <div ref={bottomRef}/>
                                </div>
                            </div>
                            <div className="flex flex-col size-full sm:w-1/2 overflow-y-scroll">
                                <h1 className="flex justify-center w-full mx-auto mt-2 mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl">{displayedTitle}</h1>

                                {/*<Scores scores={loadedScores}/>*/}
                                <Report recommendationOption={displayedRecommendationOption} believe={displayedBelieve}
                                        pitchDeckSummary={displayedPitchDeckSummary} concerns={displayedConcerns}
                                        recommendation={displayedRecommendation} traction={displayedTraction}/>
                            </div>
                        </div>

                    </>
                ) : (
                    <>
                        <div className="flex flex-col-reverse sm:flex-row h-[calc(100vh-200px)]">
                            <div className="flex flex-col size-full sm:w-1/2 overflow-y-scroll pb-[200px]  ">
                                <div className="mx-auto border-box">
                                    <FAQ user={user}/>
                                </div>
                            </div>
                            <div className="flex flex-col size-full sm:w-1/2 overflow-y-scroll">
                                <h1 className="flex justify-center w-full mx-auto mt-2 mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl">{displayedTitle}</h1>
                                <EmptyScreen currentStep={currentStep} user={user}/>
                            </div>
                        </div>

                    </>

                )}
            </div>

        </>
    )

}