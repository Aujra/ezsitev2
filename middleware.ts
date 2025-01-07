import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('🔒 Auth Check:', pathname);

  // Skip middleware for specific paths
  const isPublicPath = 
    pathname.startsWith('/api') ||        // API routes
    pathname.startsWith('/_next') ||      // Next.js assets
    pathname === '/login' ||              // Auth pages
    pathname === '/register' ||
    pathname.includes('.') ||             // Static files
    pathname === '/favicon.ico';

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('❌ No token - redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    console.log('✅ Token verified for:', pathname);
    return NextResponse.next();
  } catch (error) {
    console.log('❌ Invalid token', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js assets
     * This is a simpler matcher that will catch all routes
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
