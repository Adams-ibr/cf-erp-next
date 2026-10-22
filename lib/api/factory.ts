import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

interface ResourceConfig {
  tableName: string
  createSchema: z.ZodSchema
  updateSchema: z.ZodSchema
  selectFields?: string
}

function createResourceRoutes(config: ResourceConfig) {
  const { tableName, createSchema, updateSchema } = config

  async function GET(request: NextRequest) {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const supabase = createClient()
      const { searchParams } = new URL(request.url)
      
      const page = parseInt(new URL(request.url).searchParams.get('page') || '1')
      const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20')
      const search = new URL(request.url).searchParams.get('search') || ''
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

      const { data, error, count } = await query

      if (error) throw error

      return NextResponse.json({
        data,
        pagination: {
          page: parseInt(new URL(request.url).searchParams.get('page') || '1'),
          limit: parseInt(new URL(request.url).searchParams.get('limit') || '20'),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      })
    } catch (error) {
      console.error(`Error fetching ${config.tableName}:`, error)
      return NextResponse.json({ error: `Failed to fetch ${config.tableName}` }, { status: 500 })
    }
  }

  async function POST(request: NextRequest) {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const supabase = createClient()
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

export { createResourceRoutes }