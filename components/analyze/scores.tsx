import {CircularProgressBar} from "@/components/analyze/score";
import {useEffect, useState} from "react";
import {LoadingProgressCircle} from "@/components/analyze/loading-score";

interface ScoresProps {
    scores: {
        market: {
            score: number
            reason: string
        },
        team: {
            score: number
            reason: string
        },
        founder: {
            score: number
            reason: string
        },
        product: {
            score: number
            reason: string
        },
        traction: {
            score: number
            reason: string

        },
        final: {
            score: number
            reason: string
        }
    } | null
}

export default function Scores({scores}: ScoresProps) {
    const [displayScores, setDisplayScores] = useState<boolean>(false)

    useEffect(() => {
        if (scores) {
            setDisplayScores(true)
        }
    }, [scores])

    return (
        <>
            {scores && displayScores && (
                <div className="flex flex-row w-full justify-center mx-auto">
                    <CircularProgressBar progress={scores.market.score} color="#5CE1E6" title="Market"/>
                    <CircularProgressBar progress={scores.team.score} color="#FF9494" title="Team"/>
                    <CircularProgressBar progress={scores.founder.score} color="#FFCC2F"
                                         title="Founder/Market Fit"/>
                    <CircularProgressBar progress={scores.product.score} color="#FF9494" title="Product"/>
                    <CircularProgressBar progress={scores.traction.score} color="#5CE1E6" title="Traction"/>
                </div>
            )}
            {!displayScores && (
                <div className="flex flex-row w-full justify-center mx-auto">
                    <LoadingProgressCircle title={"Market"} color="#5CE1E6"/>
                    <LoadingProgressCircle color="#FF9494" title="Team"/>
                    <LoadingProgressCircle color="#FFCC2F" title="Founder/Market Fit"/>
                    <LoadingProgressCircle color="#FF9494" title="Product"/>
                    <LoadingProgressCircle color="#5CE1E6" title="Traction"/>
                </div>
            )}
        </>
    );
}