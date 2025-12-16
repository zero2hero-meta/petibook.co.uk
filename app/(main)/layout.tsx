import Header from '@/components/Header'
import { createServerClient } from '@/lib/supabase/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-coral-400 bg-clip-text text-transparent">
                PetiBoo
              </h3>
              <p className="text-gray-400 text-sm">
                Turn your pet into your mini-me with AI-powered caricatures in South Park style.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/create" className="hover:text-white transition">
                    Create
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/gallery" className="hover:text-white transition">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 PetiBoo.co.uk. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
