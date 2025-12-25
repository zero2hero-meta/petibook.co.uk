import Link from 'next/link'
import { Star, Clock, Shield, Sparkles,Palette,ShieldCheck } from 'lucide-react'
import { BeforeAfterSlider } from './BeforeAfterSlider'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-white to-coral-50 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"> </div>

<div className="max-w-6xl mx-auto">
  <div className="
    grid grid-cols-1 
    md:grid-cols-2 
    gap-10 
    items-start
  ">
    
    {/* LEFT – 50% */}
    <div className="text-center md:text-left">
      <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto md:mx-0">
        Styles are inspired by popular cartoon aesthetics (e.g. South Park-like, Simpsons-like, Family Guy-like), but results are completely original.
      </p>
      <h1 className="text-3xl md:text-3xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-coral-500 to-yellow-300 bg-clip-text text-transparent leading-tight">
        You.Your Pet.One Iconic Caricature⭐
      </h1>

<div className="mt-8 space-y-4 text-lg text-gray-700">
  
  <div className="flex items-center gap-3">
    <Sparkles className="w-6 h-6 text-purple-600" />
    <span>
      <strong className="text-gray-900">Studio-Quality AI Caricatures</strong> — crafted from your photos
    </span>
  </div>

  <div className="flex items-center gap-3">
    <Palette className="w-6 h-6 text-pink-500" />
    <span>
      Choose from <strong className="text-gray-900">150+ Cartoon-Inspired Styles</strong>
    </span>
  </div>

  <div className="flex items-center gap-3">
    <Clock className="w-6 h-6 text-purple-600" />
    <span>
      <strong className="text-gray-900">Ready in Under 1 Hour</strong>
    </span>
  </div>

  <div className="flex items-center gap-3">
    <ShieldCheck className="w-6 h-6 text-green-600" />
    <span>
      <strong className="text-gray-900">100% Money-Back Guarantee</strong>
    </span>
  </div>

</div>
<br></br>
<p>
      <Link
        href="/create"
        className="btn-primary text-lg px-8 py-4 inline-block"
      >
        Create Caricature
      </Link>
      <Link
              href="#how-it-works"
              className="px-8 py-4 text-lg font-semibold text-purple-600 hover:text-purple-700 transition"
            >
              See How It Works
            </Link>
</p>
      <div className="mt-4">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 text-sm text-gray-600">
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

    {/* RIGHT – 50% */}
    <div className="
      flex justify-center 
      md:justify-end 
      md:scale-110 
      origin-top
    ">
      <BeforeAfterSlider
        beforeSrc="/images/homepage-slide/d1-owner.jpg"
        afterSrc="/images/homepage-slide/d1-ai.jpg"
        beforeLabel="Selfie"
        afterLabel="AI Generated"
        autoDemo
        aspectClassName="aspect-[4/5]"
      />
    </div>

  </div>
</div>


    </section>
  )
}
