'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const pkg = searchParams.get('package')

  useEffect(() => {
    // Placeholder for optional success polling/verification
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment successful</h1>
        <p className="text-gray-600 mb-4">
          {pkg ? `Your ${pkg} package is confirmed.` : 'Your payment was confirmed.'} You can now create your caricatures.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 mb-4">
            Session ID: {sessionId}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/create')}
            className="btn-primary"
          >
            Go to create page
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:border-gray-300"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
