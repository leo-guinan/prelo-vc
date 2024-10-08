import { Prisma } from "@prisma/client/edge";
import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

export async function createOrRetrieveCustomer(userId: string, email: string) {
  const { prisma } = await import('@/lib/utils');
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.stripeCustomerId) {
    const customer = await stripe.customers.create({ email });
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
    return customer.id;
  }

  return user.stripeCustomerId;
}

export async function createCheckoutSession(userId: string) {
  const { prisma } = await import('@/lib/utils');
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error('User not found');

  const customerId = await createOrRetrieveCustomer(userId, user.email);
  const params: Stripe.Checkout.SessionCreateParams = {
    submit_type: 'pay',
    payment_method_types: ['card'],
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  };
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);
 
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   payment_method_types: ['card'],
  //   line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  //   metadata: { userId, priceId: process.env.STRIPE_PRICE_ID }, // Include priceId in metadata
  // });

  return checkoutSession;
}

export async function manageSubscription(userId: string) {
  const { prisma } = await import('@/lib/utils');
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.stripeCustomerId) throw new Error('User has no Stripe customer ID');

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return session.url;
}

// Add this new function
export async function upsertSubscription(userId: string, subscriptionData: {
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
  stripeStatus: string;
}) {
  const { prisma } = await import('@/lib/utils');

  try {
    // Try to update existing subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { userId,
        stripeSubscriptionId: subscriptionData.stripeSubscriptionId
       },
      data: subscriptionData,
    });
    return updatedSubscription;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // If subscription doesn't exist, create a new one
      const newSubscription = await prisma.subscription.create({
        data: {
          userId,
          ...subscriptionData,
        },
      });
      return newSubscription;
    }
    throw error; // Re-throw if it's a different error
  }
}