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
  } catch (error) {
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rotations' },
      { status: 401 }
    );
  }
}
