'use client'
import {useEffect, useRef, useState} from "react";
import {ICloseEvent, IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {CodeBlock} from "@/components/ui/codeblock";
import {MemoizedReactMarkdown} from "@/components/markdown";
import LoadingSpinner from "@/components/analyze/loading-spinner";
import Scores from "@/components/analyze/scores";

interface PitchDeckAnalysisProps {
    pitchDeckAnalysis: string
    uuid: string
    scores: {
        market: {
            'score': number
            'reason': string
        },
        team: {
            'score': number
            'reason': string
        },
        founder: {
            'score': number
            'reason': string
        },
        product: {
            'score': number
            'reason': string
        },
        traction: {
            'score': number
            'reason': string

        }
    }
}

const steps = [
    "Uploading pitch deck",
    "Processing pitch deck",
    "Analyzing pitch deck",
    "Generating report",
    "Displaying report"
]

export default function PitchDeckAnalysis({pitchDeckAnalysis, uuid, scores}: PitchDeckAnalysisProps) {
    const client = useRef<W3CWebSocket | null>(null)
    const [displayedReport, setDisplayedReport] = useState<string>(pitchDeckAnalysis)
    const [currentStep, setCurrentStep] = useState<number>(0)
    useEffect(() => {

        const connectSocket = () => {

            // client.current = new W3CWebSocket(`ws://localhost:3000/api/socket/`)
            if (uuid) {
                client.current = new W3CWebSocket(
                    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}prelo/${uuid}/`
                )

                // client.current = new W3CWebSocket(
                //     `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}cofounder/${sessionId}/`
                // )

                client.current.onopen = () => {
                    console.log("WebSocket Client Connected")
                }

                client.current.onmessage = (message: IMessageEvent) => {
                    const data = JSON.parse(message.data.toString())
                    console.log(data)
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
            <LoadingSpinner steps={steps} currentStep={currentStep}/>
            <div className="text-base leading-6 cursor-text select-all flex flex-col w-full">
                <div className="w-full mx-auto">
                    <div className="max-w-3xl mx-auto">
                        <Scores scores={scores}/>
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