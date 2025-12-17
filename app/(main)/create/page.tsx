'use client'

import { useEffect, useMemo, useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import { createClient } from '@/lib/supabase/client'
import { PACKAGES } from '@/types'
import { Check, Loader2, Palette, UploadCloud, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PackageKey = keyof typeof PACKAGES

const STYLE_CATEGORIES = [
  'Cartoon Classics',
  'Modern Animation',
  'Anime',
  'Realistic Cartoon',
  'Seasonal',
]

const STYLE_OPTIONS = [
  {
    id: 'south-park',
    name: 'South Park Classic',
    description: 'Flat 2D colors, bold black outlines',
    category: 'Cartoon Classics',
    popular: true,
    gradient: 'from-lime-200 via-emerald-200 to-sky-200',
  },
  {
    id: 'simpsons',
    name: 'The Simpsons',
    description: 'Bright palettes with simple line art',
    category: 'Cartoon Classics',
    popular: true,
    gradient: 'from-amber-200 via-yellow-200 to-orange-200',
  },
  {
    id: 'family-guy',
    name: 'Family Guy',
    description: 'Bold shapes, expressive features',
    category: 'Cartoon Classics',
    popular: false,
    gradient: 'from-rose-200 via-pink-200 to-purple-200',
  },
  {
    id: 'classic-toons',
    name: 'Classic Toons',
    description: 'Retro, punchy line work',
    category: 'Cartoon Classics',
    popular: false,
    gradient: 'from-orange-200 via-amber-200 to-red-200',
  },
  {
    id: 'modern-digital',
    name: 'Modern Digital',
    description: 'Clean gradients with soft shadows',
    category: 'Modern Animation',
    popular: true,
    gradient: 'from-cyan-200 via-sky-200 to-indigo-200',
  },
  {
    id: 'vector-pop',
    name: 'Vector Pop',
    description: 'Bold blocks, graphic highlights',
    category: 'Modern Animation',
    popular: false,
    gradient: 'from-fuchsia-200 via-pink-200 to-purple-200',
  },
  {
    id: 'minimal-3d',
    name: 'Minimal 3D',
    description: 'Soft lighting, sculpted forms',
    category: 'Modern Animation',
    popular: false,
    gradient: 'from-slate-200 via-zinc-200 to-stone-200',
  },
  {
    id: 'studio-ghibli',
    name: 'Studio Ghibli',
    description: 'Dreamy, painterly anime mood',
    category: 'Anime',
    popular: true,
    gradient: 'from-emerald-200 via-teal-200 to-cyan-200',
  },
  {
    id: 'shonen-pop',
    name: 'Shonen Pop',
    description: 'Dynamic lines, energetic colors',
    category: 'Anime',
    popular: false,
    gradient: 'from-red-200 via-orange-200 to-yellow-200',
  },
  {
    id: 'chibi-cute',
    name: 'Chibi Cute',
    description: 'Oversized eyes, cozy charm',
    category: 'Anime',
    popular: false,
    gradient: 'from-pink-200 via-rose-200 to-red-200',
  },
  {
    id: 'painterly-realism',
    name: 'Painterly Realism',
    description: 'Soft brushwork with rich color',
    category: 'Realistic Cartoon',
    popular: true,
    gradient: 'from-stone-200 via-amber-200 to-rose-200',
  },
  {
    id: 'comic-realism',
    name: 'Comic Realism',
    description: 'Detailed shading with ink lines',
    category: 'Realistic Cartoon',
    popular: false,
    gradient: 'from-slate-200 via-blue-200 to-indigo-200',
  },
  {
    id: 'sketch-wash',
    name: 'Sketch + Wash',
    description: 'Textured pencil with watercolor',
    category: 'Realistic Cartoon',
    popular: false,
    gradient: 'from-neutral-200 via-gray-200 to-zinc-200',
  },
  {
    id: 'holiday-sweater',
    name: 'Holiday Sweater',
    description: 'Festive palette, cozy accents',
    category: 'Seasonal',
    popular: true,
    gradient: 'from-red-200 via-emerald-200 to-teal-200',
  },
  {
    id: 'spooky-night',
    name: 'Spooky Night',
    description: 'Moody glow with warm highlights',
    category: 'Seasonal',
    popular: false,
    gradient: 'from-indigo-200 via-purple-200 to-slate-200',
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    description: 'Floral accents, airy hues',
    category: 'Seasonal',
    popular: false,
    gradient: 'from-emerald-200 via-lime-200 to-yellow-200',
  },
]

export default function CreatePage() {
  const [ownerImage, setOwnerImage] = useState<{ file: File; preview: string } | null>(null)
  const [petImage, setPetImage] = useState<{ file: File; preview: string } | null>(null)
  const [email, setEmail] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState(STYLE_CATEGORIES[0])
  const [selectedPackage, setSelectedPackage] = useState<PackageKey>('free')
  const [styleError, setStyleError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const isGuest = !userEmail
  const maxStyles = PACKAGES[selectedPackage].max_styles
  const filteredStyles = useMemo(
    () => STYLE_OPTIONS.filter((style) => style.category === activeCategory),
    [activeCategory]
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email)
        setEmail(data.user.email)
      }
    })
  }, [supabase])

  useEffect(() => {
    if (isGuest && selectedPackage !== 'free') {
      setSelectedPackage('free')
    }
  }, [isGuest, selectedPackage])

  useEffect(() => {
    setSelectedStyles((prev) => prev.slice(0, maxStyles))
    setStyleError('')
  }, [maxStyles])

  useEffect(() => {
    setError('')
    if (currentStep !== 2) {
      setStyleError('')
    }
  }, [currentStep])

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleId)) {
        setStyleError('')
        return prev.filter((id) => id !== styleId)
      }
      if (prev.length >= maxStyles) {
        setStyleError(`You can select up to ${maxStyles} styles for this package.`)
        return prev
      }
      setStyleError('')
      return [...prev, styleId]
    })
  }

  const handleStepOneNext = () => {
    if (!ownerImage || !petImage) {
      setError('Please upload both photos')
      return
    }

    if (!userEmail && !email) {
      setError('Please enter your email address')
      return
    }

    setError('')
    setCurrentStep(2)
  }

  const handleStepTwoNext = () => {
    if (selectedStyles.length === 0) {
      setStyleError('Select at least one style to continue.')
      return
    }

    setStyleError('')
    setCurrentStep(3)
  }

  const handleSubmit = async () => {
    if (!ownerImage || !petImage) {
      setError('Please upload both photos')
      return
    }

    if (!userEmail && !email) {
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
      formData.append('email', email || userEmail || '')
      formData.append('is_guest', user ? 'false' : 'true')
      formData.append('selected_styles', JSON.stringify(selectedStyles))
      formData.append('package', selectedPackage)

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
            Upload photos, choose a style, and get hilarious caricatures in minutes
          </p>
          <div className="mt-4 inline-block bg-yellow-100 border border-yellow-300 rounded-lg px-6 py-3">
            <p className="text-yellow-800 font-medium">
              First caricature is FREE. Sign in to unlock more styles and packs.
            </p>
          </div>
        </div>

        <div className="card max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-10">
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 1 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                }`}
              >
                1
              </span>
              <span className="font-semibold text-gray-700">Upload Photos</span>
            </div>
            <span className="hidden md:block h-px w-16 bg-purple-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 2 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                }`}
              >
                2
              </span>
              <span className="font-semibold text-gray-700">Choose Styles</span>
            </div>
            <span className="hidden md:block h-px w-16 bg-purple-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 3 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                }`}
              >
                3
              </span>
              <span className="font-semibold text-gray-700">Review & Create</span>
            </div>
          </div>

          <div className="space-y-12">
            {currentStep === 1 && (
              <section className="rounded-3xl border border-purple-100 bg-white/80 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-purple-500 font-semibold">Step 1</p>
                        <h2 className="text-2xl font-bold text-gray-800">Upload Your Photos</h2>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Upload a clear photo of yourself and your beloved pet. Our AI assistant checks image quality automatically.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-6">
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

                    {!userEmail && (
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
                    )}
                  </div>
                  <div className="lg:w-80">
                    <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-300" />
                          <span className="w-2 h-2 rounded-full bg-yellow-300" />
                          <span className="w-2 h-2 rounded-full bg-green-300" />
                        </div>
                        <span className="ml-auto">upload-preview.png</span>
                      </div>
                      <div className="mt-4 rounded-2xl border border-dashed border-purple-200 bg-white/70 p-4">
                        <div className="h-28 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <UploadCloud className="w-10 h-10 text-purple-400" />
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-purple-100" />
                        <div className="mt-2 h-2 w-2/3 rounded-full bg-purple-50" />
                        <div className="mt-3 flex gap-2">
                          <div className="h-10 w-10 rounded-xl bg-purple-50" />
                          <div className="h-10 w-10 rounded-xl bg-pink-50" />
                          <div className="h-10 w-10 rounded-xl bg-yellow-50" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-gray-500">
                        Screenshot of the upload interface
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleStepOneNext}
                    className="btn-primary"
                  >
                    Continue to styles
                  </button>
                </div>
              </section>
            )}

            {currentStep === 2 && (
              <section className="rounded-3xl border border-purple-100 bg-white/80 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-500 font-semibold">Step 2</p>
                    <h2 className="text-2xl font-bold text-gray-800">Choose Your Style</h2>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Pick from 50+ cartoon styles, backgrounds, and scenes. South Park style, classic cartoon, modern digital art, and more!
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {STYLE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        activeCategory === category
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                  <p>
                    Select up to {maxStyles} styles ({selectedStyles.length}/{maxStyles} selected)
                  </p>
                  {styleError && (
                    <span className="text-red-500 font-medium">{styleError}</span>
                  )}
                </div>

                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStyles.map((style) => {
                    const isSelected = selectedStyles.includes(style.id)
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleStyleToggle(style.id)}
                        className={`group relative rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-purple-300'
                        }`}
                      >
                        {style.popular && (
                          <span className="absolute top-4 right-4 rounded-full bg-coral-500 text-white text-xs font-semibold px-2 py-1">
                            Popular
                          </span>
                        )}
                        {isSelected && (
                          <span className="absolute top-4 left-4 h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                        <div
                          className={`relative h-28 rounded-xl bg-gradient-to-br ${style.gradient} overflow-hidden`}
                        >
                          <div className="absolute left-4 top-4 h-6 w-6 rounded-full bg-white/70" />
                          <div className="absolute right-5 top-6 h-10 w-10 rounded-full bg-white/40" />
                          <div className="absolute left-6 bottom-5 h-3 w-16 rounded-full bg-white/70" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-semibold text-white">
                              Hover to preview
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="font-semibold text-gray-800">{style.name}</p>
                          <p className="text-sm text-gray-500">{style.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {selectedStyles.length === 0 ? (
                    <span className="text-sm text-gray-500">
                      No styles selected yet. Choose your favorites to guide the AI.
                    </span>
                  ) : (
                    selectedStyles.map((styleId) => {
                      const style = STYLE_OPTIONS.find((item) => item.id === styleId)
                      return (
                        <span
                          key={styleId}
                          className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold"
                        >
                          {style?.name}
                        </span>
                      )
                    })
                  )}
                </div>

                <div className="mt-8 grid lg:grid-cols-[1.7fr_1fr] gap-6">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
                    <h3 className="font-semibold text-gray-800 mb-2">Style selection tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>Mix bold outlines with softer textures for variety.</li>
                      <li>Popular styles load fast and produce the most consistent results.</li>
                      <li>Seasonal styles are great for gifts or profile upgrades.</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-purple-100 bg-white p-5">
                    <h3 className="font-semibold text-gray-800 mb-3">Package limit</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Free includes 1 style. Upgrade to unlock 3 or 6 style selections.
                    </p>
                    <div className="grid gap-3">
                      {(Object.keys(PACKAGES) as PackageKey[]).map((key) => {
                        const pkg = PACKAGES[key]
                        const isSelected = selectedPackage === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedPackage(key)}
                            disabled={isGuest && key !== 'free'}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 bg-white hover:border-purple-200'
                            } ${isGuest && key !== 'free' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div>
                              <p className="font-semibold text-sm">{pkg.name}</p>
                              <p className="text-xs text-gray-500">
                                {pkg.max_styles} styles · {pkg.images_per_style * pkg.max_styles} images
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {pkg.price === 0 ? 'Free' : `£${pkg.price}`}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    {isGuest && (
                      <p className="text-xs text-gray-500 mt-4">
                        Sign in to unlock paid packages and more styles.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="rounded-lg border border-gray-200 px-5 py-2 font-semibold text-gray-600 hover:border-purple-200"
                  >
                    Back to uploads
                  </button>
                  <button
                    type="button"
                    onClick={handleStepTwoNext}
                    className="btn-primary"
                  >
                    Continue to results
                  </button>
                </div>
              </section>
            )}

            {currentStep === 3 && (
              <section className="rounded-3xl border border-purple-100 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-500 font-semibold">Step 3</p>
                    <h2 className="text-2xl font-bold text-gray-800">Review & Create</h2>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Review Your Order</h3>
                <div className="grid md:grid-cols-[2fr_1fr] gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-semibold">Your Photos</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-48">
                        <div className="h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                          {ownerImage?.preview ? (
                            <img src={ownerImage.preview} alt="Owner" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Your photo</div>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">You</p>
                      </div>
                      <div className="w-48">
                        <div className="h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                          {petImage?.preview ? (
                            <img src={petImage.preview} alt="Pet" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Your pet</div>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Your Pet</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-2">Selected Styles</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedStyles.length === 0 ? (
                        <span className="text-sm text-gray-500">No styles selected</span>
                      ) : (
                        selectedStyles.map((styleId) => {
                          const style = STYLE_OPTIONS.find((item) => item.id === styleId)
                          return (
                            <span
                              key={styleId}
                              className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold"
                            >
                              {style?.name || styleId}
                            </span>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold text-gray-800">Package:</p>
                      <p>{PACKAGES[selectedPackage].name}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Total Images:</p>
                      <p>{PACKAGES[selectedPackage].images_per_style * Math.max(1, selectedStyles.length)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Processing Time:</p>
                      <p>{PACKAGES[selectedPackage].processing_time}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Total:</p>
                      <p className="text-xl font-bold text-purple-600">
                        {PACKAGES[selectedPackage].price === 0 ? '£0' : `£${PACKAGES[selectedPackage].price}`}
                      </p>
                    </div>
                  </div>
                </div>

                {!userEmail && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    />
                    <p className="text-xs text-gray-500 mt-2">We'll send your caricatures to this email</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="rounded-lg border border-gray-200 px-5 py-2 font-semibold text-gray-600 hover:border-purple-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!ownerImage || !petImage || (!userEmail && !email) || uploading}
                    className="btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Your Caricature...
                      </>
                    ) : (
                      'Create My Caricatures'
                    )}
                  </button>
                </div>
              </section>
            )}
          </div>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>By clicking create, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          )}
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
