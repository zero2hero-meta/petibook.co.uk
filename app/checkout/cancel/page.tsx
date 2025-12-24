'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pkg = searchParams.get('package')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment canceled</h1>
        <p className="text-gray-600 mb-4">
          {pkg ? `Your ${pkg} package payment was canceled.` : 'Your payment was canceled.'} You can try again or continue with a different package.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/create')}
            className="btn-primary"
          >
            Back to create
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
