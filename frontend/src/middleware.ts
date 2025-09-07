import { NextResponse } from 'next/server';

// Route configuration
const ROUTES = {
  // Public routes - no authentication required
  PUBLIC: [
    '/',
    '/login',
    '/signup',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/_next',
    '/api',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
  ],

  // Protected routes - require authentication
  PROTECTED: ['/chat', '/questionnaire', '/dashboard', '/profile', '/settings'],

  // Auth routes - redirect if already authenticated
  AUTH: ['/login', '/signup'],
} as const;

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return ROUTES.PUBLIC.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

// Check if route is protected
function isProtectedRoute(pathname: string): boolean {
  return ROUTES.PROTECTED.some(route => pathname.startsWith(route));
}

// Check if route is auth route
function isAuthRoute(pathname: string): boolean {
  return ROUTES.AUTH.some(route => pathname.startsWith(route));
}

export function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Allow all public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, add security headers and let client handle auth
  if (isProtectedRoute(pathname)) {
    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    );

    // Add cache control for protected routes
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }

  // For auth routes, add no-cache headers
  if (isAuthRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
