import {BarChart, RefreshCcw} from "lucide-react";
import {PitchDeck, PitchDeckProcessingStatus} from "@prisma/client/edge";
import ProgressBar from "@/components/progress-bar";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getDeck} from "@/app/actions/interview";
import Link from "next/link";

interface PitchDeckProps {
    deck: PitchDeck

}

export default function ViewPitchDeck({deck}: PitchDeckProps) {
    const [displayedDeck, setDisplayedDeck] = useState<PitchDeck | null>(deck);
    const router = useRouter();

    useEffect(() => {
        const updateDeck = async (deckId: string) => {
            const updatedDeck = await getDeck(deckId);
            setDisplayedDeck(updatedDeck);
        }
        void updateDeck(deck.uuid)
    }, [deck]);


    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-4">
                    {deck.status === PitchDeckProcessingStatus.COMPLETE && (
                        <Link href={`?report_uuid=${deck.reportUUID}&deck_uuid=${deck.uuid}&view=report`}
                              className="cursor-pointer hover:bg-objections flex flex-row justify-center items-center space-x-2 p-2 rounded-lg"
                        >
                            <BarChart className="text-blue-500 items-center"/>
                            <span className="text-base break-words">{deck.name}</span>
                        </Link>
                    )}
                    {deck.status === PitchDeckProcessingStatus.PROCESSING && (
                        <>
                            <BarChart className="text-blue-500 items-center"/>
                            <span className="text-base break-words">{deck.name}</span>
                        </>
                    )}

                </div>
                <div className="flex items-center space-x-4 justify-center">
                    {deck.status === PitchDeckProcessingStatus.PROCESSING && (
                        <>
                            <div className="w-48">
                                <ProgressBar/>
                            </div>
                            <RefreshCcw className="animate-spin text-blue-500"/>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}