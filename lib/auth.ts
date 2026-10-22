import { NextAuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      tenantId: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    tenantId: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('=== AUTH START ===')
        console.log('Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          console.log('Creating Supabase client...')
          const supabase = await createClient()
          console.log('Supabase client created')

          console.log('Querying users table for:', credentials.email)
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials!.email)
            .single()

          console.log('DB result:', { 
            error: error?.message, 
            errorCode: error?.code,
            userFound: !!user,
            userKeys: user ? Object.keys(user) : null
          })

          if (error) {
            console.error('DB error:', error)
            return null
          }

          if (!user) {
            console.log('No user found')
            return null
          }

          console.log('User data:', { 
            id: user.id, 
            email: user.email, 
            role: user.role, 
            tenant_id: user.tenant_id, 
            hasPasswordHash: !!user.password_hash,
            passwordHashPreview: user.password_hash?.substring(0, 20)
          })

          if (!user.password_hash) {
            console.error('No password hash!')
            return null
          }

          console.log('Comparing password...')
          const isValid = await bcrypt.compare(credentials!.password, user.password_hash)
          console.log('Password valid:', isValid)

          if (!isValid) {
            console.log('Invalid password')
            return null
          }

          console.log('=== AUTH SUCCESS ===')
          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            tenantId: user.tenant_id
          }
        } catch (err) {
          console.error('=== AUTH EXCEPTION ===', err)
          console.error('Stack:', err instanceof Error ? err.stack : 'no stack')
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log('JWT callback:', { hasToken: !!token, hasUser: !!user, trigger })
      if (user) {
        const u = user as any
        token.id = u.id
        token.role = u.role
        token.tenantId = u.tenantId
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { hasSession: !!session, hasToken: !!token })
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
}