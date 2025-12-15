import Hero from '@/components/Hero'
import FunShowcase from '@/components/FunShowcase'
import HowItWorks from '@/components/HowItWorks'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FunShowcase />
      <HowItWorks />

      <section className="py-20 bg-gradient-to-br from-purple-600 to-coral-500">
        <div className="container-custom text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to See Your Pet's Funny Side?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join 10,000+ pet parents who've discovered their pet's inner personality
          </p>
          <Link
            href="/create"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
          >
            Start Creating Now - Try Free!
          </Link>
          <div className="mt-6 text-lg opacity-90">
            No credit card required for your first caricature
          </div>
        </div>
      </section>
    </>
  )
}
