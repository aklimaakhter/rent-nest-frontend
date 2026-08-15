import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/dashboard/tenant') && role !== 'TENANT') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/dashboard/landlord') && role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    if (role === 'LANDLORD') return NextResponse.redirect(new URL('/dashboard/landlord', request.url));
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    return NextResponse.redirect(new URL('/dashboard/tenant', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};