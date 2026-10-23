import { NextResponse, type NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function middleware(request: NextRequest) {
  // Skip auth for NextAuth endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Get session using NextAuth
  const session = await getServerSession(authOptions)

  // Protect API routes (except auth)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/customers') ||
      request.nextUrl.pathname.startsWith('/suppliers') ||
      request.nextUrl.pathname.startsWith('/shipments') ||
      request.nextUrl.pathname.startsWith('/invoices') ||
      request.nextUrl.pathname.startsWith('/quotes')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$|public/|login|api/auth).*)',
  ],
}