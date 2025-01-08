import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generateLicenseKey() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const licenseKey = generateLicenseKey();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        license: {
          create: {
            key: licenseKey,
            timeBalance: 0,  // Initial time balance of 0 minutes
          }
        }
      },
      include: {
        license: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      licenseKey: user.license?.key ?? '' 
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}
