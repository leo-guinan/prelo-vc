'use client'
import {ChatList} from "@/components/chat-list";
import {ChatScrollAnchor} from "@/components/chat-scroll-anchor";
import {EmptyScreen} from "@/components/empty-screen";
import {ChatPanel} from "@/components/chat-panel";
import {useEffect, useRef, useState} from "react";
import {Message, PitchDeckScores} from "@/lib/types";
import {sendChatMessage} from "@/app/actions/analyze";
import Scores from "@/components/analyze/scores";
import {nanoid} from "@/lib/utils";
import Report from "@/components/analyze/report";
import FAQ from "@/components/analyze/faq";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {ScrollArea} from "@/components/ui/scroll-area";
import type {SWRSubscriptionOptions} from 'swr/subscription'
import useSWRSubscription from 'swr/subscription'
import AnalysisCompletedModal from "@/components/analyze/analysis-completed-modal";

interface PreloChatMessage {
    id: string
    content: string
    role: string
}

interface AnalysisChatProps {
    messages: Message[]
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
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>(messages)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const [loadedScores, setLoadedScores] = useState<PitchDeckScores | null>(scores)
    const [displayedTitle, setDisplayedTitle] = useState<string>(title)
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [completedDialogOpen, setCompletedDialogOpen] = useState<boolean>(false)
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
    const {
        data,
        error
    } = useSWRSubscription(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}prelo/${uuid}/` as string, (key, {next}: SWRSubscriptionOptions<number, Error>) => {
        console.log("key", key)
        const socket = new WebSocket(key)
        socket.addEventListener('message', (event) => next(null, event.data))
        // @ts-ignore
        socket.addEventListener('error', (event) => next(event.error))
        return () => socket.close()
    })

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [displayedMessages]); // Dependency array includes the data triggering the scroll

    useEffect(() => {
        if (!data) return
        const parsedData = JSON.parse(data.toString())

        if (parsedData.scores) {
            setLoadedScores(parsedData.scores)
        }
        if (parsedData.name) {
            setDisplayedTitle(parsedData.name)
        }
        if (parsedData.pitch_deck_summary) {
            setDisplayPitchDeckSummary(parsedData.pitch_deck_summary)
        }
        if (parsedData.traction) {
            setDisplayTraction(parsedData.traction)
        }
        if (parsedData.concerns) {
            setDisplayedConcerns(parsedData.concerns)
        }
        if (parsedData.believe) {
            setDisplayedBelieve(parsedData.believe)
        }
        if (parsedData.recommendation) {
            setDisplayedRecommendation(parsedData.recommendation)
        }
        if (parsedData.summary) {
            setDisplayPitchDeckSummary(parsedData.summary)
        }
        if (parsedData.recommendation) {
            setDisplayedRecommendationOption({value: parsedData.recommendation})
        }
        if (parsedData.recommendation_reasons) {
            setDisplayedRecommendation(parsedData.recommendation_reasons)
        }
        setCompletedDialogOpen(true)
    }, [data])


    const sendMessage = async (message: { content: string, role: "user" }) => {
        if (!message.content) return
        setIsLoading(true)
        try {
            setDisplayedMessages([...displayedMessages,
                {
                    content: message.content,
                    role: message.role,
                    id: "temp",
                    type: "text"
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
                    id: "temp",
                    type: "text"
                },
                {
                    content: response,
                    role: 'assistant',
                    id: nanoid(),
                    type: "text"
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
            <div className={'pt-4 md:pt-10 size-full mx-auto box-border'}>
                {displayedRecommendationOption && displayedRecommendation && displayedTraction && displayedConcerns && displayedBelieve && displayedPitchDeckSummary ? (
                    <>
                        <div className="flex flex-col-reverse sm:flex-row h-full">
                            <ResizablePanelGroup direction="horizontal">
                                <ResizablePanel>
                                    <div
                                        className="flex flex-col w-full h-full">
                                        <div className="flex flex-col p-y-12 w-4/5 mx-auto h-full">
                                            <ScrollArea className="flex flex-col size-full pb-8">
                                                <ChatList messages={displayedMessages} user={user}
                                                          chatMessageLoading={chatMessageLoading}/>
                                                <ChatScrollAnchor/>
                                            </ScrollArea>
                                            <div className="relative">
                                                <ChatPanel
                                                    isLoading={isLoading}
                                                    input={input}
                                                    setInput={setInput}
                                                    sendMessage={sendMessage}

                                                />
                                            </div>
                                            <div ref={bottomRef}/>
                                        </div>
                                    </div>

                                </ResizablePanel>
                                <ResizableHandle/>
                                <ResizablePanel>
                                    <div className="flex flex-col size-full overflow-y-scroll">
                                        <div className="mx-auto border-box w-4/5">
                                            <h1 className="flex justify-center w-full mx-auto mt-2 mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl">{displayedTitle}</h1>
                                            <ScrollArea className="flex flex-col size-full">
                                                {/*<Scores scores={loadedScores}/>*/}
                                                <Report recommendationOption={displayedRecommendationOption}
                                                        believe={displayedBelieve}
                                                        pitchDeckSummary={displayedPitchDeckSummary}
                                                        concerns={displayedConcerns}
                                                        recommendation={displayedRecommendation}
                                                        traction={displayedTraction}/>
                                            </ScrollArea>
                                        </div>
                                    </div>

                                </ResizablePanel>
                            </ResizablePanelGroup>


                        </div>

                    </>
                ) : (
                    <>
                        <div className="flex flex-col-reverse sm:flex-row h-[calc(100vh-200px)]">
                            <div className="flex flex-col size-full sm:w-1/2 overflow-y-scroll pb-[200px]  ">
                                <div className="mx-auto border-box w-4/5">
                                    <FAQ user={user}/>
                                </div>
                            </div>
                            <div className="flex flex-col size-full sm:w-1/2 overflow-y-scroll">
                                <div className="flex flex-col w-4/5 mx-auto">
                                    <h1 className="flex justify-center w-full mx-auto mt-2 mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl">{displayedTitle}</h1>
                                    <EmptyScreen/>
                                </div>
                            </div>
                        </div>

                    </>

                )}
            </div>
            <AnalysisCompletedModal open={completedDialogOpen} setOpen={setCompletedDialogOpen}/>
        </>
    )

}