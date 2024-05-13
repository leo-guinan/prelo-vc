'use client'
import {ChatList} from "@/components/chat-list";
import {useEffect, useState} from "react";
import {AnalysisChatMessage} from "@/lib/types";
import {LoadingProgressCircle} from "@/components/analyze/loading-score";

const INITIAL_MESSAGE = "Feedback may take a few minutes. . .  \n"
const STEPS = [
    "Loading Deck  \n",
    "Performing Analysis  \n",
    "Writing Report  \n"
]

interface EmptyScreenProps {
    currentStep: number
    user: {
        name?: string | null
        image?: string | null
    }
}

export function EmptyScreen({currentStep, user}: EmptyScreenProps) {

    const [currentMessage, setCurrentMessage] = useState<AnalysisChatMessage>()

    useEffect(() => {
        let message = INITIAL_MESSAGE
        for (let i = 0; i < STEPS.length; i++) {
            if (i < currentStep) {
                message += "✅ "
                message += STEPS[i]
            }
             else {
                 message += STEPS[i]
            }
        }
        setCurrentMessage({
            id: "-1",
            content: message,
            role: "ai"
        })
    }, [currentStep]);

    if (!currentMessage) {
        return null
    }

    return (
        <div className={'pb-[200px] pt-4 md:pt-10'}>
            <div className="flex flex-col sm:flex-row w-full justify-center mx-auto">
                <LoadingProgressCircle title={"Market"} color="#5CE1E6"/>
                <LoadingProgressCircle color="#FF9494" title="Team"/>
                <LoadingProgressCircle color="#242424" title="Deck Score"/>
                <LoadingProgressCircle color="#FF9494" title="Product"/>
                <LoadingProgressCircle color="#5CE1E6" title="Traction"/>
            </div>
            <ChatList messages={[currentMessage]} user={user} chatMessageLoading={false}/>
        </div>
    )
}