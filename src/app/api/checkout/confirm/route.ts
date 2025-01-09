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

    const { sessionId } = await req.json();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return new NextResponse("Payment not completed", { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { 
        stripeId: sessionId,
        userId: user.id // Ensure order belongs to authenticated user
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Update order status and license in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'completed' }
      });

      await tx.license.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          key: `${user.id}-${Date.now()}`,
          timeBalance: order.seconds,
        },
        update: {
          timeBalance: {
            increment: order.seconds
          }
        },
      });

      // Delete the user's cart and cart items (cart items will be deleted automatically due to cascade)
      await tx.cart.delete({
        where: { userId: user.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CONFIRM_ERROR]', error.stack);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
