import { createClient } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PaginationDto } from '@/lib/shared/dto'

export interface ResourceConfig {
  tableName: string
  createSchema: z.ZodSchema
  updateSchema: z.ZodSchema
}

export function createResourceRoutes(config: {
  tableName: string
  createSchema: z.ZodSchema
  updateSchema: z.ZodSchema
}) {
  const { tableName, createSchema, updateSchema } = config

  async function GET(request: NextRequest) {
    try {
      const { getServerSession } = await import('next-auth')
      const { authOptions } = await import('@/lib/auth')
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const supabase = (await import('@/lib/supabase/server')).createClient()
      const { searchParams } = new URL(request.url)
      
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const search = searchParams.get('search') || ''
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from(config.tableName)
        .select('*', { count: 'exact' })
        .eq('tenant_id', (session.user as any).tenantId)
        .range(from, to)
        .order('created_at', { ascending: false })

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const [data, error, count] = await Promise.all([
        query,
        supabase.from(config.tableName).select('*', { count: 'exact', head: true }).eq('tenant_id', (session.user as any).tenantId),
      ])

      if (error) throw error

      return NextResponse.json({
        data,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      })
    } catch (error) {
      console.error(`Error fetching ${config.tableName}:`, error)
      return NextResponse.json({ error: `Failed to fetch ${config.tableName}` }, { status: 500 })
    }
  }

  async function POST(request: NextRequest) {
    try {
      const { getServerSession } = await import('next-auth')
      const { authOptions } = await import('@/lib/auth')
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const supabase = (await import('@/lib/supabase/server')).createClient()
      const body = await request.json()
      const data = createSchema.parse(body)

      const { data: result, error } = await supabase
        .from(config.tableName)
        .insert({
          ...data,
          tenant_id: (session.user as any).tenantId,
          created_by: (session.user as any).id,
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json(result, { status: 201 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      console.error(`Error creating ${config.tableName}:`, error)
      return NextResponse.json({ error: `Failed to create ${config.tableName}` }, { status: 500 })
    }
  }

  return { GET, POST }
}