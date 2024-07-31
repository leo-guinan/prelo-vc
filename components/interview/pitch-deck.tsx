import {BarChart, RefreshCcw} from "lucide-react";
import {PitchDeck, PitchDeckProcessingStatus} from "@prisma/client/edge";
import ProgressBar from "@/components/progress-bar";
import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {getDeck} from "@/app/actions/interview";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface PitchDeckProps {
    deck: PitchDeck

}

export default function ViewPitchDeck({deck}: PitchDeckProps) {
    const [displayedDeck, setDisplayedDeck] = useState<PitchDeck | null>(deck);
    const searchParams = useSearchParams()
    const isCurrentDeck = searchParams.get('deck_uuid') === deck.uuid
    const pickColor = (score?: number | null) => {
        if (!score) return 'text-gray-500'
        if (score < 75) {
            return 'text-concern'
        } else if (score < 85) {
            return 'text-objections'
        } else {
            return 'text-howTo'
        }
    }

    const deckColor = pickColor(displayedDeck?.matchScore);

    useEffect(() => {
        const updateDeck = async (deckId: string) => {
            const updatedDeck = await getDeck(deckId);
            setDisplayedDeck(updatedDeck);
        }
        void updateDeck(deck.uuid)
    }, [deck]);


    return (
        <>
            <div className="flex flex-col w-full p-2">
                <div className="flex flex-row items-center space-x-4 ">
                    {deck.status === PitchDeckProcessingStatus.COMPLETE && (
                        <Link href={`?report_uuid=${deck.reportUUID}&deck_uuid=${deck.uuid}&view=report`}
                              className={cn("cursor-pointer hover:bg-[#27272A] py-2 flex flex-row justify-start items-center space-x-2 rounded-lg w-full", isCurrentDeck ? "bg-[#27272A]" : "")}
                        >
                            <div className="w-1/8">
                                <BarChart className={cn("text-blue-500 items-center", deckColor)}/>
                            </div>
                            <div>
                                <span className="text-base break-words">{deck.name}</span>
                            </div>
                        </Link>
                    )}
                    {deck.status === PitchDeckProcessingStatus.PROCESSING && (
                        <>
                            <div className="w-1/8">
                                <BarChart className={cn("text-blue-500 items-center", deckColor)}/>
                            </div>
                            <div>
                                <span className="text-base break-words">{deck.name}</span>
                            </div>
                        </>
                    )}

                </div>
                <div className="flex items-center space-x-2 justify-center">
                    {deck.status === PitchDeckProcessingStatus.PROCESSING && (
                        <>
                            <div className="w-full">
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