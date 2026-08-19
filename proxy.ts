import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from './lib/types'
import { decodeToken } from './utils/jwt'


const AUTH_ROUTE = ["/login", "register"]
const ROUTE_ROLES: Record<string, Role[]> = {
    "/dashboard": ["ADMIN", "LANDLORD", "TENANT"],
    "/admin": ["ADMIN"],
    "/landlord": ["LANDLORD"]
}



const matches = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`)

export function proxy(request: NextRequest) {
    const goTo = (path: string) => NextResponse.redirect(new URL(path, request.url));
    const { pathname } = request.nextUrl

    // const role = decodeToken(request.cookies.get("accessToken")!.value)?.role


    const accessToken = request.cookies.get("accessToken")?.value;
    const role = accessToken ? decodeToken(accessToken)?.role : null;

    if (AUTH_ROUTE.includes(pathname)) {
        return role ? goTo("/dashboard") : NextResponse.next()
    }


    const allowedRoles = Object.entries(ROUTE_ROLES).find((([route]) => matches(pathname, route)))?.[1]

    if (!allowedRoles) return NextResponse.next();

    if (!role) {
        goTo("/login")
    }

    if (!allowedRoles.includes(role!)) return goTo("/")

}


export const config = {
    matcher: [

        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}