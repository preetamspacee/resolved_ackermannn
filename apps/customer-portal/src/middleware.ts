import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect only the root to this app's welcome page (no hardcoded host)
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};


