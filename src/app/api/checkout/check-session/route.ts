import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await verifyToken();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return new NextResponse("Session ID is required", { status: 400 });
    }

    // Check if we have a completed order with this session ID
    const existingOrder = await prisma.order.findFirst({
      where: {
        stripeId: sessionId,
        userId: user.id,
        status: 'completed'
      }
    });

    return NextResponse.json({ isProcessed: !!existingOrder });
  } catch (error) {
    console.error('[CHECK_SESSION_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
