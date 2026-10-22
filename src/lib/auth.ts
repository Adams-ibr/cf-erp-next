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
          return null
        }

        const supabase = await createClient()
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials!.email)
          .single()

        if (error || !user) return null

        const bcrypt = await import('bcryptjs')
        const isValid = await bcrypt.compare(credentials!.password, user.password_hash)

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          tenantId: user.tenant_id
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