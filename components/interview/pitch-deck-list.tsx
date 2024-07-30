'use client'
import React from 'react';
import {PitchDeck} from "@prisma/client/edge";
import ViewPitchDeck from "@/components/interview/pitch-deck";

interface PitchDeckListProps {
    decks: PitchDeck[];

}

export default function PitchDeckList({decks}: PitchDeckListProps) {


    return (
        <div className="p-4">
            <ul className="space-y-4">
                {decks?.map((deck) => (
                    <li key={deck.id} className="flex items-center justify-between p-4 rounded-lg">
                        <ViewPitchDeck deck={deck}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

