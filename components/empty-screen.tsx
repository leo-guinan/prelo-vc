'use client'
import {useEffect, useState} from "react";
import {AnalysisChatMessage} from "@/lib/types";
import {LoadingProgressCircle} from "@/components/analyze/loading-score";
import ProgressBar from "@/components/progress-bar";
import {useTheme} from "next-themes";

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

    const theme = useTheme()

    useEffect(() => {
        let message = INITIAL_MESSAGE
        for (let i = 0; i < STEPS.length; i++) {
            if (i < currentStep) {
                message += "✅ "
                message += STEPS[i]
            } else {
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

    const deckColor = theme.theme === "dark" ? "#F9F9F9" : "#242424"

    return (
        <div className={'pb-[200px] pt-4 md:pt-10'}>
            <div className="flex flex-col w-full justify-center mx-auto">
                <div className="flex sm:flex-row">
                    <LoadingProgressCircle title={"Market"} color="#8BDDE4"/>
                    <LoadingProgressCircle color="#FF7878" title="Team"/>
                    <LoadingProgressCircle color={deckColor} title="Deck Score"/>
                    <LoadingProgressCircle color="#FF7878" title="Product"/>
                    <LoadingProgressCircle color="#8BDDE4" title="Traction"/>
                </div>
                <div className="flex items-start">
                    <ProgressBar color="bg-howTo" borderColor="border-howTo"/>
                </div>
            </div>
        </div>
    )
}