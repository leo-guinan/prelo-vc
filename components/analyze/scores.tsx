import {CircularProgressBar} from "@/components/analyze/score";
import {useEffect, useState} from "react";

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
    }
}

export default function Scores({scores}: ScoresProps) {
    const [displayScores, setDisplayScores] = useState<boolean>(false)

    useEffect(() => {
        if (scores.market && scores.team && scores.founder && scores.product && scores.traction) {
            setDisplayScores(true)
        }
    });

    return (
        <>
            {displayScores && (
                <div className="flex flex-row w-full justify-center mx-auto">
                    <CircularProgressBar progress={scores.market.score} color="#5CE1E6" title="Market"/>
                    <CircularProgressBar progress={scores.team.score} color="#FF9494" title="Team"/>
                    <CircularProgressBar progress={scores.founder.score} color="#FFCC2F"
                                         title="Founder/Market Fit"/>
                    <CircularProgressBar progress={scores.product.score} color="#FF9494" title="Product"/>
                    <CircularProgressBar progress={scores.traction.score} color="#5CE1E6" title="Traction"/>
                </div>
            )}
        {/*    TODO: Loading state for scores with skeleton*/}
        </>
    );
}