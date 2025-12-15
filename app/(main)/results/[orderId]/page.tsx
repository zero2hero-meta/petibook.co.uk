import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import OrderStatus from '@/components/OrderStatus'

export default async function ResultsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = createServerClient()

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

  const generation = generations?.[0]

  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <OrderStatus
          orderId={orderId}
          initialOrder={order}
          initialGeneration={generation}
        />
      </div>
    </div>
  )
}
