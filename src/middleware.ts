import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // Check if user is authenticated
  if (!req.auth) {
    // Redirect to login if not authenticated and trying to access protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/create') || 
        req.nextUrl.pathname.startsWith('/summaries')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (req.auth && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*", "/summaries/:path*", "/login", "/signup"]
}
