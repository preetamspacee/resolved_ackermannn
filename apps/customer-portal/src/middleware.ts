import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect only the root of port 3000 to the admin welcome page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect('http://localhost:3001/welcome');
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};


