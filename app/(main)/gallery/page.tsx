import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ImageIcon } from 'lucide-react'

export default async function GalleryPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: orders } = await supabase
    .from('petiboo_orders')
    .select(`
      *,
      petiboo_generations (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container-custom max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-coral-500 bg-clip-text text-transparent">
            My Caricatures
          </h1>
          <p className="text-gray-600">View all your generated pet caricatures</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="card text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-700">No Caricatures Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any caricatures yet. Start creating now!
            </p>
            <Link href="/create" className="btn-primary inline-block">
              Create Your First Caricature
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: any) => {
              const generation = order.petiboo_generations?.[0]
              return (
                <Link
                  key={order.id}
                  href={`/results/${order.id}`}
                  className="card hover:-translate-y-1 transition-transform cursor-pointer"
                >
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden">
                    {generation?.permanent_image_url ? (
                      <img
                        src={generation.permanent_image_url}
                        alt="Caricature"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-700">
                        {order.status === 'completed' ? 'Completed' : 'Processing...'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
