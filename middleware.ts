import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  try {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isAuthPage = nextUrl.pathname.startsWith('/login') || 
                       nextUrl.pathname.startsWith('/signup') ||
                       nextUrl.pathname.startsWith('/forgot-password')

    const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') ||
                            nextUrl.pathname.startsWith('/create') ||
                            nextUrl.pathname.startsWith('/summaries')

    // If user is logged in and trying to access auth pages, redirect to dashboard
    if (isLoggedIn && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!isLoggedIn && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Allow the request to continue on middleware errors
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
