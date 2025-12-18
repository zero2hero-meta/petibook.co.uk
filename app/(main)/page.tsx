import Hero from '@/components/Hero'
import FunShowcase from '@/components/FunShowcase'
import HowItWorks from '@/components/HowItWorks'
import Link from 'next/link'
import { Star, Check, ArrowRight, Zap, Heart, Shield } from 'lucide-react';

export default function HomePage() {
    const reviews = [
    {
      name: 'Sarah & Max',
      pet: 'Golden Retriever',
      rating: 5,
      text: 'These turned out hilarious! Everyone at the dog park loved them. My dog actually looks like me now!',
      avatar: '🐕'
    },
    {
      name: 'James & Whiskers',
      pet: 'Tabby Cat',
      rating: 5,
      text: 'Perfect gift for my girlfriend. The South Park style was exactly what we wanted. Amazing quality!',
      avatar: '🐱'
    },
    {
      name: 'Emma & Buddy',
      pet: 'Beagle',
      rating: 5,
      text: 'Worth every penny! Got the premium pack and now have custom merch for my pet Instagram.',
      avatar: '🐶'
    },
    {
      name: 'Michael & Luna',
      pet: 'Persian Cat',
      rating: 5,
      text: 'The AI perfectly captured both our features. My friends can\'t stop laughing. Highly recommend!',
      avatar: '😺'
    }
  ];
  
  return (
    <>
      <Hero />
      <FunShowcase />
      <HowItWorks />


      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Pet Parents Everywhere
            </h2>
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">4.8/5 from 1,500+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{review.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.pet}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎁', title: 'Unique Gifts', desc: 'Perfect for pet lovers' },
              { icon: '📱', title: 'Social Media', desc: 'Stand out profile pictures' },
              { icon: '🖼️', title: 'Wall Art', desc: 'Custom prints and canvas' },
              { icon: '📅', title: 'Holiday Cards', desc: 'Memorable greetings' },
              { icon: '🎉', title: 'Celebrations', desc: 'Pet birthday fun' },
              { icon: '👕', title: 'Merchandise', desc: 'T-shirts, mugs, more' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl hover:bg-purple-50 transition-colors">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


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
