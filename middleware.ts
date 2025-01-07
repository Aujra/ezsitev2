import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('🔒 Middleware Check -', pathname);

  // List of public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  
  // If the path is public, allow access
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // For protected routes, check authentication
  if (!token) {
    console.log('❌ No token - redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    verify(token, process.env.JWT_SECRET!);
    console.log('✅ Token verified');
    return NextResponse.next();
  } catch (error) {
    console.log('❌ Invalid token');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Update matcher to be more specific
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - static files
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
