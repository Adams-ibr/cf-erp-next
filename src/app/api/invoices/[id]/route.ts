import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', (session.user as any).tenantId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('tenant_id', (session.user as any).tenantId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('tenant_id', (session.user as any).tenantId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }
}