import { createServiceRoleClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const searchParams = new URL(request.url).searchParams
    const orderIndex = Number(searchParams.get('order') ?? '0')
    const supabase = createServiceRoleClient()

    const { data: order, error } = await supabase
      .from('petiboo_orders')
      .select(`
        id,
        status,
        created_at,
        processing_started_at,
        completed_at,
        petiboo_generations (
          id,
          permanent_image_url,
          status,
          has_watermark,
          order_index
        )
      `)
      .eq('id', orderId)
      .order('order_index', { referencedTable: 'petiboo_generations', ascending: true })
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const generation =
      order.petiboo_generations?.find((g: any) => g.order_index === orderIndex) ??
      order.petiboo_generations?.[0] ??
      null
    return NextResponse.json({
      order_id: order.id,
      status: order.status,
      created_at: order.created_at,
      processing_started_at: order.processing_started_at,
      completed_at: order.completed_at,
      generation
    })
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
