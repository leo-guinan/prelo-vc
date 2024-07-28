import {BarChart, FileText, RefreshCcw} from "lucide-react";
import {PitchDeck, PitchDeckProcessingStatus} from "@prisma/client/edge";
import ProgressBar from "@/components/progress-bar";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getDeck} from "@/app/actions/interview";

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

    const handleViewReport = async (deckId: string) => {
        console.log(`Viewing report for deck ${deckId}`);
        // Implement your logic to view the report
        const deck = await getDeck(deckId)
        if (!deck) {
            return;
        }
        router.push(`?report_uuid=${deck.reportUUID}&deck_uuid=${deck.uuid}&view=report`)
    };
    return (
        <>
            <div className="flex items-center space-x-4">
                <BarChart className="text-blue-500"/>
                <span className="font-medium">{deck.name}</span>
            </div>
            <div className="flex items-center space-x-4 justify-center">
                {deck.status === PitchDeckProcessingStatus.PROCESSING ? (
                    <div className="w-48">
                        <ProgressBar/>
                    </div>
                ) : (
                    <button
                        onClick={() => handleViewReport(deck.uuid)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <FileText className="mr-2"/>
                        View Report
                    </button>
                )}
                {deck.status === PitchDeckProcessingStatus.PROCESSING && (
                    <RefreshCcw className="animate-spin text-blue-500"/>
                )}
            </div>
        </>
    )
}