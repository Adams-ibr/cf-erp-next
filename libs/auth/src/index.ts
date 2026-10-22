import { createClient } from '@/lib/supabase/server'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  tenantId: string
}

export async function verifyCredentials(email: string, password: string) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return null
  }

  const bcrypt = await import('bcryptjs')
  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    tenantId: user.tenant_id
  }
}

export async function createClient() {
  const { createClient } = await import('@/lib/supabase/server')
  return createClient()
}