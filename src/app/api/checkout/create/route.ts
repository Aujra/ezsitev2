import { stripe } from '@/lib/stripe';
import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await verifyToken();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { items } = await req.json();
    const totalDays = items.reduce((acc: number, item: { days: number }) => acc + item.days, 0);
    const totalAmount = items.reduce((acc: number, item: { price: number }) => acc + item.price, 0);

    // Create Stripe session first
    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      mode: 'payment',
      line_items: items.map((item: { name: string; price: number; days: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.name} - ${item.days} Days`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
    });

    // Create order with the actual Stripe session ID
    await prisma.order.create({
      data: {
        userId: user.id,
        amount: totalAmount,
        days: totalDays,
        seconds: totalDays * 24 * 60 * 60,
        stripeId: session.id,
        status: 'pending',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
