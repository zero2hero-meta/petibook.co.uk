import { createServiceRoleClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import OrderStatus from '@/components/OrderStatus'

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams?: Promise<{ order?: string }>
}) {
  const { orderId } = await params
  const resolvedSearch = searchParams ? await searchParams : undefined
  const orderIndex = Number(resolvedSearch?.order ?? '0')
  const supabase = createServiceRoleClient()

  const { data: order } = await supabase
    .from('petiboo_orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (!order) {
    notFound()
  }

  const { data: generations } = await supabase
    .from('petiboo_generations')
    .select('*')
    .eq('order_id', orderId)
    .order('order_index', { ascending: true })

  const generation =
    generations?.find((g: any) => g.order_index === orderIndex) ??
    generations?.[0]

  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <OrderStatus
          orderId={orderId}
          initialOrder={order}
          initialGeneration={generation}
          generationOrder={orderIndex}
        />
      </div>
    </div>
  )
}
