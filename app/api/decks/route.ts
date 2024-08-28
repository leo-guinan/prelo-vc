import { NextResponse } from 'next/server';
import {prisma} from "@/lib/utils";
import { PitchDeck, PitchDeckProcessingStatus, Organization } from '@prisma/client/edge';
import { auth } from '@/auth';

export async function POST() {

  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      organization: true
    }
  })

  const currentOrg = membership?.organization

  try {
    const decks = await prisma.pitchDeck.findMany({
      where: { ownerId: currentOrg?.id },
      
    });

    const updatedDecks = await Promise.all(
      decks.map(async (deck: PitchDeck) => {
        if (!deck.companyName && deck.reportUUID) {
          try {
            const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/report/status/`, {
                method: "POST",
                headers: {
                    Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
                },
                body: JSON.stringify({
                    deck_uuid: deck.uuid
                })
    
            })
            const parsed = await getInvestorReportResponse.json()
            if (parsed.report_uuid) {
                deck = await prisma.pitchDeck.update({
                    where: {
                        uuid: deck.uuid
                    },
                    data: {
                        reportUUID: parsed.report_uuid,
                        status: PitchDeckProcessingStatus.COMPLETE,
                        matchScore: parsed.match_score,
                        companyName: parsed.company_name
                    }
                })
            }
        
              return deck;
            
          } catch (error) {
            console.error(`Failed to fetch company name for deck ${deck.id}:`, error);
          }
        }
        return deck;
      })
    );

    return NextResponse.json(updatedDecks);
  } catch (error) {
    console.error('Error fetching and updating decks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }