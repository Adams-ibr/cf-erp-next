import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify, jwtDecrypt } from 'jose'

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only'

async function getJwtSecret() {
  const encoder = new TextEncoder()
  const data = encoder.encode(SECRET)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return new Uint8Array(hashBuffer)
}

async function getSessionFromCookie(request: NextRequest) {
  const JWT_SECRET = await getJwtSecret()
  const possibleCookies = [
    '__Secure-next-auth.session-token',
    '__Host-next-auth.session-token',
    'next-auth.session-token',
    '__Secure-authjs.session-token',
    '__Host-authjs.session-token',
    'authjs.session-token',
  ]
  
  console.log('Middleware: Checking cookies:', request.cookies.getAll().map(c => c.name))
  
  for (const cookieName of possibleCookies) {
    const token = request.cookies.get(cookieName)?.value
    if (token) {
      console.log('Middleware: Found token in cookie:', cookieName)
      
      try {
        // Try JWT verify first
        const { payload } = await jwtVerify(token, JWT_SECRET)
        console.log('Middleware: JWT verified, payload:', payload)
        return payload
      } catch (e1) {
        console.log('Middleware: JWT verify failed, trying jwtDecrypt...', e1)
      }
      
      try {
        // Try decrypt with jose jwtDecrypt
        const { payload } = await jwtDecrypt(token, JWT_SECRET)
        console.log('Middleware: Decrypted payload:', payload)
        return payload
      } catch (e2) {
        console.log('Middleware: jwtDecrypt failed for', cookieName, e2)
      }
    }
  }
  
  console.log('Middleware: No valid token found')
  return null
}

export async function middleware(request: NextRequest) {
  console.log('Middleware: Processing', request.nextUrl.pathname)
  
  // Skip auth for NextAuth endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    console.log('Middleware: Skipping auth endpoint')
    return NextResponse.next()
  }

  const session = await getSessionFromCookie(request)

  console.log('Middleware: Session result:', session ? 'FOUND' : 'NOT FOUND')

  // Protect API routes (except auth)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!session) {
      console.log('Middleware: API route, no session, returning 401')
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
      console.log('Middleware: Protected route, no session, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    console.log('Middleware: Protected route, session found, allowing access')
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$|public/|login|api/auth).*)',
  ],
}