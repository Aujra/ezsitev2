import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { type, name, price, quantity, days } = data;

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (typeof price !== 'number') {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }
    if (typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
    }

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart) {
      // Create new cart with first item
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
      // Simplified logic: just check for game-time type
      const existingGameTime = cart.items.find(item => item.type === 'game-time');

      if (type === 'game-time' && existingGameTime) {
        // Update existing game time item
        const newTotalDays = (existingGameTime.days || 0) + (days || 0);
        await prisma.cartItem.update({
          where: { id: existingGameTime.id },
          data: {
            days: newTotalDays,
            name: 'Game Time',
            price: newTotalDays, // $1 per day
            quantity: 1
          }
        });
      } else {
        // Add new item to cart
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            type,
            name: type === 'game-time' ? 'Game Time' : name,
            price: type === 'game-time' ? days : price, // $1 per day for game-time
            quantity,
            days,
          },
        });
      }

      // Fetch updated cart
      cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true },
      });
    }

    return NextResponse.json({ 
      message: 'Cart updated successfully',
      items: cart?.items || [] 
    });
  } catch (error) {
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
