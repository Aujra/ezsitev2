import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deleteImageFromS3 } from '@/lib/s3';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await requireAuth();
    const { productId } = await context.params;
    const data = await request.json();

    // Verify ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct || existingProduct.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find images that were removed
    const removedImages = existingProduct.images.filter(
      oldImage => !data.images.includes(oldImage)
    );

    // Delete removed images from S3
    await Promise.all(
      removedImages.map(imageUrl => deleteImageFromS3(imageUrl))
    );

    // Update product in database
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        pricePerDay: data.pricePerDay,
        tags: data.tags,
        status: data.status,
        images: data.images,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await requireAuth();
    const { productId } = await context.params;

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
