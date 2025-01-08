import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the auth cookie with proper options
  cookieStore.delete({
    name:'token',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true
  });
  
  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}

