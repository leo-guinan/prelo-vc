'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, RefreshCcw, FileText } from 'lucide-react';
import {PitchDeck, PitchDeckProcessingStatus} from "@prisma/client/edge";
import ProgressBar from "@/components/progress-bar";
import { getDeck } from '@/app/actions/interview';
import { useRouter } from 'next/navigation';
import ViewPitchDeck from "@/components/interview/pitch-deck";

interface PitchDeckListProps {
    decks: PitchDeck[];

}

export default function PitchDeckList({decks}: PitchDeckListProps) {


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Uploaded Decks</h2>
      <ul className="space-y-4">
        {decks?.map((deck) => (
          <li key={deck.id} className="flex items-center justify-between p-4 rounded-lg">
            <ViewPitchDeck deck={deck} />
          </li>
        ))}
      </ul>
    </div>
  );
};

