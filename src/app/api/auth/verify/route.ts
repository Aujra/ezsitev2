import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const user = await verifyToken();
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Invalid token' }, 
            { status: 401 }
        );
    }
}
