import { NextResponse } from 'next/server';
import {prisma} from "@/lib/utils";
import { PitchDeck, PitchDeckProcessingStatus, Organization } from '@prisma/client/edge';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
  
//needs to get the deck uuid from the request body. Then it should fetch the report from the backend api and return it the same as it would for the app front end.

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

  const { deckUUID, reportUUID } = await request.json();

  try {
   
    const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/report/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            deck_uuid: deckUUID,
            report_uuid: reportUUID
        })

    })
    const parsed = await getInvestorReportResponse.json()

    const report = {
        companyName: parsed.company_name,
        summary: parsed.summary,
        believe: parsed.believe,
        traction: parsed.traction,
        concerns: JSON.parse(parsed.concerns).concerns,
        investmentScore: parsed.investment_potential_score,
        amountRaising: parsed.amount_raising,
        recommendation: parsed.recommendation_reasons,
        nextStep: JSON.parse(parsed.recommended_next_steps),
        executiveSummary: parsed.executive_summary,
        founders: JSON.parse(parsed.founders),
        scores: parsed.scores,
        founderContactInfo: JSON.parse(parsed.founders_contact_info).results,
        scoreExplanation: parsed.score_explanation
    }
    

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching and updating decks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
    const headersList = headers();
  const origin = headersList.get('origin') || 'https://your-extension-origin.com';

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    },
  });
  }