'use client'
import React from 'react';
import {PitchDeck} from "@prisma/client/edge";
import ViewPitchDeck from "@/components/interview/pitch-deck";

interface PitchDeckListProps {
    decks: PitchDeck[];

}

export default function PitchDeckList({decks}: PitchDeckListProps) {


    return (
        <div className="p-2">
            <ul className="">
                {decks?.map((deck) => (
                    <li key={deck.id} className="flex items-center p-4 rounded-lg">
                        <ViewPitchDeck deck={deck}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

