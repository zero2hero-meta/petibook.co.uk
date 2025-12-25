'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function CheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pkg = searchParams.get('package')
  const [status, setStatus] = useState<'idle' | 'redirecting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const startCheckout = async () => {
    if (!pkg) {
      setStatus('error')
      setMessage('No package selected. Please choose a package on the Create page.')
      return
    }

    setStatus('redirecting')
    setMessage('Redirecting to Stripe...')
    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: pkg }),
      })

      const data = await res.json()
      if (res.ok && data?.url) {
        window.location.href = data.url
        return
      }

      setStatus('error')
      setMessage(data?.error || 'Unable to start checkout. Please try again.')
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message || 'Unable to start checkout. Please try again.')
    }
  }

  useEffect(() => {
    if (pkg) {
      startCheckout()
    }
  }, [pkg])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Processing checkout</h1>
        <p className="text-gray-600 mb-4">
          {pkg
            ? `Starting checkout for the ${pkg} package...`
            : 'No package specified. Please choose a package on the create page.'}
        </p>
        {status === 'redirecting' && (
          <p className="text-sm text-purple-600 font-medium mb-4">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500 font-medium mb-4">{message}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/create')}
            className="btn-primary"
          >
            Back to create
          </button>
          <button
            onClick={startCheckout}
            className="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:border-gray-300"
          >
            Retry checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageContent />
    </Suspense>
  )
}
