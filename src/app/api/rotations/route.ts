import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { name, data } = await request.json();
    
    // Check for existing rotation with the same name
    const existingRotation = await prisma.rotation.findFirst({
      where: {
        userId: user.id,
        name: name,
      },
    });

    let rotation;
    if (existingRotation) {
      rotation = await prisma.rotation.update({
        where: {
          id: existingRotation.id,
        },
        data: {
          data,
          updatedAt: new Date(),
        },
      });
    } else {
      rotation = await prisma.rotation.create({
        data: {
          userId: user.id,
          name,
          data,
          isActive: false,
        },
      });
    }

    return NextResponse.json(rotation);
  } catch {
    return NextResponse.json(
      { error: 'Failed to save rotation' },
      { status: 401 }
    );
  }
}

export async function GET() {
  try {
    const user = await requireAuth();
    
    const rotations = await prisma.rotation.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(rotations);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch rotations' },
      { status: 401 }
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
    const rotationId = searchParams.get('id');

    if (!rotationId) {
      return NextResponse.json(
        { success: false, error: 'Rotation ID is required' },
        { status: 400 }
      );
    }

    await prisma.rotation.delete({
      where: {
        id: rotationId,
        userId: user.id // Ensure user owns the rotation
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Rotation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting rotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete rotation' },
      { status: 500 }
    );
  }
}
