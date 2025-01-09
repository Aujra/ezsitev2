import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart || !cart.items.length) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total amount and days
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDays = cart.items.reduce((sum, item) => sum + (item.days || 0), 0);
    
    // Convert days to seconds
    const totalSeconds = totalDays * 24 * 60 * 60;

    // Create temporary stripeId (you'll want to integrate with Stripe properly)
    const tempStripeId = `temp_${Date.now()}`;

    const order = await prisma.$transaction(async (tx) => {
      // Create the order with new schema
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          amount: total,
          status: 'pending',
          days: totalDays,
          seconds: totalSeconds,
          stripeId: tempStripeId,
        }
      });

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order: order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
