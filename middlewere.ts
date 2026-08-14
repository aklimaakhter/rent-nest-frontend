
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value; 
  const { pathname } = request.nextUrl;

  
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  
  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL(`/dashboard/${role?.toLowerCase() || 'tenant'}`, request.url));
  }

  if (pathname.startsWith('/dashboard/landlord') && role !== 'LANDLORD') {
    return NextResponse.redirect(new URL(`/dashboard/${role?.toLowerCase() || 'tenant'}`, request.url));
  }

  if (pathname.startsWith('/dashboard/tenant') && role !== 'TENANT') {
    return NextResponse.redirect(new URL(`/dashboard/${role?.toLowerCase() || 'tenant'}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};