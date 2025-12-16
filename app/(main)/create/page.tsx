'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const [ownerImage, setOwnerImage] = useState<{ file: File; preview: string } | null>(null)
  const [petImage, setPetImage] = useState<{ file: File; preview: string } | null>(null)
  const [email, setEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!ownerImage || !petImage) {
      setError('Please upload both photos')
      return
    }

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setUploading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const formData = new FormData()
      formData.append('owner_image', ownerImage.file)
      formData.append('pet_image', petImage.file)
      formData.append('email', email)
      formData.append('is_guest', user ? 'false' : 'true')

    console.log('[before n8n callback] start upload - 0')

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        body: formData,
      })
    console.log('[before n8n callback] start upload - 1')

      const data = await response.json()
    console.log('[before n8n callback] start upload - 2')

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      router.push(`/results/${data.order_id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container-custom max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-coral-500 bg-clip-text text-transparent">
            Create Your Pet Caricature
          </h1>
          <p className="text-xl text-gray-600">
            Upload your photo and your pet's photo to get started
          </p>
          <div className="mt-4 inline-block bg-yellow-100 border border-yellow-300 rounded-lg px-6 py-3">
            <p className="text-yellow-800 font-medium">
              First caricature is FREE! No login required.
            </p>
          </div>
        </div>

        <div className="card max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <ImageUpload
              title="Your Photo"
              onImageSelect={(file, preview) => setOwnerImage({ file, preview })}
              preview={ownerImage?.preview}
            />
            <ImageUpload
              title="Your Pet's Photo"
              onImageSelect={(file, preview) => setPetImage({ file, preview })}
              preview={petImage?.preview}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-semibold mb-3 text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              We'll send your caricatures to this email
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!ownerImage || !petImage || !email || uploading}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Your Caricature...
              </>
            ) : (
              'Create My Free Caricature'
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By clicking create, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Photo Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-purple-600">Your Photo</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Clear, front-facing photo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Good lighting (natural is best)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Neutral expression or smile
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  No sunglasses or face coverings
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-coral-600">Pet's Photo</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Clear view of face
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Pet looking at camera
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  Good lighting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Avoid motion blur
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
