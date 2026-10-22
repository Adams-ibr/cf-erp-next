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
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        console.log('Auth attempt for:', credentials.email)

        try {
          const supabase = await createClient()
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials!.email)
            .single()

          console.log('DB query result:', { error: error?.message, userFound: !!user })

          if (error || !user) {
            console.log('User not found or DB error')
            return null
          }

          console.log('User data:', { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id, hasPasswordHash: !!user.password_hash })

          const isValid = await bcrypt.compare(credentials!.password, user.password_hash)

          console.log('Password valid:', isValid)

          if (!isValid) {
            console.log('Invalid password')
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            tenantId: user.tenant_id
          }
        } catch (err) {
          console.error('Auth error:', err)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any
        token.id = u.id
        token.role = u.role
        token.tenantId = u.tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.tenantId = token.tenantId
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}