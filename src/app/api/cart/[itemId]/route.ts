import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await context.params;

    // Verify the item belongs to the user's cart before deleting
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    const itemBelongsToUser = cart?.items.some(item => item.id === itemId);
    if (!itemBelongsToUser) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
