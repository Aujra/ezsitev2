import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  console.log('🔒 Middleware Check -', pathname);

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    // If user is already authenticated, redirect to dashboard
    if (token) {
      try {
        await verifyToken(token);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Invalid token, allow access to public route
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!token) {
    console.log('❌ No token - redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await verifyToken(token);
    console.log('✅ Token verified');
    return NextResponse.next();
  } catch (error) {
    console.log('❌ Invalid token');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

async function verifyToken(token: string) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  await jwtVerify(token, secretKey);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
