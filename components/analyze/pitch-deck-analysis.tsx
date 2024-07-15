'use client'
import {useEffect, useRef, useState} from "react";
import {ICloseEvent, IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {CodeBlock} from "@/components/ui/codeblock";
import {MemoizedReactMarkdown} from "@/components/markdown";
import LoadingSpinner from "@/components/analyze/loading-spinner";
import Scores from "@/components/analyze/scores";
import {PitchDeckScores} from "@/lib/types";

interface PitchDeckAnalysisProps {
    pitchDeckAnalysis: string
    complete: boolean
    uuid: string
    scores: PitchDeckScores
}

const steps = [
    "Uploading pitch deck",
    "Analyzing pitch deck",
    "Generating report",
]

export default function PitchDeckAnalysis({pitchDeckAnalysis, uuid, scores, complete}: PitchDeckAnalysisProps) {
    const client = useRef<W3CWebSocket | null>(null)
    const [displayedReport, setDisplayedReport] = useState<string>(pitchDeckAnalysis)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [displayedScores, setDisplayedScores] = useState<PitchDeckScores>(scores)
    const [isComplete, setIsComplete] = useState<boolean>(complete)
    useEffect(() => {

        const connectSocket = () => {

            if (uuid) {
                client.current = new W3CWebSocket(
                    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}prelo/${uuid}/`
                )


                client.current.onopen = () => {
                    console.log("WebSocket Client Connected")
                }

                client.current.onmessage = (message: IMessageEvent) => {
                    const data = JSON.parse(message.data.toString())
                    if (data.status) {
                        switch(data.status) {
                            case "RA":
                                setCurrentStep(1)
                                break
                            case "RR":
                                setCurrentStep(2)
                                break
                            case "CP":
                                setCurrentStep(3)
                                break
                            default:
                                setCurrentStep(0)

                        }
                    }
                    if (data.scores) {
                        setDisplayedScores(data.scores)
                        setIsComplete(true)
                    }
                    setDisplayedReport(data.message)
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
    }, [uuid])
    return (
        <div>
            {!isComplete && (
                <LoadingSpinner steps={steps} currentStep={currentStep}/>
            )}
            <div className="text-base leading-6 cursor-text select-all flex flex-col w-full">
                <div className="w-full mx-auto">
                    <div className="max-w-3xl mx-auto">
                        {isComplete && (
                            <Scores scores={displayedScores}/>
                        )}
                    </div>
                </div>

                <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 flex flex-col mx-auto"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({children}) {
                            return <p className="mb-2 last:mb-0">{children}</p>
                        },
                        code({node, inline, className, children, ...props}) {
                            if (children.length) {
                                if (children[0] == '▍') {
                                    return (
                                        <span className="mt-1 cursor-default animate-pulse">▍</span>
                                    )
                                }

                                children[0] = (children[0] as string).replace('`▍`', '▍')
                            }

                            const match = /language-(\w+)/.exec(className || '')

                            if (inline) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }

                            return (
                                <CodeBlock
                                    key={Math.random()}
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            )
                        }
                    }}
                >
                    {displayedReport}
                </MemoizedReactMarkdown>

            </div>
        </div>
    );
}