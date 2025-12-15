import { PACKAGES } from '@/types'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container-custom max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-coral-500 bg-clip-text text-transparent">
            Choose Your Package
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your pet into a hilarious caricature with our AI-powered service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Object.entries(PACKAGES).map(([key, pkg]) => (
            <div
              key={key}
              className={`card relative ${
                key === 'popular' ? 'ring-4 ring-purple-600 scale-105' : ''
              }`}
            >
              {key === 'popular' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {pkg.price === 0 ? 'FREE' : `£${pkg.price}`}
                </div>
                <p className="text-gray-600 text-sm">{pkg.processing_time}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/create"
                className={`block text-center py-3 rounded-lg font-semibold transition ${
                  key === 'popular'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : key === 'free'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-coral-500 text-white hover:bg-coral-600'
                }`}
              >
                {key === 'free' ? 'Try Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>

        <div className="card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">How does PetiBoo work?</h3>
              <p className="text-gray-600">
                Our AI analyzes your photo and your pet's photo, then creates a hilarious South Park-style caricature that blends your facial features with your pet's appearance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I use these commercially?</h3>
              <p className="text-gray-600">
                Yes! All paid packages include a full commercial license. Use your caricatures for merchandise, social media, business purposes, and more.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What if I'm not happy with the results?</h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee on all paid packages. If you're not satisfied, we'll refund your purchase or offer a free redo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How long does it take?</h3>
              <p className="text-gray-600">
                Processing times vary by package, from 1-2 hours. You'll receive an email notification when your caricatures are ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
