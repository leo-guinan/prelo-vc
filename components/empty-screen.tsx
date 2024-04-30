'use client'
import {ChatList} from "@/components/chat-list";
import {useEffect, useState} from "react";
import {AnalysisChatMessage} from "@/lib/types";

const INITIAL_MESSAGE = "Feedback may take a few minutes. . .  \n"
const STEPS = [
    "Loading Deck  \n",
    "Performing Analysis  \n",
    "Writing Report  \n"
]

export function EmptyScreen({currentStep}: { currentStep: number }) {

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
            <ChatList messages={[currentMessage]}/>
        </div>
    )
}