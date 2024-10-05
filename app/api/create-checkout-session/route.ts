import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const session = await createCheckoutSession(userId);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}