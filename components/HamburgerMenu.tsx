'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Menu, X, User, LogOut, Image, CreditCard, Home, Palette } from 'lucide-react'

export default function HamburgerMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100">
          {user ? (
            <div className="py-2">
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-coral-50">
                <div className="flex items-center space-x-3">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="md:hidden py-2 border-b border-gray-100">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Home</span>
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Palette className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Pricing</span>
                </Link>
              </div>

              <div className="py-2">
                <Link
                  href="/create"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Palette className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Create Caricature</span>
                </Link>
                <Link
                  href="/gallery"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Image className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">My Caricatures</span>
                </Link>
                <Link
                  href="/payment-history"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Payment History</span>
                </Link>
              </div>

              <div className="border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <div className="md:hidden py-2 border-b border-gray-100">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Home</span>
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Palette className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Pricing</span>
                </Link>
              </div>

              <Link
                href="/create"
                className="flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Palette className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Try Free (No Login)</span>
              </Link>
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 transition-colors w-full border-t border-gray-100"
              >
                <User className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Sign In with Google</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
