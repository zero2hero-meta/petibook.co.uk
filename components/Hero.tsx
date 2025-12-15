import Link from 'next/link'
import { Star, Clock, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-white to-coral-50 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-coral-500 to-yellow-300 bg-clip-text text-transparent leading-tight">
            Turn Your Pet Into Your Mini-Me!
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            AI-Powered Pet Caricatures in South Park Style - Get Hilarious Results in Under 1 Hour
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/create" className="btn-primary text-lg px-8 py-4">
              Create My Pet Caricature
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 text-lg font-semibold text-purple-600 hover:text-purple-700 transition"
            >
              See How It Works
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>
                <strong className="text-gray-900">4.8/5</strong> from 1,500+ reviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Ready in 60 Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>100% Money-Back Guarantee</span>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            Join 10,000+ Happy Pet Parents
          </div>
        </div>
      </div>
    </section>
  )
}
