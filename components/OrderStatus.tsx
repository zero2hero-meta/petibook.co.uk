'use client'

import { useEffect, useState } from 'react'
import { Loader2, Download, Share2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface OrderStatusProps {
  orderId: string
  initialOrder: any
  initialGeneration: any
  generationOrder?: number
}

export default function OrderStatus({
  orderId,
  initialOrder,
  initialGeneration,
  generationOrder = 0,
}: OrderStatusProps) {
  const [order, setOrder] = useState(initialOrder)
  const [generation, setGeneration] = useState(initialGeneration)
  const [error, setError] = useState('')

  useEffect(() => {
    if (order.status === 'completed') return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/orders/${orderId}/status?order=${generationOrder}`
        )
        const data = await response.json()

        if (data.status === 'completed') {
          setOrder(data)
          setGeneration(data.generation)
          clearInterval(pollInterval)
        } else if (data.generation) {
          setGeneration(data.generation)
        }
      } catch (err) {
        console.error('Failed to fetch status:', err)
      }
    }, 10000)

    return () => clearInterval(pollInterval)
  }, [orderId, order.status, generationOrder])

  if (order.status === 'completed' && generation?.permanent_image_url) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Your Caricature is Ready!</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Your Pet's South Park Transformation
          </h1>
          <p className="text-gray-600">
            Here's your hilarious pet caricature with your facial features!
          </p>
        </div>

        <div className="card">
          <img
            src={generation.permanent_image_url}
            alt="Generated caricature"
            className="w-full rounded-xl mb-6"
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={generation.permanent_image_url}
              download
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Image
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Pet Caricature',
                    text: 'Check out my pet\'s South Park transformation!',
                    url: window.location.href
                  })
                }
              }}
              className="px-6 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {generation.has_watermark && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-yellow-800 font-medium mb-2">
                Want more caricatures without the watermark?
              </p>
              <Link href="/pricing" className="text-purple-600 font-semibold hover:underline">
                View Pricing Plans →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/create" className="btn-primary inline-block">
            Create Another Caricature
          </Link>
        </div>
      </div>
    )
  }

  if (order.status === 'failed') {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Generation Failed</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Oops! Something Went Wrong</h1>
          <p className="text-gray-600">
            We encountered an error while creating your caricature.
          </p>
        </div>

        <div className="card text-center py-12">
          <p className="text-gray-600 mb-6">
            Don't worry! Please try again or contact our support team.
          </p>
          <Link href="/create" className="btn-primary inline-block">
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Creating Your Caricature...</h1>
        <p className="text-gray-600">
          Our AI is working its magic! This usually takes 30-60 minutes.
        </p>
      </div>

      <div className="card">
        <div className="flex flex-col items-center py-12">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-6" />
          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-coral-500 h-4 rounded-full animate-pulse w-3/4"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">Processing your images</p>
          <p className="text-sm text-gray-500">
            Checking for updates every 10 seconds...
          </p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="font-semibold mb-4 text-center">While You Wait...</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Your images are being analyzed by our AI</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Facial features are being matched</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>South Park style is being applied</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Final touches are being added</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center" />
    </div>
  )
}
