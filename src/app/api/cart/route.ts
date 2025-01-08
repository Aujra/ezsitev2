import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { type, name, price, quantity, days } = data;

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          items: {
            create: {
              type,
              name,
              price,
              quantity,
              days,
            },
          },
        },
        include: { items: true },
      });
    } else {
      // Add item to existing cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          type,
          name,
          price,
          quantity,
          days,
        },
      });
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
