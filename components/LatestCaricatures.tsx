import { createServiceRoleClient } from '@/lib/supabase/service'

export default async function LatestCaricatures() {
  const supabase = createServiceRoleClient()
  const { data: recentImages } = await supabase
    .from('petiboo_generations')
    .select('permanent_image_url')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(20)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Caricatures</h2>
          <p className="text-sm text-gray-500">Fresh from our creators</p>
        </div>
        {recentImages && recentImages.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentImages.map((item, idx) => (
              <div
                key={`${item.permanent_image_url}-${idx}`}
                className="aspect-square overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-gray-50"
              >
                <img
                  src={item.permanent_image_url}
                  alt="Recent caricature"
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No caricatures yet. Check back soon!</div>
        )}
      </div>
    </section>
  )
}
