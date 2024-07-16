import {CircularProgressBar} from "@/components/analyze/score";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";

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
    const theme = useTheme()
    const overrideColor = theme.theme === "dark" ? "#F9F9F9" : "#242424"

    useEffect(() => {
        if (scores) {
            setDisplayScores(true)
        }
    }, [scores])

    return (
        <>
            {scores && displayScores && (
                <div className="flex flex-col sm:flex-row w-full justify-center mx-auto max-w-2xl">
                    <CircularProgressBar progress={scores.market.score} title="Market"/>
                    <CircularProgressBar progress={scores.team.score} title="Team"/>
                    <CircularProgressBar progress={scores.final.score} title="VC Match" overrideColor={overrideColor}/>
                    <CircularProgressBar progress={scores.product.score}  title="Product"/>
                    <CircularProgressBar progress={scores.traction.score} title="Traction"/>
                </div>
            )}
        </>
    );
}