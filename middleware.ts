import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

 
  const token = request.cookies.get('accessToken')?.value || request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

 
  if (token && (path.startsWith('/auth/login') || path.startsWith('/auth/register'))) {
    if (role === 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard/landlord', request.url));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/tenant', request.url));
  }

  
  if (!token && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/register'],
};