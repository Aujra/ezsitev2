import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const POST = async (req: NextRequest) => {
  try {
    const user = await requireAuth();
    const { name, description, price, tags, images, rotationId } = await req.json();
    
    const product = await prisma.product.create({
      data: {
        userId: user.id,
        rotationId,
        name,
        description,
        price,
        tags,
        images,
        type: 'rotation',
        status: 'draft',
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 401 }
    );
  }
};

// Add GET method for future use
export const GET = async () => {
  try {
    const user = await requireAuth();
    
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
      },
      include: {
        rotation: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            authorName: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 401 }
    );
  }
};
