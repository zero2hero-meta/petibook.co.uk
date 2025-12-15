import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
