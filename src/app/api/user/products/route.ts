import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const user = await requireAuth();
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const products = await prisma.product.findMany({
            where: {
                userId: user.id
            },
            include: {
                rotation: true,
                reviews: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ 
            success: true, 
            data: products 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await requireAuth();
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        await prisma.product.deleteMany({
            where: {
                id: productId,
                userId: user.id // Ensure user owns the product
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
