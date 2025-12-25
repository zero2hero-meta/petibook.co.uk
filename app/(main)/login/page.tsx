'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2, LogIn, Mail, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace('/create')
      }
    })
  }, [router, supabase])

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=/create`,
        },
      })
    } catch (err: any) {
      setError(err.message || 'Could not start Google sign-in. Please try again.')
      setLoading(false)
    }
  }

  const handleEmailSignIn = async () => {
    if (!email) {
      setError('Please enter your email.')
      return
    }
    try {
      setError('')
      setEmailLoading(true)
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=/create`,
        },
      })
      if (magicError) throw magicError
      setEmailSent(true)
    } catch (err: any) {
      setError(err.message || 'Could not send login link. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-10 bg-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Secure sign in
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Log in / Sign up</h1>
                <p className="text-gray-600">Sign in to access your account.</p>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl py-3 font-semibold text-gray-800 shadow-sm hover:shadow-lg transition disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              )}
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mybiz.com"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                />
              </div>
              <button
                onClick={handleEmailSignIn}
                disabled={emailLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-coral-500 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
              >
                {emailLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Send code to email
              </button>
            </div>

            {emailSent && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 text-green-700 text-sm px-4 py-3 border border-green-100">
                <CheckCircle className="w-5 h-5" />
                Check your inbox for a magic link.
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              By signing up, you accept our{' '}
              <a href="/terms" className="font-semibold text-purple-600 hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-semibold text-purple-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-purple-200/60 via-white to-orange-100 p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.3),transparent_25%)] pointer-events-none" />
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60">
              <div className="relative h-72 md:h-80">
                <img
                  src="images/homepage-slide/d3-ai.jpg"
                  alt="Testimonial"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-sm font-semibold text-gray-800 shadow">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    PetiBoo AI Generated
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-yellow-500 text-sm">
                  <span>★★★★★</span>
                  <span className="text-gray-600 font-semibold">4.5 from 2947 reviews</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  "After some initial results that were just okay, I requested a redo, and the second set came out perfect—now proudly featured on my LinkedIn."
                </p>
                <p className="text-sm font-semibold text-purple-700">— Abdel Hamad</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <Shield className="w-4 h-4" />
                  Compliant with top security standards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
