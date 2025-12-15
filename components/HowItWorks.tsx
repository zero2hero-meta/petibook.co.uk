import { Upload, Palette, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your pet into a South Park character in just 3 easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-4">1</div>
            <h3 className="text-2xl font-bold mb-3">Upload Your Photos</h3>
            <p className="text-gray-600">
              Upload a clear photo of yourself and your beloved pet. Our AI assistant checks
              image quality automatically.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-bold text-coral-600 mb-4">2</div>
            <h3 className="text-2xl font-bold mb-3">Choose Your Style</h3>
            <p className="text-gray-600">
              Pick from 50+ cartoon styles, backgrounds, and scenes. South Park style, classic
              cartoon, modern digital art, and more!
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-bold text-yellow-400 mb-4">3</div>
            <h3 className="text-2xl font-bold mb-3">Get Your Caricatures</h3>
            <p className="text-gray-600">
              Receive 20-120 hilarious caricatures in under 1 hour. Download, share, or edit
              further in our AI Studio.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/create" className="btn-primary text-lg px-8 py-4 inline-block">
            Start Creating Now
          </Link>
        </div>
      </div>
    </section>
  )
}
