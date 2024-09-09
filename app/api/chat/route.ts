import { NextRequest, NextResponse } from 'next/server';
import {prisma} from "@/lib/utils";
import { PitchDeck, PitchDeckProcessingStatus, Organization } from '@prisma/client/edge';
import { auth } from '@/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  
//needs to get the deck uuid from the request body, and the message to send. It should be a limited list of possible messages
//then, based on the message, it will send a chat message to the prelo api. Should I dynamically create a conversation based on the company id? 
//that way, all messages related to that company are in a single conversation that can be looked up and used as context for future conversations.
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
    // get report uuid and deck uuid from the request body
    const { report_uuid, deck_uuid, message } = await request.json();

    //send message and uuids to prelo api

    const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/mini_chat/`, {
      method: "POST",
      headers: {
          Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
      },
      body: JSON.stringify({
          deck_uuid: deck_uuid,
          report_uuid: report_uuid,
          message: message
      })

  })
  const parsed = await getInvestorReportResponse.json()

   
    
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